interface LogArguments {
    time: string,
    transcription: string
}

export const Log = ({time, transcription}: LogArguments) => {
    return(
        <div className=" flex w-[90%]">
            <p className="w-[70px] text-right py-[10px] text-[rgba(255,255,255,0.5)] text-[17px]">{time}</p>
            <p className="text-left py-[10px] ml-[10px] text-[17px]">{transcription}</p>
        </div>
    )
}