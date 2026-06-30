import { useEffect, useRef, useState } from 'react'

function SectionScrollArrow() {
  return (
    <svg viewBox="0 0 24 24" className="section-scroll-cue-icon" aria-hidden="true">
      <path
        d="M12 5.5 12 17M12 17 7.4 12.4M12 17 16.6 12.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SectionScrollCue() {
  const hostRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const section = host.closest('section')
    if (!section) {
      setVisible(true)
      return undefined
    }

    const updateVisibility = ([entry]) => {
      if (!entry) return
      setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.28)
    }

    const observer = new IntersectionObserver(updateVisibility, {
      threshold: [0, 0.28, 0.45, 0.65, 0.85],
    })

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={hostRef}
      className={`section-scroll-cue-host${visible ? ' section-scroll-cue-host--visible' : ''}`}
      aria-hidden={!visible}
    >
      <div className="section-scroll-cue">
        <span className="section-scroll-cue-arrow">
          <SectionScrollArrow />
        </span>
        <span className="section-scroll-cue-label">Swipe Up to Continue</span>
        <span className="section-scroll-cue-arrow">
          <SectionScrollArrow />
        </span>
      </div>
    </div>
  )
}
