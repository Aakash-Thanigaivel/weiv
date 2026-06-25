import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

const cinematicEase = [0.22, 1, 0.36, 1]

const ENV_RED = '#7a2a18'
const ENV_RED_DARK = '#5c1d11'
const ENV_RED_DEEPER = '#4a1709'
const LETTER_CREAM = '#fbf2dc'
const LETTER_EDGE = '#e7cf9e'

export default function SeeTheRouteSection() {
  const sectionRef = useRef(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Letter starts fully tucked inside envelope (hidden behind front pocket),
  // then rises until its top fully covers the back flap.
  const letterY = useTransform(scrollYProgress, [0.2, 0.72], ['0%', '-30%'])
  const letterScale = useTransform(scrollYProgress, [0.2, 0.72], [0.96, 1])

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden"
      aria-label="See the route"
    >
      <div className="relative h-[100dvh] min-h-[640px]">
        <img
          src="/purplepattern.jpeg"
          alt="End Purple Space"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center bottom' }}
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(150,180,210,0.10)_0%,rgba(20,8,12,0.10)_60%,rgba(10,4,6,0.32)_100%)]" />

        {/* Envelope stage — width-driven with fixed aspect ratio, stays envelope-shaped at any viewport */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: 'clamp(5rem, 14%, 11rem)',
            width: 'min(76vw, 22rem)',
            aspectRatio: '1.35 / 1',
          }}
        >
          {/* Open back flap — triangle pointing UP, behind everything */}
          <div
            aria-hidden
            className="absolute inset-x-0"
            style={{
              bottom: 'calc(100% - 2%)',
              height: '52%',
              background: `linear-gradient(180deg, ${ENV_RED_DEEPER} 0%, ${ENV_RED_DARK} 100%)`,
              clipPath: 'polygon(0% 100%, 100% 100%, 50% 0%)',
              filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.35))',
            }}
          />

          {/* Envelope back body — solid rectangle behind the letter */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-[0.4rem]"
            style={{
              background: `linear-gradient(180deg, ${ENV_RED} 0%, ${ENV_RED_DARK} 100%)`,
            }}
          />

          {/* Letter — animates UP, rising above the back flap */}
          <motion.div
            className="absolute left-1/2 bottom-0 z-[5] -translate-x-1/2"
            style={{
              width: '88%',
              height: '130%',
              ...(prefersReducedMotion
                ? {}
                : { y: letterY, scale: letterScale }),
            }}
          >
            <div
              className="relative mx-auto h-full w-full rounded-[0.75rem] shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
              style={{
                background: `linear-gradient(180deg, ${LETTER_CREAM} 0%, #f3e4c2 100%)`,
                border: `1px solid ${LETTER_EDGE}`,
              }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center sm:px-8">
                <p
                  className="font-subheading text-[0.6rem] uppercase tracking-[0.32em] sm:text-[0.72rem]"
                  style={{ color: '#8a3a1c' }}
                >
                  Follow The Celebration
                </p>

                <h2
                  className="mt-2 font-heading text-[1.2rem] uppercase tracking-[0.1em] sm:text-[1.6rem] lg:text-[1.9rem]"
                  style={{ color: '#4d210f' }}
                >
                  See The Route
                </h2>

                <p
                  className="mt-2 max-w-[20rem] font-subheading text-[0.7rem] leading-relaxed sm:text-[0.82rem]"
                  style={{ color: 'rgba(77,33,15,0.78)' }}
                >
                  Navigate effortlessly to the venue and arrive right on time for the celebrations.
                </p>

                <a
                  href="https://maps.app.goo.gl/swPXY3KbVEicgckQ7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-9 items-center justify-center rounded-full px-5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] shadow-[0_8px_18px_rgba(122,42,24,0.35)] transition duration-300 ease-out hover:-translate-y-[2px] hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7a2a18] sm:text-[0.72rem]"
                  style={{
                    background: `linear-gradient(160deg, ${ENV_RED} 0%, ${ENV_RED_DARK} 100%)`,
                    color: LETTER_CREAM,
                  }}
                >
                  Open Map
                </a>
              </div>
            </div>
          </motion.div>

          {/* Front pocket — V-notch envelope front, masks letter bottom */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-20 rounded-b-[0.4rem]"
            style={{
              height: '72%',
              background: `linear-gradient(180deg, ${ENV_RED} 0%, ${ENV_RED_DARK} 100%)`,
              clipPath: 'polygon(0% 100%, 0% 0%, 50% 78%, 100% 0%, 100% 100%)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, transparent 49.6%, rgba(0,0,0,0.14) 50%, transparent 50.4%), linear-gradient(45deg, transparent 49.6%, rgba(0,0,0,0.14) 50%, transparent 50.4%)',
                clipPath: 'polygon(0% 100%, 0% 0%, 50% 78%, 100% 0%, 100% 100%)',
              }}
            />
          </div>
        </div>

        {/* Footer credit — sits at the very bottom on the grass */}
        <div className="absolute inset-x-0 bottom-4 z-30 px-6 text-center">
          <p className="font-subheading text-[0.62rem] uppercase tracking-[0.32em] text-[#fbf1d4] drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] md:text-[0.7rem]">
            With Love &amp; Gratitude
          </p>
          <p className="mt-1 font-heading text-[1rem] text-[#fbf1d4] drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)] md:text-[1.15rem]">
            Aakash <span className="text-[#ffb4b4]">❤</span> Viji
          </p>
          <p className="mt-1 font-subheading text-[0.72rem] leading-snug text-[#fbf1d4]/85 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] md:text-[0.82rem]">
            We look forward to celebrating this beautiful day with you.
          </p>
          <p className="mt-3 font-subheading text-[0.5rem] uppercase tracking-[0.28em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] md:text-[0.56rem]">
            Crafted by{' '}
            <a
              href="https://www.velvorastudio.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 transition-colors duration-300 hover:text-white"
            >
              velvorastudio.in
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
