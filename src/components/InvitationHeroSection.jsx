import { useEffect } from 'react'
import { motion } from 'framer-motion'
import useCountdown from '../hooks/useCountdown'
import { spawnCursorSparkle } from '../utils/particles'

const cinematicEase = [0.22, 1, 0.36, 1]

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.14,
    },
  },
}

const blurReveal = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: cinematicEase,
    },
  },
}

export default function InvitationHeroSection() {
  const timeLeft = useCountdown('2026-07-05T07:31:00')

  useEffect(() => {
    const onMouseMove = (event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      if (!target.closest('[data-sparkle="true"]')) return
      if (Math.random() > 0.2) return

      spawnCursorSparkle(document.body, event.clientX, event.clientY)
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
      <div className="cinematic-hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/VYS00213.jpeg)' }} />
      <div className="cinematic-light-glow absolute inset-0" />
      <div className="grain-overlay absolute inset-0" />
      <div className="cinematic-vignette absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(42,9,18,0.44)] via-[rgba(42,9,18,0.62)] to-[rgba(42,9,18,0.84)]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.35 }}
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-center justify-center px-4 py-20 text-center"
      >
        <motion.p
          variants={blurReveal}
          className="font-subheading text-sm uppercase tracking-[0.38em] text-[#F9E5AD] md:text-base"
        >
          July 4 & 5, 2026 | Wedding Invitation
        </motion.p>

        <motion.h1
          variants={blurReveal}
          className="cinematic-couple-names mt-4 font-heading text-5xl leading-tight md:text-7xl"
        >
          Viji &amp; Aakash
        </motion.h1>

        <motion.p
          variants={blurReveal}
          className="mt-4 text-sm text-[#FDF6ECCC] md:text-base"
        >
          Two hearts, one beautiful journey begins
        </motion.p>

        <motion.div
          variants={blurReveal}
          className="mt-6 flex w-full items-center justify-center"
          aria-hidden="true"
        >
          <div className="mx-auto flex w-full max-w-[220px] items-center justify-center">
            <div className="royal-divider-line" />
          </div>
        </motion.div>

        <motion.div variants={blurReveal} className="mx-auto mt-12 w-full max-w-2xl">
          <p className="font-subheading text-sm uppercase tracking-[0.3em] text-[#C9A84C] md:text-base">
            Counting Down to Forever
          </p>

          <div className="mt-6 grid grid-cols-4 gap-2 md:gap-4">
            <LandingCountdownUnit value={timeLeft.days} label="Days" />
            <LandingCountdownUnit value={timeLeft.hours} label="Hours" />
            <LandingCountdownUnit value={timeLeft.minutes} label="Minutes" />
            <LandingCountdownUnit value={timeLeft.seconds} label="Seconds" />
          </div>
        </motion.div>

      </motion.div>
    </section>
  )
}

function LandingCountdownUnit({ value, label }) {
  const formattedValue = String(value).padStart(2, '0')

  return (
    <motion.div
      key={`landing-${label}-${formattedValue}`}
      data-sparkle="true"
      className="interactive-glow rounded-xl border border-[rgba(201,168,76,0.3)] bg-[rgba(255,255,255,0.08)] p-2 md:backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(201,168,76,0.22)] md:p-3"
      whileHover={{ y: -4, boxShadow: '0 14px 30px rgba(201,168,76,0.25)' }}
      transition={{ duration: 0.35, ease: cinematicEase }}
    >
      <div className="rounded-lg border border-[#F4D58B66] bg-[rgba(52,16,25,0.58)] py-2 text-xl font-bold text-[#FDF6EC] shadow-[inset_0_0_20px_rgba(255,255,255,0.08),0_0_22px_rgba(201,168,76,0.16)] md:py-3 md:text-3xl">
        {formattedValue}
      </div>
      <p className="mt-1 text-xs md:text-xs uppercase tracking-[0.2em] text-[#C9A84C]">{label}</p>
    </motion.div>
  )
}
