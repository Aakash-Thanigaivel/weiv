import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const cinematicEase = [0.22, 1, 0.36, 1]
const SWIPE_INTERVAL_MS = 5600
const PHOTO_TRANSITION_MS = 1150

const photoVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 22 : -22,
    scale: 1.04,
    filter: 'blur(10px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -22 : 22,
    scale: 0.97,
    filter: 'blur(10px)',
  }),
}

const photoTransition = {
  duration: PHOTO_TRANSITION_MS / 1000,
  ease: cinematicEase,
  opacity: { duration: 0.95, ease: [0.4, 0, 0.2, 1] },
  filter: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  x: { duration: 1.05, ease: cinematicEase },
  scale: { duration: 1.1, ease: cinematicEase },
}

const familyFrames = [
  {
    key: 'bride',
    label: "Bride's Family",
    parents: ['Mr.M.Palani', 'Mrs.K.Gowri'],
    images: [
      { src: '/bridefather.png', alt: "Portrait of the bride's father", className: 'grooms-family-photo-portrait', displayName: "Bride's Father" },
      { src: '/bridemother.png', alt: "Portrait of the bride's mother", className: 'grooms-family-photo-portrait grooms-family-photo-bridemother', displayName: "Bride's Mother" },
      { src: '/bridemomnddad.jpeg', alt: "Portrait of the bride's parents together", className: 'grooms-family-photo-together grooms-family-photo-bride-parents', displayName: "Bride's Parents" },
    ],
    initial: { opacity: 0, x: -34, y: 24 },
    animate: { opacity: 1, x: 0, y: 0 },
    delay: 0.14,
  },
  {
    key: 'groom',
    label: "Groom's Family",
    parents: [' Mr.D.Thanigaivel', 'Mrs.R.Lakshmi'],
    images: [
      { src: '/groomfather.png', alt: "Portrait of the groom's father", className: 'grooms-family-photo-portrait', displayName: "Groom's Father" },
      { src: '/groommom.png', alt: "Portrait of the groom's mother", className: 'grooms-family-photo-portrait', displayName: "Groom's Mother" },
      { src: '/groommomnddad.png', alt: "Portrait of the groom's parents together", className: 'grooms-family-photo-together', displayName: "Groom's Parents" },
    ],
    initial: { opacity: 0, x: 34, y: 24 },
    animate: { opacity: 1, x: 0, y: 0 },
    delay: 0.24,
  },
]

export default function GroomsFamilySection() {
  const prefersReducedMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    familyFrames.forEach((frame) => {
      frame.images.forEach((image) => {
        const preload = new Image()
        preload.src = image.src
      })
    })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % 3)
    }, SWIPE_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return undefined

    setIsTransitioning(true)
    const timeoutId = window.setTimeout(() => {
      setIsTransitioning(false)
    }, PHOTO_TRANSITION_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeIndex, prefersReducedMotion])

  return (
    <section className="grooms-family-section relative isolate overflow-hidden px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-32">
      <div className="grooms-family-bg" aria-hidden="true" />

      <motion.div
        className="grooms-family-shell relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.1, ease: cinematicEase }}
      >
        <div className="grooms-family-intro mx-auto text-center">
          <p className="grooms-family-kicker font-subheading uppercase">The Pair's</p>
          <h2 className="grooms-family-title font-heading uppercase">Families</h2>
          <div className="grooms-family-divider" aria-hidden="true" />
          <p className="grooms-family-copy font-subheading">
            Two families, united by love and blessings, each remembered through portraits that gently
            unfold like treasured pages of a wedding invitation.
          </p>
        </div>

        <div className="grooms-family-grid mt-12 md:mt-16">
          {familyFrames.map((item, frameIndex) => {
            const activePhoto = item.images[activeIndex]
            const swipeDirection = frameIndex === 0 ? 1 : -1

            return (
              <motion.article
                key={item.key}
                className="grooms-family-card"
                initial={item.initial}
                whileInView={item.animate}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.95, delay: item.delay, ease: cinematicEase }}
              >
                <p className="grooms-family-card-label font-subheading uppercase">{item.label}</p>
                <motion.div
                  className="grooms-family-portrait-frame grooms-family-portrait-frame-dual"
                  animate={
                    prefersReducedMotion || isTransitioning
                      ? { y: 0 }
                      : { y: frameIndex === 0 ? [-3, 3, -3] : [-4, 2, -4] }
                  }
                  transition={
                    prefersReducedMotion || isTransitioning
                      ? { duration: 0.45, ease: cinematicEase }
                      : { duration: frameIndex === 0 ? 9.5 : 10.2, repeat: Infinity, ease: 'easeInOut' }
                  }
                >
                  <div className="grooms-family-portrait-slot">
                    <AnimatePresence mode="sync" initial={false}>
                      <motion.div
                        key={`${item.key}-${activeIndex}`}
                        custom={swipeDirection}
                        className="grooms-family-portrait-motion"
                        variants={photoVariants}
                        initial={prefersReducedMotion ? { opacity: 1 } : 'enter'}
                        animate={prefersReducedMotion ? { opacity: 1 } : 'center'}
                        exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
                        transition={prefersReducedMotion ? { duration: 0.2 } : photoTransition}
                      >
                        <img
                          src={activePhoto.src}
                          alt={activePhoto.alt}
                          className={`grooms-family-portrait-photo ${activePhoto.className}`}
                          loading="lazy"
                          decoding="async"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <img
                    src="/newarch.png"
                    alt="Royal portrait frame"
                    className="grooms-family-portrait-image"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
                  <div className="grooms-family-parents" aria-label={`${item.label} parent names`}>
                    <p className="grooms-family-parent-name">{item.parents[0]}</p>
                    <p className="grooms-family-parent-name">{item.parents[1]}</p>
                  </div>
              </motion.article>
            )
          })}
        </div>

          <p className="grooms-family-subtitle mt-2 text-center font-subheading uppercase sm:mt-3">
          With Love &amp; Blessings
        </p>
      </motion.div>
    </section>
  )
}