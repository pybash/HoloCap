require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const crypto = require('crypto');
const { OpenAI, toFile } = require('openai');
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

// Pages
app.get("/interpreter", (req,res) => {
    console.log("interpreter")
    res.sendFile(path.join(__dirname, 'out', 'interpreter.html'))
})
app.get("/mic", (req,res) => {
    res.sendFile(path.join(__dirname, 'out', 'mic.html'))
})

// pairing code
app.post('/api/pair', (req, res) => {
    const code = crypto.randomBytes(3).toString('hex'); // 6 digi hex
    activeSessions[code] = null;
    console.log(code)
    res.json({ code });
});

// hololens pairing
app.post('/api/connect', (req, res) => {
    const { code } = req.body;
    if (!activeSessions[code]) {
        return res.status(400).json({ error: 'Invalid or expired code' });
    }
    return res.status(200).res.json({ message: 'Connected successfully' });
});

// handle audio stream from Holo Lens
app.on('upgrade', (req, socket, head) => {
    console.log("CONNECT")
    wss.handleUpgrade(req, socket, head, (ws) => {
        ws.on('message', async (message) => {
            const { code, data, reqtype } = JSON.parse(message);
               // store websocket conns
            if (activeSessions[code] == null || activeSessions[code] == undefined) {
                activeSessions[code] = ws;
                console.log(`HoloLens connected with code: ${code}`);
                ws.send(JSON.stringify({status: "connected"}));
                return
            }
            if (!activeSessions[code]){
                ws.send(JSON.stringify({error:'Invalid or expired pairing code' }));
                return
            } else {
                if(reqtype == "PING") {
                    ws.send(JSON.stringify({"status": "OK_MIC_CONNECTED"}))
                }
            }

            // Decode base64 audio data thru openai
            if (data) {
                try {
                    // Turn it into a base64 buffer
                    
                    let buffer = Buffer.from(data, "base64")
                    let audioFile = await toFile(buffer, "audio.wav");
                    openai.audio.transcriptions.create({
                        file: audioFile,
                        model: 'whisper-1',
                        response_format: 'json'
                    }).then((resp) => {
                        console.log({
                            "code": code,
                            ...resp
                        })
                        if (activeSessions[code]) {
                            activeSessions[code].send(JSON.stringify({ transcript: resp.text }));
                        }
                    });
                    
                    // send transcription
                    
            } catch (error) {
                console.error(error);
            }
        }
    });
// remove websocket uppon disconnect
    ws.on('close', () => {
            Object.keys(activeSessions).forEach((key) => {
                if (activeSessions[key] === ws) {
                    delete activeSessions[key];
                    console.log(`Connection closed for code: ${key}`);
                }
            });
        });
    });
}); 
// start
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
server.on('upgrade', app.emit.bind(app, 'upgrade'));
