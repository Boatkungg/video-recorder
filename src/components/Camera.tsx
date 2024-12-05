import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CameraProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (videoBlob: Blob) => void;
}

export default function Camera({
  isRecording,
  onStartRecording,
  onStopRecording,
}: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
    }

    setupCamera();
  }, []);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      stopRecording();
    }
  });

  const startRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      mediaRecorderRef.current = new MediaRecorder(
        videoRef.current.srcObject as MediaStream
      );
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.onstop = handleStop;
      mediaRecorderRef.current.start();
      chunksRef.current = [];
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };

  const handleStop = () => {
    const videoBlob = new Blob(chunksRef.current, { type: "video/webm" });
    onStopRecording(videoBlob);
  };

  return (
    <div className="mb-8">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full max-w-2xl mx-auto mb-4 rounded-lg shadow-lg"
      />
      <div className="text-center">
        <Button onClick={isRecording ? stopRecording : onStartRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      </div>
    </div>
  );
}
