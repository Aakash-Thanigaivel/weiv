import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import InvitePicture from './InvitePicture'
import useSectionNearView from '../hooks/useSectionNearView'
import { isMobileViewport } from '../utils/performance'

const cinematicEase = [0.22, 1, 0.36, 1]

const celebrationScrolls = [
  {
    title: 'Engagement',
    imageName: 'engagement',
    imageExt: 'png',
    imageAlt: 'Engagement ceremony illustration',
    imagePosition: 'object-[center_42%]',
    frameTone: 'from-[#f4d793]/70 via-[#f0c36c]/18 to-[#6f4517]/22',
    imageGlow: '0 16px 30px rgba(90, 51, 17, 0.22), inset 0 0 40px rgba(255, 224, 170, 0.08)',
    date: '4 July 2026',
    time: '3:00 PM Onwards',
    venue: 'MGM Resort, Muttukadu',
  },
  {
    title: 'Reception',
    imageName: 'reception',
    imageExt: 'png',
    imageAlt: 'Reception celebration illustration',
    imagePosition: 'object-[center_20%]',
    frameTone: 'from-[#d1b0c6]/34 via-[#6b3158]/18 to-[#2b1225]/34',
    imageGlow: '0 16px 30px rgba(54, 19, 46, 0.22), inset 0 0 40px rgba(255, 224, 170, 0.07)',
    date: '4 July 2026',
    time: '6:30 PM Onwards',
    venue: 'MGM Resort, Muttukadu',
  },
  {
    title: 'Wedding',
    imageName: 'muhurutham',
    imageExt: 'png',
    imageAlt: 'Muhurtham wedding illustration',
    imagePosition: 'object-[center_26%]',
    frameTone: 'from-[#efd2a1]/68 via-[#c99445]/16 to-[#5f2f12]/24',
    imageGlow: '0 16px 30px rgba(88, 43, 11, 0.24), inset 0 0 40px rgba(255, 224, 170, 0.08)',
    date: '5 July 2026',
    time: '7:31 AM to 9:00 AM',
    venue: 'MGM Resort, Muttukadu',
  },
]

const goldDust = [
  { left: '8%', top: '18%', size: 5, delay: 0.2, drift: 14, duration: 7.5 },
  { left: '21%', top: '72%', size: 4, delay: 1.3, drift: 17, duration: 8.8 },
  { left: '38%', top: '30%', size: 6, delay: 0.9, drift: 12, duration: 7.1 },
  { left: '54%', top: '62%', size: 4, delay: 0.4, drift: 16, duration: 9.2 },
  { left: '67%', top: '22%', size: 5, delay: 1.8, drift: 11, duration: 8.4 },
  { left: '82%', top: '68%', size: 3, delay: 0.7, drift: 15, duration: 7.8 },
  { left: '91%', top: '36%', size: 4, delay: 1.5, drift: 10, duration: 8.9 },
]

const floatProfiles = [
  { x: 2.2, y: 3.2, rotate: 0.3, rodY: 1.4, duration: 9.6, delay: 0.1 },
  { x: 2.8, y: 2.7, rotate: 0.36, rodY: 1.7, duration: 10.8, delay: 0.5 },
  { x: 2.4, y: 3.6, rotate: 0.33, rodY: 1.5, duration: 9.9, delay: 0.85 },
]

function generateCelebrationParticles(sectionHeight, isMobile = false) {
  const dropDistance = Math.max(360, Math.min(sectionHeight * 0.88, 980))
  const families = [
    {
      weight: 0.36,
      size: [4, 10],
      blur: [0, 0.6],
      opacity: [0.52, 0.78],
      bg: 'radial-gradient(circle at 35% 30%, rgba(255,249,236,0.98) 0%, rgba(245,230,206,0.92) 62%, rgba(222,198,167,0.45) 100%)',
      shadow: '0 0 10px rgba(255, 241, 214, 0.34)',
      radius: '48% 52% 44% 56% / 54% 44% 56% 46%',
      mixBlendMode: 'screen',
    },
    {
      weight: 0.12,
      size: [3, 7],
      blur: [0.3, 1.5],
      opacity: [0.34, 0.62],
      bg: 'radial-gradient(circle, rgba(255,239,196,0.92) 0%, rgba(225,183,110,0.58) 55%, rgba(184,131,58,0) 100%)',
      shadow: '0 0 18px rgba(243, 194, 113, 0.32)',
      radius: '999px',
      mixBlendMode: 'screen',
    },
    {
      weight: 0.06,
      size: [2, 5],
      blur: [0, 0.8],
      opacity: [0.3, 0.52],
      bg: 'radial-gradient(circle, rgba(250,222,160,0.85) 0%, rgba(204,152,73,0.58) 60%, rgba(187,130,51,0) 100%)',
      shadow: '0 0 8px rgba(232, 177, 93, 0.22)',
      radius: '999px',
      mixBlendMode: 'normal',
    },
    {
      weight: 0.3,
      size: [4, 8],
      blur: [0, 0.5],
      opacity: [0.46, 0.72],
      bg: 'radial-gradient(circle at 35% 30%, rgba(255,233,170,0.94) 0%, rgba(231,144,40,0.82) 58%, rgba(148,78,17,0.46) 100%)',
      shadow: '0 0 10px rgba(232, 135, 30, 0.28)',
      radius: '58% 42% 63% 37% / 46% 58% 42% 54%',
      mixBlendMode: 'normal',
    },
    {
      weight: 0.1,
      size: [2, 4],
      blur: [0.2, 1],
      opacity: [0.4, 0.75],
      bg: 'radial-gradient(circle, rgba(255,255,242,0.95) 0%, rgba(252,222,164,0.76) 54%, rgba(219,154,71,0) 100%)',
      shadow: '0 0 14px rgba(253, 236, 188, 0.46)',
      radius: '999px',
      mixBlendMode: 'screen',
    },
    {
      weight: 0.16,
      size: [5, 9],
      blur: [0, 0.4],
      opacity: [0.52, 0.82],
      bg: 'radial-gradient(circle, rgba(255,252,235,0.98) 0%, rgba(255,225,166,0.85) 42%, rgba(228,160,64,0.62) 72%, rgba(219,154,71,0) 100%)',
      shadow: '0 0 16px rgba(255, 226, 165, 0.5)',
      radius: '0%',
      mixBlendMode: 'screen',
      clipPath: 'polygon(50% 0%, 61% 36%, 98% 36%, 68% 57%, 79% 93%, 50% 71%, 21% 93%, 32% 57%, 2% 36%, 39% 36%)',
    },
  ]

  const totalWeight = families.reduce((sum, family) => sum + family.weight, 0)

  const pickFamily = () => {
    let threshold = Math.random() * totalWeight

    for (const family of families) {
      threshold -= family.weight
      if (threshold <= 0) {
        return family
      }
    }

    return families[families.length - 1]
  }

  return Array.from({ length: isMobile ? 12 : 72 }, (_, index) => {
    const family = pickFamily()
    const size = family.size[0] + Math.random() * (family.size[1] - family.size[0])
    const duration = 2.05 + Math.random() * 0.92
    const delay = Math.random() * 0.28
    const drift = (Math.random() * 2 - 1) * (18 + Math.random() * 38)
    const depth = Math.random()
    const blur = family.blur[0] + depth * (family.blur[1] - family.blur[0])
    const opacity = family.opacity[0] + Math.random() * (family.opacity[1] - family.opacity[0])
    const rotateStart = Math.random() * 160 - 80
    const rotateEnd = rotateStart + (Math.random() * 320 - 160)
    const rotateMid = (rotateStart + rotateEnd) / 2 + (Math.random() * 50 - 25)
    const scaleStart = 0.88 + Math.random() * 0.28
    const scalePeak = scaleStart + 0.08 + Math.random() * 0.14
    const scaleEnd = Math.max(0.7, scaleStart - 0.18)
    const heightFactor = 0.92 + Math.random() * 0.38

    return {
      id: `celebration-particle-${index}-${Math.random().toString(36).slice(2, 8)}`,
      left: 5 + Math.random() * 90,
      size,
      heightFactor,
      blur,
      opacity,
      duration,
      delay,
      drift,
      drop: dropDistance * (0.85 + Math.random() * 0.22),
      rotateStart,
      rotateMid,
      rotateEnd,
      scaleStart,
      scalePeak,
      scaleEnd,
      background: family.bg,
      shadow: family.shadow,
      borderRadius: family.radius,
      mixBlendMode: family.mixBlendMode,
      clipPath: family.clipPath,
    }
  })
}

function DetailIcon({ type }) {
  const baseClass = 'h-[0.92rem] w-[0.92rem] text-[#8e6738]/86 md:h-[0.98rem] md:w-[0.98rem]'

  if (type === 'date') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={baseClass} aria-hidden="true">
        <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7 3.7v3.4M17 3.7v3.4M4 9.6h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'time') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={baseClass} aria-hidden="true">
        <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 7.6v5.1l3.2 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={baseClass} aria-hidden="true">
      <path d="M12 21s6.1-5.7 6.1-10.1A6.1 6.1 0 0 0 12 4.8a6.1 6.1 0 0 0-6.1 6.1C5.9 15.3 12 21 12 21Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="10.9" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function ScrollDetails({ details, isOpen, baseDelay = 0.68, isMobile = false }) {
  const lines = useMemo(
    () => [
      { key: 'date', iconType: 'date', value: details.date },
      { key: 'time', iconType: 'time', value: details.time },
      { key: 'venue', iconType: 'venue', value: details.venue },
    ],
    [details],
  )

  return (
    <div className="space-y-2 text-[#5a3716] md:space-y-2.5">
      {lines.map((line, lineIndex) => (
        <motion.div
          key={line.key}
          initial={false}
          animate={
            isOpen
              ? { opacity: 1, y: 0, ...(isMobile ? {} : { filter: 'blur(0px)' }) }
              : { opacity: 0, y: 10, ...(isMobile ? {} : { filter: 'blur(4px)' }) }
          }
          transition={{
            duration: 0.4,
            delay: isOpen ? baseDelay + lineIndex * 0.08 : 0,
            ease: cinematicEase,
          }}
          className="flex items-center justify-center gap-2 text-center"
        >
          <DetailIcon type={line.iconType} />
          <p className="font-heading text-[0.95rem] leading-relaxed text-[#4d2d12] drop-shadow-[0_1px_3px_rgba(255,237,205,0.22)] md:text-[1rem]">
            {line.value}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

export default function WeddingCelebrationsSection() {
  const isMobile = useMemo(() => isMobileViewport(), [])
  const [sectionRef, isNearView] = useSectionNearView('480px 0px')
  const [activeScroll, setActiveScroll] = useState(null)
  const [bouncingScroll, setBouncingScroll] = useState(null)
  const [glowPulseToken, setGlowPulseToken] = useState(null)
  const [particleBurst, setParticleBurst] = useState(null)
  const [sectionHeight, setSectionHeight] = useState(760)

  const innerSectionRef = useRef(null)
  const openTimeoutRef = useRef(null)
  const burstTimeoutRef = useRef(null)
  const articleRefs = useRef([])

  useEffect(() => {
    if (!innerSectionRef.current || typeof ResizeObserver === 'undefined') {
      return undefined
    }

    const updateSectionHeight = () => {
      if (innerSectionRef.current) {
        setSectionHeight(innerSectionRef.current.clientHeight)
      }
    }

    updateSectionHeight()

    const observer = new ResizeObserver(updateSectionHeight)
    observer.observe(innerSectionRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) {
        window.clearTimeout(openTimeoutRef.current)
      }

      if (burstTimeoutRef.current) {
        window.clearTimeout(burstTimeoutRef.current)
    }
    }
  }, [])

  const triggerCinematicOpen = (index) => {
    setActiveScroll(index)
    setGlowPulseToken(`${index}-${Date.now()}`)

    if (window.innerWidth < 768) {
      window.setTimeout(() => {
        articleRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 80)
    }

    const nextBurst = {
      id: `${Date.now()}-${index}`,
      particles: generateCelebrationParticles(sectionHeight, window.innerWidth < 768),
    }
    setParticleBurst(nextBurst)

    if (burstTimeoutRef.current) {
      window.clearTimeout(burstTimeoutRef.current)
    }

    burstTimeoutRef.current = window.setTimeout(() => {
      setParticleBurst(null)
    }, 3200)
  }

  const handleManuscriptTap = (index) => {
    if (activeScroll === index) {
      setActiveScroll(null)
      return
    }

    if (openTimeoutRef.current) {
      window.clearTimeout(openTimeoutRef.current)
    }

    setBouncingScroll(index)

    openTimeoutRef.current = window.setTimeout(() => {
      setBouncingScroll(null)
      triggerCinematicOpen(index)
    }, 280)
  }

  const visibleGoldDust = useMemo(
    () => (isMobileViewport() ? goldDust.slice(0, 3) : goldDust),
    [],
  )

  return (
    <section
      ref={sectionRef}
      id="wedding-celebrations"
      className={`wedding-celebrations-section invite-section-below-fold relative min-h-[100dvh] overflow-hidden py-16 md:py-28${isNearView ? ' wedding-celebrations-section--ready' : ''}`}
      aria-label="Wedding Celebrations"
    >
      <div ref={innerSectionRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(24,5,7,0.62),rgba(22,4,6,0.7),rgba(12,2,4,0.8))]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(222,166,84,0.13)_0%,rgba(72,16,18,0.06)_48%,rgba(8,1,2,0.4)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_48%,rgba(8,1,2,0.34)_100%)]" />

      <AnimatePresence>
        {particleBurst ? (
          <motion.div
            key={particleBurst.id}
            className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: cinematicEase }}
            aria-hidden="true"
          >
            {particleBurst.particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.left}%`,
                  top: '-2.8rem',
                  width: `${particle.size}px`,
                  height: `${particle.size * particle.heightFactor}px`,
                  borderRadius: particle.borderRadius,
                  clipPath: particle.clipPath,
                  background: particle.background,
                  boxShadow: particle.shadow,
                  filter: `blur(${particle.blur}px)`,
                  mixBlendMode: particle.mixBlendMode,
                  willChange: 'transform, opacity',
                }}
                initial={{ opacity: 0, y: -22, x: 0, rotate: particle.rotateStart, scale: particle.scaleStart }}
                animate={{
                  opacity: [0, particle.opacity, particle.opacity * 0.68, 0],
                  y: [-22, particle.drop * 0.42, particle.drop],
                  x: [0, particle.drift, particle.drift * 0.3],
                  rotate: [particle.rotateStart, particle.rotateMid, particle.rotateEnd],
                  scale: [particle.scaleStart, particle.scalePeak, particle.scaleEnd],
                }}
                transition={{ duration: particle.duration, delay: particle.delay, ease: 'easeOut' }}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {visibleGoldDust.map((dust, index) => (
        <motion.span
          key={`dust-${dust.left}-${dust.top}`}
          className="pointer-events-none absolute rounded-full bg-[#f3c776]/70 shadow-[0_0_10px_rgba(243,199,118,0.55)]"
          style={{ left: dust.left, top: dust.top, width: `${dust.size}px`, height: `${dust.size}px` }}
          animate={{ y: [-dust.drift, dust.drift], opacity: [0.16, 0.38, 0.2] }}
          transition={{
            duration: dust.duration,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'mirror',
            delay: dust.delay + index * 0.04,
          }}
          aria-hidden="true"
        />
      ))}

      <div className="relative mx-auto w-full max-w-6xl px-4">
        <motion.div
          initial={isMobile ? { opacity: 0, y: 18 } : { opacity: 0, y: 18, filter: 'blur(8px)' }}
          whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: isMobile ? 0.55 : 0.8, ease: cinematicEase }}
          className="text-center"
        >
          <h2 className="font-heading text-4xl text-[#f7e8d2] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:text-5xl">
            Wedding Celebrations
          </h2>
          <p className="mt-3 font-subheading text-[0.72rem] uppercase tracking-[0.28em] text-[#d2a45f] md:text-sm">
            Sacred Manuscripts of Engagement, Wedding and Reception
          </p>
        </motion.div>

        <div className="mt-10 flex flex-col items-center gap-6 md:mt-16 md:grid md:grid-cols-3 md:items-start md:justify-items-center md:gap-6 lg:gap-10">
          {celebrationScrolls.map((event, index) => {
            const isOpen = activeScroll === index
            const shouldDim = activeScroll !== null && !isOpen
            const floatProfile = floatProfiles[index % floatProfiles.length]

            return (
              <motion.article
                key={event.title}
                ref={(el) => { articleRefs.current[index] = el }}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-label={`${event.title} celebration scroll`}
                onClick={() => handleManuscriptTap(index)}
                onKeyDown={(eventKey) => {
                  if (eventKey.key === 'Enter' || eventKey.key === ' ') {
                    eventKey.preventDefault()
                    handleManuscriptTap(index)
                  }
                }}
                className={`relative w-full max-w-[20rem] cursor-pointer outline-none transition-[filter] duration-500 ${
                  index === 1 ? 'md:mt-12 lg:mt-14' : index === 2 ? 'md:-mt-2 lg:mt-4' : 'md:mt-0'
                }`}
                initial={isMobile ? { opacity: 0, y: 24 } : { opacity: 0, y: 24, filter: 'blur(8px)' }}
                whileInView={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: isMobile ? 0.55 : 0.75, delay: index * 0.12, ease: cinematicEase }}
                animate={{
                  scale: isOpen ? 1.045 : 1,
                  opacity: shouldDim ? 0.42 : 1,
                  y: isOpen ? -8 : 0,
                  zIndex: isOpen ? 20 : 5,
                }}
              >
                <motion.div
                  className="relative"
                  initial={false}
                  animate={
                    bouncingScroll === index && !isOpen
                      ? { scale: [1, 0.973, 1.015, 1], y: [0, 1.6, -1.2, 0] }
                      : { scale: 1, y: 0 }
                  }
                  transition={
                    bouncingScroll === index && !isOpen
                      ? {
                          duration: 0.34,
                          times: [0, 0.42, 0.76, 1],
                          ease: [0.22, 1, 0.36, 1],
                        }
                      : { duration: 0.2, ease: cinematicEase }
                  }
                >
                <motion.div
                  className="pointer-events-none absolute inset-x-[-8%] -top-[9%] -bottom-[7%] z-0 rounded-[2.4rem] bg-[radial-gradient(circle_at_50%_42%,rgba(238,189,103,0.32)_0%,rgba(192,128,52,0.14)_35%,rgba(35,7,10,0)_72%)] blur-xl"
                  initial={false}
                  animate={
                    isOpen && glowPulseToken?.startsWith(`${index}-`)
                      ? {
                          opacity: [0, 0.96, 0.72],
                          scale: [0.95, 1.04, 1],
                        }
                      : { opacity: isOpen ? 0.72 : 0, scale: isOpen ? 1 : 0.96 }
                  }
                  transition={{ duration: isOpen ? 0.82 : 0.36, delay: isOpen ? 0.28 : 0, ease: cinematicEase }}
                  aria-hidden="true"
                />

                <motion.div
                  className="pointer-events-none absolute left-[14%] right-[14%] top-[-0.48rem] z-30 h-[0.42rem] rounded-full border border-[#8a5d2f]/72 bg-[linear-gradient(to_bottom,#f0d39b_0%,#c78941_44%,#845426_100%)] shadow-[0_4px_8px_rgba(10,2,3,0.24)]"
                  initial={false}
                  animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -6, filter: isOpen ? 'blur(0px)' : 'blur(4px)' }}
                  transition={{ duration: 0.42, delay: isOpen ? 0.24 : 0, ease: cinematicEase }}
                  aria-hidden="true"
                >
                  <span className="absolute left-[8%] right-[8%] top-[1px] h-[1px] rounded-full bg-[#ffe8bf]/58" aria-hidden="true" />
                  <span className="absolute -left-[0.36rem] top-1/2 h-[0.46rem] w-[0.46rem] -translate-y-1/2 rounded-full border border-[#8a5d2f]/65 bg-[radial-gradient(circle_at_35%_30%,#f6ddb0_0%,#cb8f4a_62%,#8b5928_100%)]" aria-hidden="true" />
                  <span className="absolute -right-[0.36rem] top-1/2 h-[0.46rem] w-[0.46rem] -translate-y-1/2 rounded-full border border-[#8a5d2f]/65 bg-[radial-gradient(circle_at_35%_30%,#f6ddb0_0%,#cb8f4a_62%,#8b5928_100%)]" aria-hidden="true" />
                </motion.div>

                <motion.div
                  className={`relative mt-[-0.15rem] origin-top px-5 md:px-6 ${
                    isOpen
                      ? 'overflow-hidden border border-[#b18245]/55 bg-[linear-gradient(165deg,rgba(248,229,188,0.96),rgba(234,205,161,0.96)_40%,rgba(220,184,136,0.94)_100%)]'
                      : 'overflow-visible border border-transparent bg-transparent'
                  }`}
                  initial={false}
                  animate={{
                    minHeight: isOpen ? (isMobile ? '26.5rem' : '30.8rem') : '4.9rem',
                    paddingTop: isOpen ? '0.95rem' : '1.95rem',
                    paddingBottom: isOpen ? '0.95rem' : '1.95rem',
                    borderRadius: isOpen
                      ? '1rem 1rem 38% 38% / 0.95rem 0.95rem 13% 13%'
                      : '999px',
                    clipPath: isOpen ? 'inset(0% 0% 0% 0% round 2rem)' : 'none',
                    scaleX: 1,
                    boxShadow: isOpen
                      ? '0 34px 58px rgba(5,1,1,0.56), 0 0 42px rgba(227,174,92,0.26), inset 0 0 0 1px rgba(241,219,179,0.16)'
                      : 'none',
                  }}
                  transition={{ duration: 0.9, ease: cinematicEase }}
                >
                  <AnimatePresence initial={false}>
                    {!isOpen ? (
                      <motion.div
                        key="closed-scroll-shell"
                        className="pointer-events-none absolute inset-x-[6%] top-[30%] z-20 h-[2.35rem] -translate-y-1/2 rounded-full border border-[#9a6936]/72 bg-[linear-gradient(to_bottom,#f2dfbe_0%,#e8cc9e_38%,#d8af77_100%)] shadow-[inset_0_1px_4px_rgba(255,245,222,0.45),inset_0_-2px_5px_rgba(92,56,24,0.26),0_8px_14px_rgba(8,2,3,0.34)]"
                        initial={{ opacity: 0, scaleX: 0.96, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, scaleX: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scaleX: 0.98, filter: 'blur(4px)' }}
                        transition={{ duration: 0.36, ease: cinematicEase }}
                        aria-hidden="true"
                      >
                        <span className="absolute inset-x-[8%] top-[0.18rem] h-[1px] rounded-full bg-[#fff0cd]/70" />
                        <span className="absolute inset-x-[8%] bottom-[0.16rem] h-[1px] rounded-full bg-[#8e5a27]/32" />

                        <span className="absolute -left-[0.66rem] top-1/2 h-[1.38rem] w-[1.38rem] -translate-y-1/2 rounded-full border border-[#87572a]/78 bg-[radial-gradient(circle_at_34%_30%,#efcd92_0%,#be8342_58%,#7f4f24_100%)] shadow-[0_4px_8px_rgba(10,2,3,0.28)]" />
                        <span className="absolute -right-[0.66rem] top-1/2 h-[1.38rem] w-[1.38rem] -translate-y-1/2 rounded-full border border-[#87572a]/78 bg-[radial-gradient(circle_at_34%_30%,#efcd92_0%,#be8342_58%,#7f4f24_100%)] shadow-[0_4px_8px_rgba(10,2,3,0.28)]" />

                        <span className="absolute -left-[1.2rem] top-1/2 h-[0.46rem] w-[0.46rem] -translate-y-1/2 rounded-full bg-[#b77d40]/85" />
                        <span className="absolute -right-[1.2rem] top-1/2 h-[0.46rem] w-[0.46rem] -translate-y-1/2 rounded-full bg-[#b77d40]/85" />

                        <span className="absolute -left-[1.14rem] top-[1.28rem] h-[1.14rem] w-[0.22rem] rounded-b-full bg-[linear-gradient(to_bottom,#d8ad76,#9f6430)] shadow-[0_2px_5px_rgba(10,2,3,0.2)]" />
                        <span className="absolute -left-[1.22rem] top-[2.14rem] h-[0.86rem] w-[0.46rem] bg-[repeating-linear-gradient(to_right,#945a29_0px,#945a29_1.2px,#c98c4a_1.2px,#c98c4a_2.4px)] opacity-76" style={{ clipPath: 'polygon(50% 0%,100% 26%,84% 100%,16% 100%,0% 26%)' }} />

                        <span className="absolute -right-[1.14rem] top-[1.28rem] h-[1.14rem] w-[0.22rem] rounded-b-full bg-[linear-gradient(to_bottom,#d8ad76,#9f6430)] shadow-[0_2px_5px_rgba(10,2,3,0.2)]" />
                        <span className="absolute -right-[1.22rem] top-[2.14rem] h-[0.86rem] w-[0.46rem] bg-[repeating-linear-gradient(to_right,#945a29_0px,#945a29_1.2px,#c98c4a_1.2px,#c98c4a_2.4px)] opacity-76" style={{ clipPath: 'polygon(50% 0%,100% 26%,84% 100%,16% 100%,0% 26%)' }} />
                        {/* Event title centered on scroll body */}
                        <span className="pointer-events-none absolute inset-x-[14%] top-[42%] -translate-y-1/2 text-center font-heading text-[0.54rem] uppercase tracking-[0.26em] text-[#4a2a0c] drop-shadow-[0_1px_2px_rgba(255,240,200,0.55)]">
                          {event.title}
                        </span>

                        <span className="pointer-events-none absolute inset-x-[18%] top-[72%] -translate-y-1/2 text-center font-subheading text-[0.44rem] uppercase tracking-[0.18em] text-[#6a4318]/72 drop-shadow-[0_1px_1px_rgba(255,240,200,0.35)]">
                          tap to open
                        </span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <motion.div
                    className="pointer-events-none absolute inset-x-[16%] top-[0.8rem] h-[0.38rem] rounded-full bg-[linear-gradient(to_bottom,rgba(255,239,204,0.64),rgba(166,117,58,0.08))]"
                    initial={false}
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.36, delay: isOpen ? 0.28 : 0, ease: cinematicEase }}
                    aria-hidden="true"
                  />

                  <motion.div
                    className="pointer-events-none absolute left-[50%] top-[0.62rem] z-20 h-[1.5rem] w-[8.2rem] -translate-x-1/2"
                    initial={false}
                    animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -6, filter: isOpen ? 'blur(0px)' : 'blur(4px)' }}
                    transition={{ duration: 0.46, delay: isOpen ? 0.34 : 0, ease: cinematicEase }}
                    aria-hidden="true"
                  >
                    <span className="absolute left-0 top-[0.72rem] h-[1px] w-[2.6rem] bg-[linear-gradient(to_left,rgba(150,102,48,0.56),transparent)]" />
                    <span className="absolute right-0 top-[0.72rem] h-[1px] w-[2.6rem] bg-[linear-gradient(to_right,rgba(150,102,48,0.56),transparent)]" />
                    <span className="absolute left-1/2 top-[0.18rem] h-[0.66rem] w-[0.66rem] -translate-x-1/2 rounded-full border border-[#a8743d]/70 bg-[radial-gradient(circle_at_35%_30%,#f4d9a4_0%,#c98b46_62%,#8a5828_100%)] shadow-[0_2px_6px_rgba(10,2,3,0.24)]" />
                    <span className="absolute left-1/2 top-[0.93rem] h-[0.24rem] w-[0.24rem] -translate-x-1/2 rounded-full bg-[#b17438]/78" />
                  </motion.div>

                  <motion.div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_14%,rgba(255,251,236,0.44)_0%,transparent_42%),radial-gradient(circle_at_82%_88%,rgba(172,120,63,0.16)_0%,transparent_38%)]"
                    initial={false}
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.24, ease: cinematicEase }}
                    aria-hidden="true"
                  />
                  <motion.div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(113,76,37,0.19)_0%,transparent_15%,transparent_85%,rgba(113,76,37,0.19)_100%)]"
                    initial={false}
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.24, ease: cinematicEase }}
                    aria-hidden="true"
                  />
                  <motion.div
                    className="pointer-events-none absolute inset-x-[11%] top-[1.5rem] bottom-[0.52rem] rounded-[1.05rem] border-x-2 border-dotted border-[#9d6a33]/58"
                    initial={false}
                    animate={{ opacity: isOpen ? 0.95 : 0 }}
                    transition={{ duration: 0.42, delay: isOpen ? 0.38 : 0, ease: cinematicEase }}
                    aria-hidden="true"
                  />
                  <motion.div
                    className="pointer-events-none absolute left-[11%] right-[11%] bottom-[0.42rem] h-[0.5rem] rounded-full border-b-2 border-dotted border-[#9d6a33]/58"
                    initial={false}
                    animate={{ opacity: isOpen ? 0.95 : 0 }}
                    transition={{ duration: 0.42, delay: isOpen ? 0.4 : 0, ease: cinematicEase }}
                    aria-hidden="true"
                  />
                  <motion.div
                    className="pointer-events-none absolute inset-x-[24%] top-[24%] bottom-[17%] bg-[linear-gradient(to_right,transparent,rgba(154,106,52,0.14),transparent)]"
                    initial={false}
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.46, delay: isOpen ? 0.56 : 0, ease: cinematicEase }}
                    aria-hidden="true"
                  />
                  <motion.div
                    className="pointer-events-none absolute inset-x-[30%] top-[29%] bottom-[19%] bg-[linear-gradient(to_right,transparent,rgba(154,106,52,0.11),transparent)]"
                    initial={false}
                    animate={{ opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.46, delay: isOpen ? 0.6 : 0, ease: cinematicEase }}
                    aria-hidden="true"
                  />
                  <motion.div
                    className="relative z-10 mx-auto mt-1 h-px w-24 bg-[linear-gradient(to_right,transparent,#9a6b35,transparent)]"
                    initial={false}
                    animate={{ opacity: isOpen ? 1 : 0.18, width: isOpen ? '7.5rem' : '4.25rem' }}
                    transition={{ duration: 0.45, ease: cinematicEase }}
                  />

                  <motion.div
                    className="relative z-10 mt-2.5 overflow-hidden"
                    initial={false}
                    animate={{
                      height: isOpen ? (isMobile ? '24.2rem' : '28.4rem') : '0rem',
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: isMobile ? 0.58 : 0.76, delay: isOpen ? 0.46 : 0, ease: cinematicEase }}
                  >
                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          key="open-details"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, ease: cinematicEase }}
                        >
                          <motion.figure
                            className="relative mx-auto mb-3.5 w-full max-w-[13.5rem] overflow-hidden rounded-[1.02rem] md:max-w-[15.2rem]"
                            initial={isMobile ? { opacity: 0, y: 12, scale: 0.98 } : { opacity: 0, y: 12, scale: 0.965, filter: 'blur(7px)' }}
                            animate={isMobile ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                            exit={isMobile ? { opacity: 0, y: 8, scale: 0.99 } : { opacity: 0, y: 8, scale: 0.98, filter: 'blur(5px)' }}
                            transition={{ duration: isMobile ? 0.45 : 0.74, delay: isMobile ? 0.35 : 0.72, ease: cinematicEase }}
                            style={{ boxShadow: '0 8px 18px rgba(69, 38, 16, 0.14)' }}
                          >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-[0.96rem] bg-[#c8a06f]/10">
                              <InvitePicture
                                name={event.imageName}
                                ext={event.imageExt}
                                alt={event.imageAlt}
                                loading="eager"
                                fetchPriority="high"
                                className={`h-full w-full ${event.imagePosition} object-cover`}
                              />
                            </div>
                          </motion.figure>

                          <div className="mt-2 pb-0.5">
                            <ScrollDetails details={event} isOpen={isOpen} baseDelay={isMobile ? 0.55 : 1.02} isMobile={isMobile} />
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    className="pointer-events-none absolute -bottom-[0.06rem] left-[9%] right-[9%] h-[0.88rem] bg-[linear-gradient(to_bottom,rgba(228,194,146,0.9),rgba(196,151,101,0.84))]"
                    style={{ clipPath: 'polygon(0% 22%,8% 36%,16% 24%,24% 38%,32% 26%,40% 40%,50% 28%,60% 40%,68% 26%,76% 38%,84% 24%,92% 36%,100% 22%,100% 100%,0% 100%)' }}
                    initial={false}
                    animate={
                      isOpen
                        ? {
                            opacity: 0.95,
                            y: [0, floatProfile.y * 0.2, 0, -floatProfile.y * 0.16, 0],
                            x: [0, floatProfile.x * 0.24, 0, -floatProfile.x * 0.2, 0],
                            scaleY: [1, 1.02, 0.995, 1],
                          }
                        : { opacity: 0, y: -3, x: 0, scaleY: 0.9 }
                    }
                    transition={
                      isOpen
                        ? {
                            opacity: { duration: 0.42, delay: 0.48, ease: cinematicEase },
                            y: {
                              duration: floatProfile.duration + 0.9,
                              ease: 'easeInOut',
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: 'mirror',
                              delay: 1.12 + floatProfile.delay,
                            },
                            x: {
                              duration: floatProfile.duration + 1.2,
                              ease: 'easeInOut',
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: 'mirror',
                              delay: 1.12 + floatProfile.delay,
                            },
                            scaleY: {
                              duration: floatProfile.duration + 1,
                              ease: 'easeInOut',
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: 'mirror',
                              delay: 1.12 + floatProfile.delay,
                            },
                          }
                        : { duration: 0.3, ease: cinematicEase }
                    }
                    aria-hidden="true"
                  />
                </motion.div>

                </motion.div>

              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
