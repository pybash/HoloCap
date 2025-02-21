"use client";
import { useState } from "react";
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

    const [LogData, setLogData] = useState([
      {
        "time": "3:00",
        "transcription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lobortis, leo nec ultricies accumsan, lorem eros pharetra leo, vitae dignissim sem velit non tellus. Maecenas a felis est. Morbi vestibulum, tortor ut fermentum commodo, lacus sem porttitor arcu, in suscipit nisi felis non felis. Duis aliquam lorem eu varius tincidunt. Aenean aliquam interdum metus, ac maximus nisi iaculis a. Nunc nec dignissim dolor. Etiam a sodales dui, sed feugiat nulla. Morbi dapibus ipsum vitae sapien molestie semper. Cras nec dapibus nisl, quis molestie turpis. Aliquam ultrices risus at tortor blandit ultrices et a ante. Donec scelerisque viverra efficitur. Phasellus molestie nisi felis, nec suscipit libero lacinia sed."
      },{
        "time": "3:00",
        "transcription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lobortis, leo nec ultricies accumsan, lorem eros pharetra leo, vitae dignissim sem velit non tellus. Maecenas a felis est. Morbi vestibulum, tortor ut fermentum commodo, lacus sem porttitor arcu, in suscipit nisi felis non felis. Duis aliquam lorem eu varius tincidunt. Aenean aliquam interdum metus, ac maximus nisi iaculis a. Nunc nec dignissim dolor. Etiam a sodales dui, sed feugiat nulla. Morbi dapibus ipsum vitae sapien molestie semper. Cras nec dapibus nisl, quis molestie turpis. Aliquam ultrices risus at tortor blandit ultrices et a ante. Donec scelerisque viverra efficitur. Phasellus molestie nisi felis, nec suscipit libero lacinia sed."
      },{
        "time": "3:00",
        "transcription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lobortis, leo nec ultricies accumsan, lorem eros pharetra leo, vitae dignissim sem velit non tellus. Maecenas a felis est. Morbi vestibulum, tortor ut fermentum commodo, lacus sem porttitor arcu, in suscipit nisi felis non felis. Duis aliquam lorem eu varius tincidunt. Aenean aliquam interdum metus, ac maximus nisi iaculis a. Nunc nec dignissim dolor. Etiam a sodales dui, sed feugiat nulla. Morbi dapibus ipsum vitae sapien molestie semper. Cras nec dapibus nisl, quis molestie turpis. Aliquam ultrices risus at tortor blandit ultrices et a ante. Donec scelerisque viverra efficitur. Phasellus molestie nisi felis, nec suscipit libero lacinia sed."
      },{
        "time": "3:00",
        "transcription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lobortis, leo nec ultricies accumsan, lorem eros pharetra leo, vitae dignissim sem velit non tellus. Maecenas a felis est. Morbi vestibulum, tortor ut fermentum commodo, lacus sem porttitor arcu, in suscipit nisi felis non felis. Duis aliquam lorem eu varius tincidunt. Aenean aliquam interdum metus, ac maximus nisi iaculis a. Nunc nec dignissim dolor. Etiam a sodales dui, sed feugiat nulla. Morbi dapibus ipsum vitae sapien molestie semper. Cras nec dapibus nisl, quis molestie turpis. Aliquam ultrices risus at tortor blandit ultrices et a ante. Donec scelerisque viverra efficitur. Phasellus molestie nisi felis, nec suscipit libero lacinia sed."
      },{
        "time": "3:00",
        "transcription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lobortis, leo nec ultricies accumsan, lorem eros pharetra leo, vitae dignissim sem velit non tellus. Maecenas a felis est. Morbi vestibulum, tortor ut fermentum commodo, lacus sem porttitor arcu, in suscipit nisi felis non felis. Duis aliquam lorem eu varius tincidunt. Aenean aliquam interdum metus, ac maximus nisi iaculis a. Nunc nec dignissim dolor. Etiam a sodales dui, sed feugiat nulla. Morbi dapibus ipsum vitae sapien molestie semper. Cras nec dapibus nisl, quis molestie turpis. Aliquam ultrices risus at tortor blandit ultrices et a ante. Donec scelerisque viverra efficitur. Phasellus molestie nisi felis, nec suscipit libero lacinia sed."
      },{
        "time": "12:00",
        "transcription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris lobortis, leo nec ultricies accumsan, lorem eros pharetra leo, vitae dignissim sem velit non tellus. Maecenas a felis est. Morbi vestibulum, tortor ut fermentum commodo, lacus sem porttitor arcu, in suscipit nisi felis non felis. Duis aliquam lorem eu varius tincidunt. Aenean aliquam interdum metus, ac maximus nisi iaculis a. Nunc nec dignissim dolor. Etiam a sodales dui, sed feugiat nulla. Morbi dapibus ipsum vitae sapien molestie semper. Cras nec dapibus nisl, quis molestie turpis. Aliquam ultrices risus at tortor blandit ultrices et a ante. Donec scelerisque viverra efficitur. Phasellus molestie nisi felis, nec suscipit libero lacinia sed."
      },
    ]); 

    const [vadStatus, setVAD] = useState(false);
      const openai = new OpenAI({
        apiKey: config.apiKey,
        dangerouslyAllowBrowser: true
      });
    
      useMicVAD({
        startOnLoad: true,
        redemptionFrames: 4,
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
                let date = new Date()
                setLogData(oldLog => [...oldLog, {time: `${date.getHours()}:${date.getMinutes()}`, transcription: resp.text}])
            })
          })
          setVAD(false)
          
        }
      })

    return(
        <div className="min-h-[100vh] min-w-[100vw] bg-black flex justify-center items-center">
      <img src={BackgroundImage.src} className="w-full h-[100vh] object-cover select-none absolute top-0 left-0" />
      <div className="bg-[rgba(0,0,0,0.2)] w-full h-full absolute top-0 left-0"></div>
      <div className="w-full h-full flex flex-col items-center justify-center absolute top-0 left-0">
        <div className="w-[80%] h-[90%] flex flex-col justify-center items-center">
            <p className="text-[23px]">Holo<b>Cap</b></p>
            <div className="w-[100%] h-[85%] flex flex-col-reverse border rounded-lg backdrop-blur-[10px] items-center overflow-y-scroll">
                {
                    LogData.toReversed().map((elem, key) => (
                        <Log key={key} time={elem.time} transcription={elem.transcription} />
                    ))
                }
            </div>
            <div className="flex relative">
           
            <p>{vadStatus ? "LISTENING" : "WAITING"}</p>
            </div>
        </div>
      </div>
    </div>
    )
}