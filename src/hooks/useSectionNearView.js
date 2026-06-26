import { useEffect, useRef, useState } from 'react'

export default function useSectionNearView(rootMargin = '320px 0px') {
  const ref = useRef(null)
  const [isNearView, setIsNearView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsNearView(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold: 0 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin])

  return [ref, isNearView]
}
