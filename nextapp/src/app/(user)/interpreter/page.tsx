"use client";
import { RefObject, useEffect, useRef, useState } from "react";
import BackgroundImage from "../../../../public/imgs/background.jpg"
import { Log } from "./components/Log"

interface LogInfo {
    time: string,
    transcription: string
}

export default function Interpreter () {

    const [LogData, setLogData] = useState<LogInfo[]>([

    ]); 

    const websocketConnection: RefObject<WebSocket> = useRef((undefined as unknown) as WebSocket);

    const [code, setCode] = useState("");

    useEffect(() => {
        fetch("/api/pair",
            {
                method: "POST"
            }
        )
        .then(resp => resp.json())
        .then((resp) => {
            setCode(resp['code']);
    
            websocketConnection.current = new WebSocket("wss://" + location.host)
    
            websocketConnection.current.addEventListener("open", () => {
                console.log("We are in!")
                websocketConnection.current.send(JSON.stringify({
                    code: resp['code']
                }))
                websocketConnection.current.addEventListener("message", (evt) => {
                    const payload = JSON.parse(evt["data"]);
                    if(payload && payload["status"]) {
                        if(payload["status"] == "connected") {
                            console.log("Hooked UPPP!!")
                        }
                    }
                })
            })
    
            websocketConnection.current.addEventListener("message", (evt) => {
                console.log(evt)
                try {
                    const data = JSON.parse(evt["data"]);
                    console.log(data)
                    if (data["transcript"]) {
                        console.log("transcript conditional succeeds") 
                        const date = new Date()
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