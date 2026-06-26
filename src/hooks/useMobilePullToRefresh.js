import { useEffect, useRef } from 'react'
import { isMobileViewport } from '../utils/performance'

const PULL_THRESHOLD = 88
const TOP_SCROLL_TOLERANCE = 6

export default function useMobilePullToRefresh() {
  const pullingRef = useRef(false)
  const startYRef = useRef(0)

  useEffect(() => {
    if (!isMobileViewport()) return undefined

    const isAtPageTop = () =>
      window.scrollY <= TOP_SCROLL_TOLERANCE &&
      (window.visualViewport?.offsetTop ?? 0) <= TOP_SCROLL_TOLERANCE

    const onTouchStart = (event) => {
      if (!isAtPageTop()) return
      pullingRef.current = true
      startYRef.current = event.touches[0]?.clientY ?? 0
    }

    const onTouchMove = (event) => {
      if (!pullingRef.current || !isAtPageTop()) return

      const currentY = event.touches[0]?.clientY ?? 0
      const pullDistance = currentY - startYRef.current

      if (pullDistance > PULL_THRESHOLD) {
        pullingRef.current = false
        window.location.reload()
      }
    }

    const onTouchEnd = () => {
      pullingRef.current = false
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [])
}
