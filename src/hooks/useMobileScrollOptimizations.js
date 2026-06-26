import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isMobileViewport } from '../utils/performance'
import useMobilePullToRefresh from './useMobilePullToRefresh'

gsap.registerPlugin(ScrollTrigger)

const TOP_SCROLL_TOLERANCE = 6

export default function useMobileScrollOptimizations() {
  useMobilePullToRefresh()

  useEffect(() => {
    if (!isMobileViewport()) return undefined

    let normalizeEnabled = false

    const syncScrollMode = () => {
      const atTop =
        window.scrollY <= TOP_SCROLL_TOLERANCE &&
        (window.visualViewport?.offsetTop ?? 0) <= TOP_SCROLL_TOLERANCE
      const inCarPinSection = window.scrollY < window.innerHeight * 2.25

      if (atTop) {
        document.body.style.overscrollBehaviorY = 'auto'

        if (normalizeEnabled) {
          ScrollTrigger.normalizeScroll(false)
          normalizeEnabled = false
        }
        return
      }

      document.body.style.overscrollBehaviorY = 'none'

      // Keep normalizeScroll off during the pinned car intro — toggling it mid-scroll shifts the road/base.
      if (inCarPinSection) {
        if (normalizeEnabled) {
          ScrollTrigger.normalizeScroll(false)
          normalizeEnabled = false
        }
        return
      }

      if (!normalizeEnabled) {
        ScrollTrigger.normalizeScroll(true)
        normalizeEnabled = true
      }
    }

    syncScrollMode()

    const onResize = () => {
      syncScrollMode()
    }

    window.addEventListener('scroll', syncScrollMode, { passive: true })
    window.visualViewport?.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', syncScrollMode)
      window.visualViewport?.removeEventListener('resize', onResize)

      if (normalizeEnabled) {
        ScrollTrigger.normalizeScroll(false)
      }

      document.body.style.overscrollBehaviorY = ''
    }
  }, [])
}
