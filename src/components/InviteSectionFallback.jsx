export default function InviteSectionFallback({ minHeight = '100dvh' }) {
  return (
    <div
      className="invite-section-fallback"
      style={{ minHeight }}
      aria-hidden="true"
    />
  )
}
