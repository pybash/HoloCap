"use client";
import { useEffect, useState } from "react";
import BackgroundImage from "../../../../public/imgs/background.jpg"
import { Log } from "./components/Log"
import OpenAI, { toFile } from "openai";
import { useMicVAD, utils } from "@ricky0123/vad-react";
import config from "../../apiconfig.json"

interface LogInfo {
    time: string,
    transcription: string
}

export default function Interpreter () {

    const [LogData, setLogData] = useState<LogInfo[]>([

    ]); 

    let websocketConnection: WebSocket;

    const [code, setCode] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/pair",
            {
                method: "POST"
            }
        )
        .then(resp => resp.json())
        .then((resp) => {
            setCode(resp['code']);
    
            websocketConnection= new WebSocket("ws://localhost:5000/")
    
            websocketConnection.addEventListener("open", (evt) => {
                console.log("We are in!")
                websocketConnection.send(JSON.stringify({
                    code: resp['code']
                }))
                websocketConnection.addEventListener("message", (evt) => {
                    let payload = JSON.parse(evt["data"]);
                    if(payload && payload["status"]) {
                        if(payload["status"] == "connected") {
                            console.log("Hooked UPPP!!")
                        }
                    }
                })
            })
    
            websocketConnection.addEventListener("message", (evt) => {
                console.log(evt)
                try {
                    let data = JSON.parse(evt["data"]);
                    console.log(data)
                    if (data["transcript"]) {
                        console.log("transcript conditional succeeds")
                        let date = new Date()
                        setLogData(oldLog => [
                            ...oldLog,
                            {time: `${date.getHours()}:${date.getMinutes()}`, transcription: data["transcript"]}
                        ])
                        console.log(LogData)
                    }
                } catch (e) {
                    return console.error(e);
                }
            })
        })
    }, [])


    // const [vadStatus, setVAD] = useState(false);
    //   const openai = new OpenAI({
    //     apiKey: config.apiKey,
    //     dangerouslyAllowBrowser: true
    //   });
    
    //   useMicVAD({
    //     startOnLoad: true,
    //     redemptionFrames: 4,
    //     onSpeechStart: () => {
    //       setVAD(true);
    //     },
    //     onSpeechEnd: (audio) => {
    //       const wavBuffer = utils.encodeWAV(audio)
    //       const base64 = utils.arrayBufferToBase64(wavBuffer)
    //       const buffer = Buffer.from(base64, 'base64');
          
    //       toFile(buffer, "audio.wav").then((audioFile) => {
    //         openai.audio.transcriptions.create({
    //           file: audioFile,
    //           model: "whisper-1",
    //           response_format: "json"
    //         }).then((resp) => {
    //             let date = new Date()
    //             setLogData(oldLog => [...oldLog, {time: `${date.getHours()}:${date.getMinutes()}`, transcription: resp.text}])
    //         })
    //       })
    //       setVAD(false)
          
    //     }
    //   })

    return(
        <div className="min-h-[100vh] min-w-[100vw] bg-black flex justify-center items-center">
      <img src={BackgroundImage.src} className="w-full h-[100vh] object-cover select-none absolute top-0 left-0" />
      <div className="bg-[rgba(0,0,0,0.2)] w-full h-full absolute top-0 left-0"></div>
      <div className="w-full h-full flex flex-col items-center justify-center absolute top-0 left-0">
        <div className="w-[80%] h-[90%] flex flex-col justify-center items-center">
            <div className="w-full flex justify-between items-center">
                <p className="text-[23px]">Holo<b>Cap</b></p>
                <p className="text-[20px]">Code: <b>{code}</b></p>
            </div>
            <div className="w-[100%] h-[85%] flex flex-col-reverse border rounded-lg backdrop-blur-[10px] items-center overflow-y-scroll">
                {
                    LogData.toReversed().map((elem, key) => (
                        <Log key={key} time={elem.time} transcription={elem.transcription} />
                    ))
                }
            </div>
            <div className="flex relative">
           
            {/* <p>{vadStatus ? "LISTENING" : "WAITING"}</p> */}
            </div>
        </div>
      </div>
    </div>
    )
}