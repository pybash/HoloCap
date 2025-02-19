'use client';
import {useMicVAD, utils } from "@ricky0123/vad-react";
import { useState } from "react";
import OpenAI, { toFile } from "openai";

export default function Home() {
  const [vadStatus, setVAD] = useState(false);
  const [caption, setCaption] = useState("");
  const openai = new OpenAI({
    apiKey: "sike",
    dangerouslyAllowBrowser: true
  });

  useMicVAD({
    startOnLoad: true,
    onSpeechStart: () => {
      setVAD(true);
    },
    onSpeechEnd: (audio) => {
      const wavBuffer = utils.encodeWAV(audio)
      const base64 = utils.arrayBufferToBase64(wavBuffer)
      const buffer = Buffer.from(base64, 'base64');
      
      toFile(buffer, "audio.wav").then((audioFile) => {
        openai.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-1",
          response_format: "json"
        }).then((resp) => {
          setCaption(caption + resp.text + " ")
        })
      })
      setVAD(false)
      
    }
  })
  
  return (
    <div>
      <p className="">STAUTS: {vadStatus ? "READING" : "NOPE"}</p>
      <p>{caption}</p>
    </div>
  );
}
