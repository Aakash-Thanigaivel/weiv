import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { isMobileViewport } from '../utils/performance'

gsap.registerPlugin(ScrollTrigger)

export default function useMobileScrollOptimizations() {
  useEffect(() => {
    if (!isMobileViewport()) return undefined

    ScrollTrigger.normalizeScroll(true)

    const onRefresh = () => ScrollTrigger.refresh()
    window.visualViewport?.addEventListener('resize', onRefresh)
    window.visualViewport?.addEventListener('scroll', onRefresh)

    return () => {
      ScrollTrigger.normalizeScroll(false)
      window.visualViewport?.removeEventListener('resize', onRefresh)
      window.visualViewport?.removeEventListener('scroll', onRefresh)
    }
  }, [])
}
