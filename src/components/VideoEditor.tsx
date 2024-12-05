import { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/double-slider'
import { Input } from '@/components/ui/input'

interface VideoEditorProps {
  videoSrc: string
  onDiscard: () => void
  onSave: (trimInfo: { trimStart: number; trimEnd: number; duration: number; videoName: string }) => void
}

export default function VideoEditor({ videoSrc, onDiscard, onSave }: VideoEditorProps) {
  // const [playing, setPlaying] = useState(true)
  const [duration, setDuration] = useState(0)
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(0)
  const [videoName, setVideoName] = useState('')
  const playerRef = useRef<ReactPlayer>(null)

  useEffect(() => {
    setTrimEnd(duration)
  }, [duration])

  const handleDuration = (duration: number) => {
    setDuration(duration)
    setTrimEnd(duration)
  }

  const handleTrimChange = (values: number[]) => {
    setTrimStart(values[0])
    setTrimEnd(values[1])
  }

  const handleSave = () => {
    if (!videoName.trim()) return
    onSave({
      trimStart,
      trimEnd,
      duration,
      videoName: videoName.trim()
    })
  }

  return (
    <div className="mt-8">
      <ReactPlayer
        ref={playerRef}
        url={videoSrc}
        playing={true}
        onProgress={() => handleDuration(playerRef.current?.getDuration() || 0)}
        controls
        width="100%"
        height="auto"
      />
      <div className="mt-4">
        <Slider
          min={0}
          max={duration}
          step={0.1}
          value={[trimStart, trimEnd]}
          onValueChange={handleTrimChange}
        />
        <div className="flex justify-between mt-2">
          <span>Start: {trimStart.toFixed(1)}s</span>
          <span>End: {trimEnd.toFixed(1)}s</span>
        </div>
      </div>
      <div className="mt-4">
        <Input
          type="text"
          placeholder="Enter video name"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
          className="mb-4"
        />
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <Button onClick={onDiscard} variant="destructive">Discard</Button>
        <Button onClick={handleSave} disabled={!videoName.trim() || !isFinite(duration)}>Save</Button>
      </div>
    </div>
  )
}




// import { useState, useRef, useEffect } from 'react'
// import ReactPlayer from 'react-player'
// import { Button } from '@/components/ui/button'
// import { Slider } from '@/components/ui/double-slider'
// import { Input } from '@/components/ui/input'

// interface VideoEditorProps {
//   videoSrc: string
//   onDiscard: () => void
//   onSave: (trimmedVideo: Blob, videoName: string) => void
// }

// export default function VideoEditor({ videoSrc, onDiscard, onSave }: VideoEditorProps) {
//   const [playing, setPlaying] = useState(false)
//   const [duration, setDuration] = useState(0)
//   const [trimStart, setTrimStart] = useState(0)
//   const [trimEnd, setTrimEnd] = useState(0)
//   const [videoName, setVideoName] = useState('')
//   const playerRef = useRef<ReactPlayer>(null)

//   useEffect(() => {
//     setTrimEnd(duration)
//   }, [duration])

//   const handleDuration = (duration: number) => {
//     console.log('Duration:', duration)
//     setDuration(duration)
//     setTrimEnd(duration)
//   }

//   const handleTrimChange = (values: number[]) => {
//     setTrimStart(values[0])
//     setTrimEnd(values[1])
//   }

//   const handleSave = async () => {
//     if (!playerRef.current || !videoName.trim()) return

//     const player = playerRef.current.getInternalPlayer()
//     if (!player) return

//     // Trim the video
//     const canvas = document.createElement('canvas')
//     canvas.width = player.videoWidth
//     canvas.height = player.videoHeight
//     const ctx = canvas.getContext('2d')

//     if (!ctx) return

//     const trimmedFrames: ImageData[] = []

//     for (let i = trimStart; i <= trimEnd; i += 0.1) {
//       player.currentTime = i
//       ctx.drawImage(player as HTMLVideoElement, 0, 0, canvas.width, canvas.height)
//       trimmedFrames.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
//     }

//     // Create a new video from the trimmed frames
//     const trimmedVideo = new Blob(trimmedFrames.map(frame => {
//       const tempCanvas = document.createElement('canvas')
//       tempCanvas.width = canvas.width
//       tempCanvas.height = canvas.height
//       const tempCtx = tempCanvas.getContext('2d')
//       if (tempCtx) {
//         tempCtx.putImageData(frame, 0, 0)
//       }
//       return tempCanvas.toDataURL('image/webp')
//     }), { type: 'video/webm' })

//     onSave(trimmedVideo, videoName.trim())
//   }

//   return (
//     <div className="mt-8">
//       <ReactPlayer
//         ref={playerRef}
//         url={videoSrc}
//         playing={true}
//         onProgress={() => handleDuration(playerRef.current?.getDuration() || 0)}
//         controls
//         width="100%"
//         height="auto"
//       />
//       <div className="mt-4">
//         <Slider
//           min={0}
//           max={duration}
//           step={0.1}
//           value={[trimStart, trimEnd]}
//           onValueChange={handleTrimChange}
//         />
//         <div className="flex justify-between mt-2">
//           <span>Start: {trimStart.toFixed(1)}s</span>
//           <span>End: {trimEnd.toFixed(1)}s</span>
//         </div>
//       </div>
//       <div className="mt-4">
//         <Input
//           type="text"
//           placeholder="Enter video name"
//           value={videoName}
//           onChange={(e) => setVideoName(e.target.value)}
//           className="mb-4"
//         />
//       </div>
//       <div className="flex justify-center mt-4 space-x-4">
//         <Button onClick={onDiscard} variant="destructive">Discard</Button>
//         <Button onClick={handleSave} disabled={!videoName.trim() || !isFinite(duration)}>Save</Button>
//       </div>
//     </div>
//   )
// }

