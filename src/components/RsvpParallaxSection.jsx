import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionScrollCue from './SectionScrollCue'

const cinematicEase = [0.22, 1, 0.36, 1]

const WHATSAPP_BLESSING = encodeURIComponent(
  "Heartfelt blessings to Aakash & Viji on their wedding. Wishing you a lifetime of love, laughter, and togetherness."
)

const rsvpSides = [
  {
    key: 'bride',
    emoji: '👰',
    title: "Bride's Family",
    description:
      'Send your love, blessings, and warm wishes to the bride and her family.',
    action: 'Message on WhatsApp',
    phone: '918098326046',
  },
  {
    key: 'groom',
    emoji: '🤵',
    title: "Groom's Family",
    description:
      'Send your love, blessings, and warm wishes to the groom and his family.',
    action: 'Message on WhatsApp',
    phone: '919841795182',
  },
]

export default function RsvpParallaxSection() {
  const [isOpen, setIsOpen] = useState(false)
  const sectionRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const sec = sectionRef.current
      const txt = textRef.current
      if (!sec || !txt) return
      const rect = sec.getBoundingClientRect()
      const ih = window.visualViewport?.height ?? window.innerHeight
      const range = sec.offsetHeight - ih
      const progress = range > 0 ? Math.max(0, Math.min(1, -rect.top / range)) : 0
      txt.style.transform = `translate3d(0, ${progress * ih * 0.52}px, 0)`
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  return (
    <section
      ref={sectionRef}
      className="rsvp-section invite-section-below-fold relative z-20 min-h-[145dvh] sm:min-h-[130svh]"
      aria-label="RSVP section"
    >
      {/* Frame anchored near section bottom so its lower portion still spills into the NEXT section's background */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex sm:translate-y-[32%] justify-center">
        <div className="relative w-[78vw] max-w-[32rem] md:w-[42vw] md:max-w-[38rem]">
          <div className="rsvp-polaroid-window absolute overflow-hidden">
            <img
              src="/AakViji.jpeg"
              alt="Couple inside polaroid frame"
              className="rsvp-polaroid-photo object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          <img
            src="/frame.png"
            alt=""
            aria-hidden="true"
            className="relative block w-full select-none drop-shadow-[0_30px_50px_rgba(0,0,0,0.45)]"
            draggable={false}
          />
        </div>
      </div>

      {/* Sticky stage holds only the text/CTA so it can translate while user scrolls through the tall section */}
      <div className="sticky top-0 z-20 h-[100svh] w-full">
        {/* Headline + circle CTA — translates downward as the user scrolls */}
        <div
          ref={textRef}
          className="absolute inset-x-0 top-[9svh] sm:top-[12svh] z-20 mx-auto flex w-full max-w-[13rem] sm:max-w-[15rem] flex-col items-center px-3 text-center md:max-w-[18rem] will-change-transform"
        >
          <h2 className="rsvp-headline font-heading text-[1.1rem] sm:text-[1.4rem] uppercase leading-[1.15] tracking-[0.08em] md:text-[1.8rem]">
            Your presence
          </h2>
          <h2 className="rsvp-headline font-heading text-[1.1rem] sm:text-[1.4rem] uppercase leading-[1.15] tracking-[0.08em] md:text-[1.8rem]">
            is our
          </h2>
          <h2 className="rsvp-headline-accent font-heading text-[1.1rem] sm:text-[1.4rem] italic leading-[1.15] tracking-[0.06em] md:text-[1.8rem]">
            greatest gift
          </h2>
          <p className="rsvp-subtext mt-2 sm:mt-3 max-w-[13rem] sm:max-w-[15rem] font-subheading text-[0.82rem] sm:text-[0.95rem] leading-snug md:text-[1.05rem]">
            Share your blessings and celebrate this beautiful journey with us.
          </p>

          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            animate={{ scale: [1, 1.035, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="group relative mt-4 sm:mt-7 inline-block h-[7rem] w-[7.7rem] bg-transparent sm:h-[8.4rem] sm:w-[9.2rem] md:h-[9.4rem] md:w-[10.2rem]"
            aria-haspopup="dialog"
            aria-label="Tap to send your blessings"
            style={{
              filter:
                'drop-shadow(0 14px 22px rgba(94,66,28,0.35))',
            }}
          >
            <svg
              viewBox="0 0 160 150"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="rsvpHeartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbf1d4" />
                  <stop offset="55%" stopColor="#e9cf94" />
                  <stop offset="100%" stopColor="#caa863" />
                </linearGradient>
                <radialGradient id="rsvpHeartHL" cx="38%" cy="30%" r="55%">
                  <stop offset="0%" stopColor="rgba(255,250,225,0.85)" />
                  <stop offset="100%" stopColor="rgba(255,250,225,0)" />
                </radialGradient>
              </defs>
              <path
                d="M80 140 C 22 102, 8 64, 22 36 C 34 12, 66 10, 80 36 C 94 10, 126 12, 138 36 C 152 64, 138 102, 80 140 Z"
                fill="url(#rsvpHeartFill)"
                stroke="#8a6a3a"
                strokeOpacity="0.55"
                strokeWidth="1.2"
              />
              <path
                d="M80 140 C 22 102, 8 64, 22 36 C 34 12, 66 10, 80 36 C 94 10, 126 12, 138 36 C 152 64, 138 102, 80 140 Z"
                fill="url(#rsvpHeartHL)"
              />
            </svg>
            {/* Text — sized & positioned to sit in the wide middle of the heart */}
            <span
              className="pointer-events-none absolute left-1/2 top-[46%] z-10 w-[5.4rem] -translate-x-1/2 -translate-y-1/2 text-center font-subheading text-[0.58rem] font-semibold uppercase leading-[1.2] tracking-[0.18em] text-[#4f3e1f] md:w-[6rem] md:text-[0.64rem]"
            >
              Tap to send your blessings
            </span>
          </motion.button>
        </div>
      </div>

      {/* RSVP modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Choose your RSVP side"
          >
            {/* Backdrop stays fixed behind the scrollable content */}
            <button
              type="button"
              aria-label="Close RSVP dialog"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[rgba(12,6,2,0.72)] backdrop-blur-sm"
            />

            {/* Scrollable content stage — items-start keeps close button in view on small phones */}
            <div className="relative z-10 flex min-h-full items-start justify-center px-4 py-6 sm:items-center sm:py-10">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.4, ease: cinematicEase }}
              className="relative w-full max-w-[58rem] rounded-[1.6rem] border border-[#dac083]/40 bg-[linear-gradient(180deg,#fbf3e2_0%,#f1e2c2_100%)] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.5)] md:p-10"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#8a6a3a]/40 bg-white/60 text-[#5a3a18] hover:bg-white"
              >
                ✕
              </button>

              <div className="text-center">
                <p className="font-subheading text-[0.74rem] uppercase tracking-[0.38em] text-[#8a6a3a]">
                  With love & blessings
                </p>
                <h3 className="mt-3 font-heading text-[1.8rem] uppercase leading-tight tracking-[0.08em] text-[#5a3a18] md:text-[2.2rem]">
                  Send Your Blessings
                </h3>
                <p className="mx-auto mt-3 max-w-[26rem] font-subheading text-[0.95rem] leading-snug text-[#6b4a26]/85">
                  Choose a family to share your wishes and blessings with.
                </p>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2 md:gap-6">
                {rsvpSides.map((side) => (
                  <article
                    key={side.key}
                    className="flex flex-col items-center rounded-[1.2rem] border border-[#dac083]/55 bg-[linear-gradient(180deg,#fffaf0_0%,#f6e9cc_100%)] px-6 py-7 text-center shadow-[0_18px_36px_rgba(94,66,28,0.18)]"
                  >
                    <span aria-hidden className="text-[2rem] leading-none">
                      {side.emoji}
                    </span>
                    <h4 className="mt-3 font-heading text-[1.4rem] text-[#5a3a18] md:text-[1.6rem]">
                      {side.title}
                    </h4>
                    <p className="mt-4 max-w-[18rem] font-subheading text-[0.98rem] leading-snug text-[#6b4a26]/90">
                      {side.description}
                    </p>
                    <a
                      href={`https://wa.me/${side.phone}?text=${WHATSAPP_BLESSING}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#8a6a3a]/45 bg-[linear-gradient(180deg,#f4e6bc_0%,#dac083_100%)] px-7 text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-[#4f3e1f] shadow-[0_8px_22px_rgba(68,52,23,0.22)] transition-transform duration-300 hover:-translate-y-[2px] hover:brightness-105"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
                        <path d="M20.5 3.5A11 11 0 0 0 3.6 17.3L2 22l4.8-1.55A11 11 0 1 0 20.5 3.5Zm-8.5 18a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-2.85.92.93-2.78-.22-.36A9.4 9.4 0 1 1 12 21.5Zm5.4-7.05c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.95 1.17c-.18.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.5-.88-.78-1.48-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.23 5.13 4.53.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.08 1.76-.72 2.01-1.41.25-.7.25-1.3.18-1.41-.07-.12-.27-.18-.57-.33Z" />
                      </svg>
                      {side.action}
                    </a>
                  </article>
                ))}
              </div>
            </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SectionScrollCue />
    </section>
  )
}
