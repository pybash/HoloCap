import asyncio
import websockets
import whisper
import base64
import io
from pydub import AudioSegment

# whisper model
model = whisper.load_model("small")  

async def transcribe_audio(websocket, path):
    async for message in websocket:
        data = json.loads(message)
        code = data.get("code")
        audio_data = data.get("data")

        if not audio_data:
            continue

        # b64 > wav
        audio_bytes = base64.b64decode(audio_data)
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format="mp3")
        audio.export("temp.wav", format="wav")

        # transcribe
        result = model.transcribe("temp.wav")
        transcript = result["text"]

        # send transcription back
        await websocket.send(json.dumps({"code": code, "transcript": transcript}))

async def main():
    async with websockets.serve(transcribe_audio, "0.0.0.0", 8765):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
