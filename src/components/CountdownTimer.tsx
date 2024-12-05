import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  duration: number
}

export default function CountdownTimer({ duration }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="text-white text-9xl font-bold">{timeLeft}</div>
    </div>
  )
}

