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

export default function SectionScrollCue({ show = true }) {
  if (!show) return null

  return (
    <div className="section-scroll-cue-host" aria-hidden="false">
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
