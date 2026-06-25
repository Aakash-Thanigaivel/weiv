import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import useCountdown from '../hooks/useCountdown'

const storyImages = [
  '/IMG_1.jpeg',
  '/IMG_5.jpeg',
  '/IMG_4.jpeg',
  '/IMG_3.jpeg',
  '/IMG_2.jpeg',
  '/IMG_7.jpeg',
  '/IMG_6.jpeg',
  '/IMG_8.jpeg',
  '/IMG_9.jpeg',
  '/IMG_11.jpeg',
  '/ext1.jpeg',
  '/ext2.jpeg',
  '/ext3.jpeg',
  '/ext4.jpeg',
  '/ext5.jpeg',
]

const WEDDING_DATE = '2026-07-05T07:31:00'
const SLIDE_INTERVAL_MS = 28125
const SWIPE_THRESHOLD_PX = 50

const OFFSETS = [-2, -1, 0, 1, 2]

const slideTransition = { duration: 1.15, ease: [0.33, 1, 0.68, 1] }

const SLOT_LAYOUT = {
  [-2]: { xVw: -39, scale: 0.64, opacity: 1, zIndex: 1 },
  [-1]: { xVw: -20.5, scale: 0.84, opacity: 1, zIndex: 2 },
  [0]: { xVw: 0, scale: 1, opacity: 1, zIndex: 3 },
  [1]: { xVw: 20.5, scale: 0.84, opacity: 1, zIndex: 2 },
  [2]: { xVw: 39, scale: 0.64, opacity: 1, zIndex: 1 },
}

const slideCardBaseClass =
  'absolute left-1/2 top-1/2 aspect-[4/5] h-[72vh] w-auto sm:h-[76vh] md:h-[80vh]'

const slideCardClass = `${slideCardBaseClass} pointer-events-none`
const navigableSlideClass = `${slideCardBaseClass} pointer-events-auto cursor-pointer`

function shuffleArray(items) {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

function getSlotMotion(layout) {
  return {
    x: `calc(-50% + ${layout.xVw}vw)`,
    y: '-50%',
    scale: layout.scale,
    opacity: layout.opacity,
  }
}

function getCenterVariants(layout) {
  return {
    enter: (direction) => ({
      x: `calc(-50% + ${layout.xVw + direction * 14}vw)`,
      y: '-50%',
      scale: layout.scale * 0.94,
      opacity: 0,
    }),
    center: getSlotMotion(layout),
    exit: (direction) => ({
      x: `calc(-50% + ${layout.xVw - direction * 14}vw)`,
      y: '-50%',
      scale: layout.scale * 0.94,
      opacity: 0,
    }),
  }
}

function slideshowReducer(state, action) {
  const { slideCount } = action

  if (action.type === 'NEXT') {
    return {
      index: (state.index + 1) % slideCount,
      direction: 1,
    }
  }

  if (action.type === 'PREV') {
    return {
      index: (state.index - 1 + slideCount) % slideCount,
      direction: -1,
    }
  }

  return state
}

function SlideshowCountdownUnit({ value, label }) {
  const formattedValue = String(value).padStart(2, '0')

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-[5.5rem] flex-1 items-center justify-center rounded-lg border border-[#F4D58B66] bg-[#2a0912] px-0.5 py-0 text-center shadow-[inset_0_0_16px_rgba(255,255,255,0.08),0_0_18px_rgba(201,168,76,0.14)] sm:min-h-[6.5rem] md:min-h-[7.5rem]">
        <span className="font-subheading text-[clamp(3.5rem,12vh,10rem)] font-bold italic tabular-nums leading-[0.9] bg-gradient-to-b from-[#FFF6D8] via-[#F4DA9C] to-[#B8860B] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(201,168,76,0.5)]">
          {formattedValue}
        </span>
      </div>
      <p className="mt-0.5 text-center text-[7px] uppercase tracking-[0.16em] text-[#C9A84C] sm:text-[8px] md:text-[9px]">
        {label}
      </p>
    </div>
  )
}

function CountdownCard({ timeLeft, className = '' }) {
  return (
    <div
      className={`flex aspect-[4/5] h-full w-full flex-col overflow-hidden rounded-2xl border border-[rgba(201,168,76,0.4)] bg-[#140309] p-2 sm:p-3 md:p-4 ${className}`}
    >
      <p className="shrink-0 px-1 text-center font-subheading text-[clamp(0.8rem,2.2vh,1.35rem)] font-light italic leading-tight tracking-[0.05em] text-[#F4DA9C] drop-shadow-[0_1px_6px_rgba(201,168,76,0.35)]">
        Counting Down to Forever
      </p>

      <div className="mt-1.5 grid min-h-0 flex-1 grid-cols-2 gap-0.5 sm:mt-2 sm:gap-1">
        <SlideshowCountdownUnit value={timeLeft.days} label="Days" />
        <SlideshowCountdownUnit value={timeLeft.hours} label="Hours" />
        <SlideshowCountdownUnit value={timeLeft.minutes} label="Minutes" />
        <SlideshowCountdownUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  )
}

function SlideContent({ item, timeLeft, className = '' }) {
  if (item.type === 'countdown') {
    return <CountdownCard timeLeft={timeLeft} className={className} />
  }

  return (
    <div className={`aspect-[4/5] h-full w-full overflow-hidden rounded-2xl ${className}`}>
      <img src={item.src} alt="Wedding memory" className="h-full w-full object-cover" />
    </div>
  )
}

function CarouselSlide({ offset, slideIndex, slides, timeLeft, index, direction, onNavigate }) {
  const layout = SLOT_LAYOUT[offset]
  const item = slides[slideIndex]
  const isNavigable = offset === -2 || offset === 2
  const cardClass = isNavigable ? navigableSlideClass : slideCardClass
  const shadowClass =
    offset === 0
      ? 'shadow-[0_20px_60px_rgba(0,0,0,0.55)]'
      : 'shadow-[0_12px_40px_rgba(0,0,0,0.45)]'
  const centerVariants = getCenterVariants(layout)

  const handleNavigate = () => {
    if (offset === -2) onNavigate(-1)
    if (offset === 2) onNavigate(1)
  }

  const slideBody = (
    <SlideContent item={item} timeLeft={timeLeft} className={shadowClass} />
  )

  if (offset === 0) {
    return (
      <AnimatePresence mode="sync" initial={false} custom={direction}>
        <motion.div
          key={index}
          className={`${cardClass} ${item.type === 'countdown' ? 'bg-[#140309]' : ''}`}
          style={{ zIndex: layout.zIndex }}
          custom={direction}
          variants={centerVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
        >
          {slideBody}
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <motion.div
      key={`${offset}-${slideIndex}`}
      className={`${cardClass} ${item.type === 'countdown' ? 'bg-[#140309]' : ''}`}
      style={{ zIndex: layout.zIndex }}
      initial={false}
      animate={getSlotMotion(layout)}
      transition={slideTransition}
      onClick={isNavigable ? handleNavigate : undefined}
      role={isNavigable ? 'button' : undefined}
      aria-label={
        offset === -2 ? 'Go to previous slide' : offset === 2 ? 'Go to next slide' : undefined
      }
    >
      <motion.div
        key={slideIndex}
        className="h-full w-full"
        initial={{ opacity: 0.72 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
      >
        {slideBody}
      </motion.div>
    </motion.div>
  )
}

export default function Slideshow() {
  const timeLeft = useCountdown(WEDDING_DATE)
  const timerRef = useRef(null)
  const pointerStartX = useRef(null)

  const slides = useMemo(() => {
    const shuffledImages = shuffleArray(storyImages)

    return [
      ...shuffledImages.map((src) => ({ type: 'image', src, key: `image-${src}` })),
      { type: 'countdown', key: 'countdown' },
    ]
  }, [])

  const slideCount = slides.length
  const [{ index, direction }, dispatch] = useReducer(slideshowReducer, {
    index: 0,
    direction: 1,
  })

  const goToSlide = useCallback(
    (step) => {
      dispatch({ type: step > 0 ? 'NEXT' : 'PREV', slideCount })
    },
    [slideCount],
  )

  const restartTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      dispatch({ type: 'NEXT', slideCount })
    }, SLIDE_INTERVAL_MS)
  }, [slideCount])

  useEffect(() => {
    restartTimer()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [restartTimer])

  const handleManualNav = useCallback(
    (step) => {
      goToSlide(step)
      restartTimer()
    },
    [goToSlide, restartTimer],
  )

  const handlePointerDown = (event) => {
    if (event.target.closest('[role="button"]')) return
    pointerStartX.current = event.clientX
  }

  const handlePointerUp = (event) => {
    if (pointerStartX.current === null) return

    const delta = event.clientX - pointerStartX.current

    if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
      handleManualNav(delta < 0 ? 1 : -1)
    }

    pointerStartX.current = null
  }

  const handlePointerCancel = () => {
    pointerStartX.current = null
  }

  return (
    <section
      id="slideshow"
      className="relative flex h-[100dvh] min-h-[100dvh] touch-pan-y items-center justify-center overflow-hidden bg-[#140309]"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bla.jpeg')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(20,3,9,0.18)_0%,rgba(20,3,9,0.42)_48%,rgba(10,2,6,0.62)_100%)]" />

      <div className="relative h-full w-full">
        {OFFSETS.map((offset) => {
          const slideIndex = (index + offset + slideCount) % slideCount

          return (
            <CarouselSlide
              key={`slot-${offset}`}
              offset={offset}
              slideIndex={slideIndex}
              slides={slides}
              timeLeft={timeLeft}
              index={index}
              direction={direction}
              onNavigate={handleManualNav}
            />
          )
        })}
      </div>
    </section>
  )
}
