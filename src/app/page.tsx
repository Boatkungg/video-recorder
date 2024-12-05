'use client'

import { useState, useRef } from 'react'
import Camera from '@/components/Camera'
import VideoEditor from '@/components/VideoEditor'
import CountdownTimer from '@/components/CountdownTimer'
import { toast } from '@/hooks/use-toast'

export default function Home() {
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const videoRef = useRef<HTMLDivElement>(null)

  const handleStartRecording = () => {
    setShowCountdown(true)
    setTimeout(() => {
      setShowCountdown(false)
      setIsRecording(true)
    }, 1000)
  }

  const handleStopRecording = (videoBlob: Blob) => {
    setIsRecording(false)
    setRecordedVideo(URL.createObjectURL(videoBlob))
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.scrollIntoView({behavior: 'smooth', block: 'center'})
      }
    }, 600)
  }

  const handleDiscard = () => {
    setRecordedVideo(null)
  }

  const handleSave = async (trimInfo: { trimStart: number; trimEnd: number; duration: number; videoName: string }) => {
    console.log(`Saving video "${trimInfo.videoName}" to server...`)
    
    try {
      const videoBlob = await fetch(recordedVideo!).then(r => r.blob())
      const formData = new FormData()
      const video_file = new File([videoBlob], `${trimInfo.videoName}.webm`, {type: 'video/webm'})
      formData.append('video', video_file)
      formData.append('trim_start', trimInfo.trimStart.toString())
      formData.append('trim_end', trimInfo.trimEnd.toString())
      formData.append('video_name', trimInfo.videoName)
      
      // send the video to the server
      const response = await fetch('api/save-video', {
        method: 'POST',
        body: formData,
      })
  
      if (!response.ok) {
        throw new Error('Failed to save video')
      }
  
      const result = await response.json()
      console.log('Video saved successfully:', result.filename)
      toast({
        title: 'Video saved successfully',
        description: `The video "${result.filename}" has been saved successfully.`,
      })
      setRecordedVideo(null) // Reset the recorded video state
    } catch (error) {
      console.error('Error saving video:', error)
      toast({
        title: 'Failed to save video',
        description: 'An error occurred while saving the video. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Video Dataset Recorder</h1>
        
        <Camera
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />
        
        {showCountdown && <CountdownTimer duration={1} />}
        
        {recordedVideo && (
          <div ref={videoRef}>
            <VideoEditor
              videoSrc={recordedVideo}
              onDiscard={handleDiscard}
              onSave={handleSave}
            />
          </div>
        )}
      </div>
    </main>
  )
}
