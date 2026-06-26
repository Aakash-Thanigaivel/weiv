import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import InvitePicture from './InvitePicture'
import useSectionNearView from '../hooks/useSectionNearView'
import useSwipeGesture from '../hooks/useSwipeGesture'
import { isMobileViewport, preloadFamilySlide } from '../utils/performance'

const cinematicEase = [0.22, 1, 0.36, 1]
const SWIPE_INTERVAL_MS = 5600
const PHOTO_TRANSITION_MS = 1150

const photoVariantsDesktop = {
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

const photoVariantsMobile = {
  enter: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 10 : -10,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -10 : 10,
  }),
}

const photoTransitionDesktop = {
  duration: PHOTO_TRANSITION_MS / 1000,
  ease: cinematicEase,
  opacity: { duration: 0.95, ease: [0.4, 0, 0.2, 1] },
  filter: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  x: { duration: 1.05, ease: cinematicEase },
  scale: { duration: 1.1, ease: cinematicEase },
}

const photoTransitionMobile = {
  duration: 0.32,
  ease: cinematicEase,
}

const familyFrames = [
  {
    key: 'bride',
    label: "Bride's Family",
    shortLabel: 'Bride',
    parents: ['Mr.M.Palani', 'Mrs.K.Gowri'],
    images: [
      { name: 'bridefather', ext: 'png', alt: "Portrait of the bride's father", className: 'grooms-family-photo-portrait', displayName: "Bride's Father" },
      { name: 'bridemother', ext: 'png', alt: "Portrait of the bride's mother", className: 'grooms-family-photo-portrait grooms-family-photo-bridemother', displayName: "Bride's Mother" },
      { name: 'bridemomnddad', ext: 'jpeg', alt: "Portrait of the bride's parents together", className: 'grooms-family-photo-together grooms-family-photo-bride-parents', displayName: "Bride's Parents" },
    ],
    initial: { opacity: 0, x: -34, y: 24 },
    animate: { opacity: 1, x: 0, y: 0 },
    delay: 0.14,
  },
  {
    key: 'groom',
    label: "Groom's Family",
    shortLabel: 'Groom',
    parents: [' Mr.D.Thanigaivel', 'Mrs.R.Lakshmi'],
    images: [
      { name: 'groomfather', ext: 'png', alt: "Portrait of the groom's father", className: 'grooms-family-photo-portrait', displayName: "Groom's Father" },
      { name: 'groommom', ext: 'png', alt: "Portrait of the groom's mother", className: 'grooms-family-photo-portrait', displayName: "Groom's Mother" },
      { name: 'groommomnddad', ext: 'png', alt: "Portrait of the groom's parents together", className: 'grooms-family-photo-together', displayName: "Groom's Parents" },
    ],
    initial: { opacity: 0, x: 34, y: 24 },
    animate: { opacity: 1, x: 0, y: 0 },
    delay: 0.24,
  },
]

function FamilyPortraitFrame({
  activePhoto,
  activeIndex,
  photoVariants,
  photoTransition,
  prefersReducedMotion,
  isNearView,
  swipeDirection = 1,
  onSwipeLeft,
  onSwipeRight,
  isMobile,
}) {
  const swipeHandlers = useSwipeGesture({
    enabled: isMobile,
    onSwipeLeft,
    onSwipeRight,
  })

  return (
    <motion.div className="grooms-family-portrait-frame grooms-family-portrait-frame-dual">
      <div
        className="grooms-family-portrait-slot"
        {...(isMobile ? swipeHandlers : {})}
        role={isMobile ? 'group' : undefined}
        aria-label={isMobile ? 'Swipe or tap dots to change portrait' : undefined}
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={`${activePhoto.name}-${activeIndex}`}
            custom={swipeDirection}
            className="grooms-family-portrait-motion"
            variants={photoVariants}
            initial={prefersReducedMotion ? { opacity: 1 } : 'enter'}
            animate={prefersReducedMotion ? { opacity: 1 } : 'center'}
            exit={prefersReducedMotion ? { opacity: 0 } : 'exit'}
            transition={prefersReducedMotion ? { duration: 0.2 } : photoTransition}
          >
            <InvitePicture
              name={activePhoto.name}
              ext={activePhoto.ext}
              alt={activePhoto.alt}
              className={`grooms-family-portrait-photo ${activePhoto.className}`}
              loading={isNearView ? 'eager' : 'lazy'}
              fetchPriority={isNearView && activeIndex === 0 ? 'high' : 'low'}
              mobileWidth={360}
              desktopWidth={640}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <InvitePicture
        name="newarch"
        ext="png"
        alt="Royal portrait frame"
        className="grooms-family-portrait-image"
        loading={isNearView ? 'eager' : 'lazy'}
        fetchPriority={isNearView ? 'high' : 'low'}
        mobileWidth={640}
        desktopWidth={1024}
      />
    </motion.div>
  )
}

export default function GroomsFamilySection() {
  const prefersReducedMotion = useReducedMotion()
  const isMobile = useMemo(() => isMobileViewport(), [])
  const [sectionRef, isNearView] = useSectionNearView('420px 0px')
  const [activeFamilyKey, setActiveFamilyKey] = useState('bride')
  const [photoIndexes, setPhotoIndexes] = useState({ bride: 0, groom: 0 })
  const [desktopActiveIndex, setDesktopActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const photoVariants = isMobile ? photoVariantsMobile : photoVariantsDesktop
  const photoTransition = isMobile ? photoTransitionMobile : photoTransitionDesktop

  const activeFamily = familyFrames.find((frame) => frame.key === activeFamilyKey) ?? familyFrames[0]
  const activePhotoIndex = photoIndexes[activeFamilyKey]

  const markTransition = () => {
    setIsTransitioning(true)
    window.setTimeout(() => {
      setIsTransitioning(false)
    }, isMobile ? 320 : PHOTO_TRANSITION_MS)
  }

  const advancePhoto = (direction = 1) => {
    markTransition()
    setPhotoIndexes((current) => ({
      ...current,
      [activeFamilyKey]: (current[activeFamilyKey] + direction + 3) % 3,
    }))
  }

  useEffect(() => {
    if (!isNearView) return undefined

    if (isMobile) {
      preloadFamilySlide(activePhotoIndex, activeFamilyKey)
      return undefined
    }

    preloadFamilySlide(desktopActiveIndex)
  }, [isNearView, isMobile, activePhotoIndex, activeFamilyKey, desktopActiveIndex])

  useEffect(() => {
    if (!isNearView || prefersReducedMotion || isMobile) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      markTransition()
      setDesktopActiveIndex((currentIndex) => (currentIndex + 1) % 3)
    }, SWIPE_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isNearView, prefersReducedMotion, isMobile])

  return (
    <section
      ref={sectionRef}
      className={`grooms-family-section invite-section-below-fold relative isolate overflow-hidden px-5 py-16 sm:px-8 sm:py-28 lg:px-10 lg:py-32${isNearView ? ' grooms-family-section--ready' : ''}`}
    >
      <div className="grooms-family-bg" aria-hidden="true" />

      <motion.div
        className="grooms-family-shell relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col justify-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: isMobile ? 0.7 : 1.1, ease: cinematicEase }}
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

        {isMobile ? (
          <div className="grooms-family-mobile mt-10">
            <div className="grooms-family-tabs" role="tablist" aria-label="Choose family">
              {familyFrames.map((frame) => {
                const isActive = frame.key === activeFamilyKey

                return (
                  <button
                    key={frame.key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`grooms-family-tab font-subheading uppercase${isActive ? ' grooms-family-tab--active' : ''}`}
                    onClick={() => setActiveFamilyKey(frame.key)}
                  >
                    {frame.shortLabel}
                  </button>
                )
              })}
            </div>

            <article className="grooms-family-card grooms-family-card--mobile">
              <p className="grooms-family-card-label font-subheading uppercase">{activeFamily.label}</p>

              <FamilyPortraitFrame
                activePhoto={activeFamily.images[activePhotoIndex]}
                activeIndex={activePhotoIndex}
                photoVariants={photoVariants}
                photoTransition={photoTransition}
                prefersReducedMotion={prefersReducedMotion}
                isNearView={isNearView}
                isMobile
                onSwipeLeft={() => advancePhoto(1)}
                onSwipeRight={() => advancePhoto(-1)}
              />

              <div className="grooms-family-photo-dots" role="tablist" aria-label="Choose portrait">
                {activeFamily.images.map((photo, index) => (
                  <button
                    key={photo.name}
                    type="button"
                    role="tab"
                    aria-selected={index === activePhotoIndex}
                    aria-label={photo.displayName}
                    className={`grooms-family-photo-dot${index === activePhotoIndex ? ' grooms-family-photo-dot--active' : ''}`}
                    onClick={() => {
                      markTransition()
                      setPhotoIndexes((current) => ({
                        ...current,
                        [activeFamilyKey]: index,
                      }))
                    }}
                  />
                ))}
              </div>

              <p className="grooms-family-swipe-hint font-subheading uppercase">Swipe or tap to change</p>

              <div className="grooms-family-parents" aria-label={`${activeFamily.label} parent names`}>
                <p className="grooms-family-parent-name">{activeFamily.parents[0]}</p>
                <p className="grooms-family-parent-name">{activeFamily.parents[1]}</p>
              </div>
            </article>
          </div>
        ) : (
          <div className="grooms-family-grid mt-12 md:mt-16">
            {familyFrames.map((item, frameIndex) => {
              const activePhoto = item.images[desktopActiveIndex]
              const swipeDirection = frameIndex === 0 ? 1 : -1
              const shouldFloat = isNearView && !prefersReducedMotion && !isTransitioning

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
                    animate={
                      shouldFloat
                        ? { y: frameIndex === 0 ? [-3, 3, -3] : [-4, 2, -4] }
                        : { y: 0 }
                    }
                    transition={
                      shouldFloat
                        ? { duration: frameIndex === 0 ? 9.5 : 10.2, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.45, ease: cinematicEase }
                    }
                  >
                    <FamilyPortraitFrame
                      activePhoto={activePhoto}
                      activeIndex={desktopActiveIndex}
                      photoVariants={photoVariants}
                      photoTransition={photoTransition}
                      prefersReducedMotion={prefersReducedMotion}
                      isNearView={isNearView}
                      swipeDirection={swipeDirection}
                      isMobile={false}
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
        )}

        <p className="grooms-family-subtitle mt-2 text-center font-subheading uppercase sm:mt-3">
          With Love &amp; Blessings
        </p>
      </motion.div>
    </section>
  )
}
