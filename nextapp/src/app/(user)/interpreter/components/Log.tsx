interface LogArguments {
    time: string,
    transcription: string
}

export const Log = ({time, transcription}: LogArguments) => {
    return(
        <div className="w-full flex">
            <p className="w-[70px] text-right py-[10px] text-[rgba(255,255,255,0.5)]">{time}</p>
            <p className="text-right py-[10px] ml-[10px]">{transcription}</p>
        </div>
    )
}