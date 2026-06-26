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

      if (atTop) {
        document.body.style.overscrollBehaviorY = 'auto'

        if (normalizeEnabled) {
          ScrollTrigger.normalizeScroll(false)
          normalizeEnabled = false
        }
        return
      }

      document.body.style.overscrollBehaviorY = 'none'

      if (!normalizeEnabled) {
        ScrollTrigger.normalizeScroll(true)
        normalizeEnabled = true
      }
    }

    syncScrollMode()

    const onRefresh = () => {
      syncScrollMode()
      ScrollTrigger.refresh()
    }

    window.addEventListener('scroll', syncScrollMode, { passive: true })
    window.visualViewport?.addEventListener('resize', onRefresh)
    window.visualViewport?.addEventListener('scroll', onRefresh)

    return () => {
      window.removeEventListener('scroll', syncScrollMode)
      window.visualViewport?.removeEventListener('resize', onRefresh)
      window.visualViewport?.removeEventListener('scroll', onRefresh)

      if (normalizeEnabled) {
        ScrollTrigger.normalizeScroll(false)
      }

      document.body.style.overscrollBehaviorY = ''
    }
  }, [])
}
