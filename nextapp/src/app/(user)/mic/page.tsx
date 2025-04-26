"use client"; // This is a client component
import { RefObject, useEffect, useRef, useState } from "react";
import AudioAnimation from "./components/AudioAnimation";
import { useMicVAD, utils } from "@ricky0123/vad-react";

export default function Microphone() {
    const [recording, setRecording] = useState(true);
    const [code, setCode] = useState("");
    
    const [codeIn, setCodeIn] = useState("");

    const [paired, setPair] = useState(false)
    const [vadEnabled, setVAD] = useState(false);
    const websocketConnection: RefObject<WebSocket> = useRef((undefined as unknown) as WebSocket);
    useEffect(() => {
        const socket = new WebSocket('wss://' + location.host)
        socket.addEventListener("open", () => {
            socket.addEventListener("message", (evt)=> {
                console.log(evt)
                const jsonData = JSON.parse(evt.data)
                if (jsonData["status"] && jsonData["status"] == "OK_MIC_CONNECTED") {
                    setPair(true);
                }
            }) 
        })
        websocketConnection.current = socket
        
        return () => {
            socket.close()
        }
    },[])
    
    useMicVAD({
        startOnLoad: true,
        redemptionFrames: 4,
        negativeSpeechThreshold: 3,
        onSpeechStart: () => {
            if(!recording || !paired) return;
            setVAD(true);
        },
        onSpeechEnd: (audio) => {
            if(!vadEnabled || !recording || !paired) return;
            const wavBuffer = utils.encodeWAV(audio)
            const base64 = utils.arrayBufferToBase64(wavBuffer)


            websocketConnection.current.send(JSON.stringify({
                code: code,
                data: base64
            }))
            setVAD(false)
            
        },
        model: "v5"
    })
    

    const pairDevice = () => {
        setCode(codeIn);
        
        websocketConnection.current.send(JSON.stringify({
            "code": codeIn,
            "reqtype": "PING"
        }))

    }


    return (
        <div className="flex w-[100vw] h-[100vh] items-center justify-center">
            <div className={"w-[50%] flex flex-col justify-between "  + (paired ? "hidden" : "flex")}>
                <p className="text-[20px]">Device Code</p>
                <input onChange={(evt)=> {setCodeIn(evt.target.value)}} value={codeIn} className="bg-black text-white outline-solid p-[10px] text-[17px] rounded-lg border-[2px] mb-[15px]"/>
                <button className="border-[2px] rounded-lg py-[10px]" onClick={pairDevice}>Connect</button>
            </div>
            <div className={"w-[80%] h-[80%] flex-col justify-between " + (paired ? "flex" : "hidden")}>
                {/* Header */}
                <div className="flex flex-col items-center w-full">
                    <h2 className="text-[40px]">Holo<b>Cap</b></h2>
                    <p className="text-[24px]">Microphone Device</p>
                    <p className="text-[20px]">Paired to <b>{code}</b></p>
                </div>
                {/* Buttons */}
                <div className="flex flex-col items-center w-full ">
                    <div className="flex items-center">
                        <AudioAnimation active={recording} />
                        <h2 className="pl-[15px] text-[25px] font-bold text-[rgba(255,255,255,.5)]">{recording ? "LISTENING" : "PAUSED"}</h2>
                    </div>
                    <div className="w-[75px] h-[75px] bg-[rgba(255,255,255,0.2)] mt-[15px] rounded-full flex justify-center items-center cursor-pointer" onClick={() => { setRecording(!recording) }}>
                        {
                            recording ?
                                <svg fill="#fff" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512" enableBackground="new 0 0 512 512">
                                    <path d="M139.6,0H46.5C20.9,0,0,20.9,0,46.5v418.9C0,491.1,20.9,512,46.5,512h93.1c25.7,0,46.5-20.9,46.5-46.5V46.5
                                C186.2,20.9,165.3,0,139.6,0z M465.5,0h-93.1c-25.7,0-46.5,20.9-46.5,46.5v418.9c0,25.7,20.9,46.5,46.5,46.5h93.1
                                c25.7,0,46.5-20.9,46.5-46.5V46.5C512,20.9,491.1,0,465.5,0z"/>
                                </svg>
                                :
                                <svg width="20px" height="20px" viewBox="-0.5 0 7 7" version="1.1" xmlns="http://www.w3.org/2000/svg">

                                    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                        <g id="Dribbble-Light-Preview" transform="translate(-347.000000, -3766.000000)" fill="#fff  ">
                                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                                <path d="M296.494737,3608.57322 L292.500752,3606.14219 C291.83208,3605.73542 291,3606.25002 291,3607.06891 L291,3611.93095 C291,3612.7509 291.83208,3613.26444 292.500752,3612.85767 L296.494737,3610.42771 C297.168421,3610.01774 297.168421,3608.98319 296.494737,3608.57322" id="play-[#1003]">

                                                </path>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}