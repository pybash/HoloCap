require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

//mw stuff
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(express.static(path.join(__dirname, 'out'))); 

//openai init
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//transcription endpoint
app.post('/api/transcript', async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'no audio data provided' });
    }

    const response = await openai.audio.transcriptions.create({
      file: Buffer.from(data, 'base64'),
      model: 'whisper-1',
    });

    res.json({ transcript: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'failed to process' });
  }
});
//catchall
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'out', 'index.html'));
});

//start server
app.listen(port, () => {
  console.log(`server on port ${port}`);
});
