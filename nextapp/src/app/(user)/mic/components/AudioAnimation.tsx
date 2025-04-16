
export default function AudioAnimation({active}: {active: boolean}) {

    return(
        <div className="w-[40px] h-[40px] flex items-center justify-between">
            {
                active ?
                <div className="w-full h-full flex items-center justify-between">
                    <div className="w-[5px] h-[20%] bg-white rounded-full animate-[audiowave_1000ms_ease-in-out_infinite] animate-delay-[100ms]"></div>
                    <div className="w-[5px] h-[20%] bg-white rounded-full animate-[audiowave_1000ms_ease-in-out_infinite] animate-delay-[200ms]"></div>
                    <div className="w-[5px] h-[20%] bg-white rounded-full animate-[audiowave_1000ms_ease-in-out_infinite] animate-delay-[300ms]"></div>
                    <div className="w-[5px] h-[20%] bg-white rounded-full animate-[audiowave_1000ms_ease-in-out_infinite] animate-delay-[400ms]"></div>
                    <div className="w-[5px] h-[20%] bg-white rounded-full animate-[audiowave_1000ms_ease-in-out_infinite] animate-delay-[500ms]"></div>
                </div>
                :
                <div className="w-full h-full flex items-center justify-between">
                    <div className="w-[5px] h-[20%] bg-white rounded-full "></div>
                    <div className="w-[5px] h-[20%] bg-white rounded-full "></div>
                    <div className="w-[5px] h-[20%] bg-white rounded-full "></div>
                    <div className="w-[5px] h-[20%] bg-white rounded-full "></div>
                    <div className="w-[5px] h-[20%] bg-white rounded-full "></div>
            
                </div>
            }
        </div>
    )
}