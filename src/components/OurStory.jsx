import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const storyImages = [
  '/IMG_1.jpeg',
  '/IMG_5.jpeg',
  '/IMG_4.jpeg',
  '/IMG_3.jpeg',
  '/IMG_2.jpeg',
  '/IMG_7.jpeg',
  '/IMG_6.jpeg'
]

const doubledImages = [...storyImages, ...storyImages]

const overlayImage = '/AakViji.jpeg'

const storyRevealLine = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  show: (index) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      delay: index * 0.05,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const storyPreviewLines = [
  'From Arranged to Forever',
  '💍 A Love We Never Expected 💍',
]

const fullStory = [
  'Our story began on October 5, when we met for the very first time. What started as an arranged meeting quickly felt like something much more special. In just 40 minutes, we shared our thoughts, dreams, and little details about ourselves. Surprisingly, that was all it took for us to feel a connection and understand each other in a way we never expected.',
  'As days passed, our conversations became longer, our smiles became brighter, and our bond grew stronger. When we met again on November 12, we realized that this was no longer just an arranged match. We genuinely liked each other, and somewhere along the way, love had quietly found its place in our hearts.',
  'Like every beautiful relationship, we had our share of arguments and misunderstandings. We fought, got upset, and sometimes promised not to talk. But the truth was, neither of us could stay away for long. No matter how big the fight was, within minutes we would find a reason to call, text, or make things right again. Our love was always stronger than our ego.',
  'There were also countless moments when we secretly met, just to spend a little more time together and create memories of our own. Those simple moments, filled with laughter, endless conversations, and shared dreams, became some of the happiest parts of our journey.',
  'Today, when we look back, it feels amazing how a single meeting changed everything. What began as a decision made by our families became a love story written by our hearts. From understanding each other in 40 minutes to building a lifetime of memories together, our journey has been filled with love, friendship, patience, and happiness.',
  'Some stories are arranged by families, but the most beautiful part is when they are completed by love. ❤️',
]

export default function OurStory() {
  const [expanded, setExpanded] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    if (!expanded) return undefined

    const handlePointerDown = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setExpanded(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setExpanded(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [expanded])

  return (
    <section
      id="our-story"
      className="relative min-h-[100svh] overflow-hidden bg-[#140309] bg-cover bg-no-repeat [background-position:50%_42%] sm:[background-position:50%_38%] md:[background-position:50%_34%] lg:bg-center py-24 md:py-28"
      style={{ backgroundImage: "url('/ourstory.png')" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(45,10,20,0.18)_0%,rgba(28,7,14,0.32)_44%,rgba(10,2,6,0.56)_100%),linear-gradient(to_bottom,rgba(10,2,6,0.36),rgba(10,2,6,0.46))]" />

      <div className="relative mx-auto w-full max-w-6xl px-4">
        <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
          <defs>
            <clipPath id="our-story-heart-clip" clipPathUnits="objectBoundingBox">
              <path d="M0.5,0.965 C0.34,0.865 0.18,0.74 0.08,0.56 C0.01,0.42 0.03,0.23 0.15,0.11 C0.25,0.03 0.39,0.03 0.5,0.14 C0.61,0.03 0.75,0.03 0.85,0.11 C0.97,0.23 0.99,0.42 0.92,0.56 C0.82,0.74 0.66,0.865 0.5,0.965 Z" />
            </clipPath>
          </defs>
        </svg>

        <div className="text-center">
          <h2 className="font-subheading text-4xl text-[#FDF6EC] md:text-5xl">✨ Guided by Fate, Graced by Heaven ✨</h2>
        </div>

        <div className="story-strip-mask mt-12 overflow-hidden py-2">
          <div
            className="story-strip-track flex w-max gap-3 sm:gap-4 md:gap-5"
            style={{ animationDuration: expanded ? '34s' : '25s' }}
          >
            {doubledImages.map((imagePath, index) => (
              <div
                key={`${imagePath}-${index}`}
                className="group aspect-[4/5] w-[160px] flex-shrink-0 overflow-hidden rounded-xl sm:w-[200px] md:w-[260px] lg:w-[300px]"
              >
                <img
                  src={imagePath}
                  alt="Wedding memory"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 ease-out md:group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-16 w-full">
          <motion.div
            ref={cardRef}
            layout
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse story heart' : 'Expand story heart'}
            onClick={() => setExpanded((prev) => !prev)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setExpanded((prev) => !prev)
              }
            }}
            style={{ clipPath: 'url(#our-story-heart-clip)', WebkitClipPath: 'url(#our-story-heart-clip)' }}
            className={`story-heart-card relative mx-auto overflow-hidden border border-[#C9A84C]/35 bg-[#2a0912]/45 text-center shadow-[0_0_36px_rgba(10,2,5,0.45)] backdrop-blur-sm ${expanded ? 'story-heart-card-expanded' : ''}`}
            animate={{
              scale: expanded ? 1 : 0.94,
              filter: expanded ? 'blur(0px)' : 'blur(0.2px)',
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence initial={false}>
              {expanded ? (
                <>
                  <motion.div
                    key="heart-ambient-left"
                    aria-hidden="true"
                    className="story-heart-ambient story-heart-ambient-left"
                    initial={{ opacity: 0, y: 10, scale: 0.6 }}
                    animate={{ opacity: 0.48, y: -8, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.6 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.div
                    key="heart-ambient-right"
                    aria-hidden="true"
                    className="story-heart-ambient story-heart-ambient-right"
                    initial={{ opacity: 0, y: 6, scale: 0.65 }}
                    animate={{ opacity: 0.42, y: -6, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.6 }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                  />
                  <motion.div
                    key="heart-ambient-top"
                    aria-hidden="true"
                    className="story-heart-ambient story-heart-ambient-top"
                    initial={{ opacity: 0, y: 8, scale: 0.55 }}
                    animate={{ opacity: 0.36, y: -6, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.6 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
                  />

                  <motion.div
                    key="story-overlay"
                    className="pointer-events-none absolute inset-0 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 z-0">
                      <motion.img
                        src={overlayImage}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover object-[50%_68%] opacity-44 sm:object-[48%_66%] md:object-[34%_46%] lg:object-[30%_42%] xl:object-[28%_38%] md:blur-[1px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.34 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#12040a]/58 via-[#15060c]/68 to-[#0e0307]/84" />
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {!expanded ? (
                <motion.div
                  key="collapsed-story"
                  className="relative z-20 mx-auto flex h-full w-full flex-col items-center justify-center px-6 pt-[28%] pb-[18%] text-center sm:px-8 sm:pt-[26%] sm:pb-[16%] md:px-10 md:pt-[24%] md:pb-[14%]"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mx-auto max-w-[22rem] text-balance text-lg leading-relaxed text-white/75 sm:max-w-none md:text-xl">
                    <p>
                      <span className="hidden md:inline">40 Minutes to Know, A Lifetime to Love</span>
                      <span className="md:hidden">
                        <span className="block">40 Minutes to Know,</span>
                        <span className="block">A Lifetime to Love</span>
                      </span>
                    </p>
                    {storyPreviewLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>

                  <button
                    type="button"
                    aria-expanded={expanded}
                    className="mt-8 inline-flex items-center justify-center rounded-full border border-[#F4DA9C]/70 bg-[#C9A84C]/15 px-7 py-3 font-subheading text-sm uppercase tracking-[0.2em] text-[#FDF6EC] shadow-[0_0_18px_rgba(201,168,76,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#C9A84C]/25 hover:shadow-[0_0_34px_rgba(201,168,76,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4DA9C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f070f]"
                  >
                    Read More
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  key="expanded-story"
                  id="our-story-full-text"
                  className="story-heart-expanded-content relative z-20 mx-auto flex h-full w-full flex-col px-[4%] pt-[12%] pb-[10%] sm:px-[3.5%] sm:pt-[11.5%] sm:pb-[9.5%] md:px-[4%] md:pt-[11%] md:pb-[9%]"
                  initial={{ opacity: 0, y: 12, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.985 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="story-heart-full-text">
                    {fullStory.map((paragraph, index) => (
                      <motion.p
                        key={`story-paragraph-${index}`}
                        custom={index}
                        variants={storyRevealLine}
                        initial="hidden"
                        animate="show"
                        className={`story-heart-tier story-heart-tier-${index}`}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
