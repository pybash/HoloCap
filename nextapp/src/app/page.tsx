'use client'
import BackgroundImage from "../../public/imgs/background.jpg"

export default function Home() {

  const gotoInterpreter = () => {
    location.href = "/user_holocap.html"
  }

  const gotoMic = () => {
    location.href = "/mic"
  }

  return (
    <div className="min-h-[100vh] min-w-[100vw] bg-black flex justify-center items-center">
      <img src={BackgroundImage.src} className="w-full h-[100vh] object-cover select-none absolute top-0 left-0" />
      <div className="bg-[rgba(0,0,0,0.3)] w-full h-full absolute top-0 left-0"></div>
      <div className="w-full h-full flex flex-col items-center justify-center absolute top-0 left-0">
        <div className="w-[80%] h-[50%] flex flex-col">
          <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="flex flex-col items-center">
              <h1 className="text-[50px] select-none">Holo<b>Cap</b></h1>
              <p>Developed by the SSE</p>
            </div>
            <a className="w-[30%] text-[25px] p-[10px] border rounded-lg backdrop-blur-sm cursor-pointer text-center" onClick={gotoInterpreter}>HoloLens Client</a>
            <a className="w-[30%] text-[25px] p-[10px] border rounded-lg backdrop-blur-sm cursor-pointer text-center" onClick={gotoMic}>Microphone Client</a>
          </div>
          
        </div>
      </div>
    </div>
  );
}
