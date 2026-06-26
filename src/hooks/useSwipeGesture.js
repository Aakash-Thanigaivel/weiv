import { useRef } from 'react'

const SWIPE_THRESHOLD = 42

export default function useSwipeGesture({ onSwipeLeft, onSwipeRight, enabled = true }) {
  const startRef = useRef(null)

  const onTouchStart = (event) => {
    if (!enabled) return
    const touch = event.touches[0]
    if (!touch) return
    startRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event) => {
    if (!enabled || !startRef.current) return

    const touch = event.changedTouches[0]
    if (!touch) return

    const deltaX = touch.clientX - startRef.current.x
    const deltaY = touch.clientY - startRef.current.y

    startRef.current = null

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
      return
    }

    if (deltaX < 0) {
      onSwipeLeft?.()
      return
    }

    onSwipeRight?.()
  }

  return {
    onTouchStart,
    onTouchEnd,
  }
}
