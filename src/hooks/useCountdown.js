import { useEffect, useState } from 'react'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

const toIstDate = (isoString) => new Date(`${isoString}+05:30`)

const getTimeParts = (targetDate) => {
  const now = new Date()
  const diff = Math.max(targetDate.getTime() - now.getTime(), 0)

  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
  }
}

export default function useCountdown(targetIso) {
  const [targetDate] = useState(() => toIstDate(targetIso))
  const [timeLeft, setTimeLeft] = useState(() => getTimeParts(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeParts(targetDate))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}
