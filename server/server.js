require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const crypto = require('crypto');
const { OpenAI } = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'out')));

// active sessions
const activeSessions = {};

// websocket server
const wss = new WebSocket.Server({ noServer: true });

// pairing code
app.post('/api/pair', (req, res) => {
    const code = crypto.randomBytes(3).toString('hex'); // 6 digi hex
    activeSessions[code] = null;
    res.json({ code });
});

// hololens pairing
app.post('/api/connect', (req, res) => {
    const { code } = req.body;
    if (!activeSessions[code]) {
        return res.status(400).json({ error: 'Invalid or expired code' });
    }
    res.json({ message: 'Connected successfully' });
});

// handle audio stream from HoloLens
app.on('upgrade', (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        ws.on('message', async (message) => {
            const { code, data } = JSON.parse(message);
            if (!activeSessions[code]) return;

            // Decode base64 audio data thru openai
            try {
                const response = await openai.audio.transcriptions.create({
                    file: Buffer.from(data, 'base64'),
                    model: 'whisper-1',
                });

                // send transcription
                activeSessions[code]?.send(JSON.stringify({ transcript: response.text }));
            } catch (error) {
                console.error(error);
            }
        });

        activeSessions[req.url.replace('/?code=', '')] = ws;
    });
});

// start
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
server.on('upgrade', app.emit.bind(app, 'upgrade'));
