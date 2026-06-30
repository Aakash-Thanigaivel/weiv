import { useEffect, useRef, useState } from 'react'
import { isMobileViewport } from '../utils/performance'

const IDLE_MS = 3000
const INTRO_GRACE_MS = 2600

function isInCarZone() {
  const spacer = document.querySelector('.cinematic-car-pin-spacer')
  if (!spacer) {
    return window.scrollY < window.innerHeight * 1.6
  }

  const endScroll = Math.max(
    0,
    spacer.offsetTop + spacer.offsetHeight - window.innerHeight + 40,
  )

  return window.scrollY <= endScroll
}

export default function InviteSwipeMistHint() {
  const [visible, setVisible] = useState(false)
  const idleTimerRef = useRef(null)
  const armedRef = useRef(false)
  const leftCarZoneRef = useRef(false)

  useEffect(() => {
    if (!isMobileViewport()) return undefined

    const clearIdleTimer = () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current)
        idleTimerRef.current = null
      }
    }

    const scheduleIdleCheck = () => {
      clearIdleTimer()

      if (!armedRef.current || leftCarZoneRef.current) {
        setVisible(false)
        return
      }

      if (!isInCarZone()) {
        leftCarZoneRef.current = true
        setVisible(false)
        return
      }

      idleTimerRef.current = window.setTimeout(() => {
        if (leftCarZoneRef.current || !isInCarZone()) {
          setVisible(false)
          return
        }

        setVisible(true)
      }, IDLE_MS)
    }

    const onActivity = () => {
      setVisible(false)

      if (leftCarZoneRef.current) return

      if (!isInCarZone()) {
        leftCarZoneRef.current = true
        clearIdleTimer()
        return
      }

      scheduleIdleCheck()
    }

    const armTimer = window.setTimeout(() => {
      armedRef.current = true
      scheduleIdleCheck()
    }, INTRO_GRACE_MS)

    window.addEventListener('scroll', onActivity, { passive: true })
    window.addEventListener('touchstart', onActivity, { passive: true })
    window.addEventListener('touchmove', onActivity, { passive: true })
    window.addEventListener('wheel', onActivity, { passive: true })
    window.addEventListener('resize', onActivity)

    return () => {
      window.clearTimeout(armTimer)
      clearIdleTimer()
      window.removeEventListener('scroll', onActivity)
      window.removeEventListener('touchstart', onActivity)
      window.removeEventListener('touchmove', onActivity)
      window.removeEventListener('wheel', onActivity)
      window.removeEventListener('resize', onActivity)
    }
  }, [])

  return (
    <div
      className={`invite-swipe-mist${visible ? ' invite-swipe-mist--visible' : ''}`}
      aria-hidden={!visible}
    >
      <div className="invite-swipe-mist-fog invite-swipe-mist-fog--back" />
      <div className="invite-swipe-mist-fog invite-swipe-mist-fog--front" />
      <p className="invite-swipe-mist-cloud">Swipe to explore more of our story</p>
    </div>
  )
}
