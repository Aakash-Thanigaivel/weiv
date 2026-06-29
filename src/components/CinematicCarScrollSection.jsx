import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  getCarLoadPromise,
  getViewportHeight,
  preloadCelebrationAssets,
  preloadStoryAssets,
} from '../utils/performance'

gsap.registerPlugin(ScrollTrigger)

export default function CinematicCarScrollSection() {
  const pinSpacerRef = useRef(null)
  const sectionRef = useRef(null)
  const roadRef = useRef(null)
  const carWrapperRef = useRef(null)
  const namesRef = useRef(null)
  const saveDateGroupRef = useRef(null)

  useEffect(() => {
    void getCarLoadPromise()
    preloadCelebrationAssets()
  }, [])

  useLayoutEffect(() => {
    if (
      !pinSpacerRef.current ||
      !sectionRef.current ||
      !roadRef.current ||
      !carWrapperRef.current ||
      !namesRef.current
    ) {
      return undefined
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let cancelled = false
    let introTimeline = null

    const context = gsap.context(() => {
      const media = gsap.matchMedia()

      media.add(
        {
          isMobile: '(max-width: 767px)',
          isTablet: '(min-width: 768px) and (max-width: 1023px)',
          isDesktop: '(min-width: 1024px)',
        },
        (mqContext) => {
          const { isMobile, isTablet } = mqContext.conditions
          const startFactor = isMobile ? 0.62 : isTablet ? 0.68 : 0.74
          const restFactor = isMobile ? 0.16 : isTablet ? 0.19 : 0.22
          const scrollFactor = isMobile ? -0.76 : isTablet ? -0.82 : -0.88
          const startScale = isMobile ? 0.95 : 0.93
          const endScale = isMobile ? 1.03 : 1.07
          const viewportHeight = () => getViewportHeight()
          const titleLines = namesRef.current.querySelectorAll('.cinematic-intro-line')
          const mobileCarStartY = () => viewportHeight() * 0.62
          const introY = () => (isMobile ? 0 : viewportHeight() * restFactor)
          const introScale = startScale + 0.04
          const scrollY = () => viewportHeight() * scrollFactor

          if (isMobile) {
            sectionRef.current.classList.remove('cinematic-car-section--past')
          }

          gsap.set(roadRef.current, {
            clearProps: 'transform',
            scale: 1,
            y: 0,
            yPercent: 0,
          })

          const centerCarWrapper = isMobile

          gsap.set(carWrapperRef.current, {
            ...(centerCarWrapper
              ? { xPercent: -50, left: '50%', x: 0, top: 'auto', right: 'auto' }
              : { left: 0, right: 0, x: 0, xPercent: 0 }),
            y: () => (isMobile ? mobileCarStartY() : viewportHeight() * startFactor),
            scale: startScale,
            autoAlpha: 0,
            rotate: 0,
            transformOrigin: '50% 80%',
            force3D: true,
          })

          gsap.set(namesRef.current, { opacity: 1, y: 0 })
          gsap.set(titleLines, {
            opacity: 0,
            yPercent: 28,
            filter: 'blur(10px)',
          })

          gsap.set(saveDateGroupRef.current, {
            clipPath: 'inset(100% 0% 0% 0%)',
          })

          let introComplete = false

          const scrollTimeline = gsap.timeline({
            paused: true,
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: isMobile ? pinSpacerRef.current : sectionRef.current,
              start: 'top top',
              end: isMobile ? 'bottom top' : '+=200%',
              pin: !isMobile,
              pinSpacing: !isMobile,
              pinType: 'fixed',
              scrub: isMobile ? 0.85 : true,
              anticipatePin: 0,
              fastScrollEnd: false,
              invalidateOnRefresh: false,
              onUpdate: (self) => {
                if (!introComplete) {
                  self.scroll(self.start)
                }
              },
              onLeave: () => {
                if (isMobile) {
                  sectionRef.current?.classList.add('cinematic-car-section--past')
                }

                gsap.to(carWrapperRef.current, {
                  autoAlpha: 0,
                  duration: 0.18,
                  ease: 'power1.in',
                })
              },
              onEnterBack: () => {
                if (isMobile) {
                  sectionRef.current?.classList.remove('cinematic-car-section--past')
                }

                gsap.set(carWrapperRef.current, { autoAlpha: 1 })
              },
            },
          })

          if (!isMobile) {
            scrollTimeline.scrollTrigger.disable()
          }

          if (isMobile) {
            scrollTimeline.fromTo(
              carWrapperRef.current,
              {
                y: introY,
                opacity: 1,
              },
              {
                y: scrollY,
                opacity: 1,
                duration: 1,
                ease: 'none',
                immediateRender: false,
              },
              0,
            )
          } else {
            scrollTimeline.fromTo(
              carWrapperRef.current,
              {
                y: introY,
                scale: introScale,
                opacity: 1,
              },
              {
                y: scrollY,
                scale: endScale,
                opacity: 1,
                duration: 1,
                ease: 'none',
                immediateRender: false,
              },
              0,
            )
          }

          scrollTimeline
            .to(
              saveDateGroupRef.current,
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: isMobile ? 0.38 : 0.52,
                ease: 'none',
              },
              isMobile ? 0.1 : 0.2,
            )
            .to(
              namesRef.current,
              {
                opacity: 0,
                duration: 0.34,
                ease: 'none',
              },
              isMobile ? 0.08 : 0.16,
            )

          let scrollReady = false

          const enableScroll = () => {
            if (cancelled || scrollReady) return
            scrollReady = true

            const settledY = introY()
            const settledScale = introScale

            gsap.set(carWrapperRef.current, {
              ...(centerCarWrapper
                ? { xPercent: -50, left: '50%', x: 0, top: 'auto', right: 'auto' }
                : { left: 0, right: 0, x: 0, xPercent: 0 }),
              y: settledY,
              ...(isMobile ? {} : { scale: settledScale }),
              autoAlpha: 1,
              force3D: true,
            })

            gsap.set(roadRef.current, {
              clearProps: 'transform',
              scale: 1,
              y: 0,
              yPercent: 0,
            })

            if (isMobile) {
              introComplete = true
              return
            }

            scrollTimeline.invalidate()
            scrollTimeline.progress(0)

            scrollTimeline.scrollTrigger.enable(false)
            introComplete = true
          }

          const playIntro = () => {
            if (cancelled) return

            preloadStoryAssets()

            introTimeline = gsap.timeline({
              defaults: { ease: 'power2.out' },
            })

            introTimeline
              .to(
                carWrapperRef.current,
                {
                  autoAlpha: 1,
                  y: introY,
                  duration: 1.15,
                  ease: 'power3.out',
                  ...(isMobile ? { onComplete: enableScroll } : {}),
                },
                0,
              )

            if (!isMobile) {
              introTimeline.to(
                carWrapperRef.current,
                {
                  scale: introScale,
                  duration: 0.9,
                  ease: 'sine.out',
                  onComplete: enableScroll,
                },
                0.18,
              )
            }

            introTimeline.to(
                titleLines,
                {
                  opacity: 1,
                  yPercent: 0,
                  filter: 'blur(0px)',
                  duration: 1.35,
                  stagger: 0.72,
                  ease: [0.22, 1, 0.36, 1],
                },
                0.12,
              )
          }

          void getCarLoadPromise().finally(playIntro)

          return () => {
            introTimeline?.kill()
            scrollTimeline.kill()
          }
        },
      )

      return () => {
        media.revert()
      }
    }, [sectionRef, pinSpacerRef])

    return () => {
      cancelled = true
      introTimeline?.kill()
      sectionRef.current?.classList.remove('cinematic-car-section--past')
      context.revert()
    }
  }, [])

  return (
    <>
    <div ref={pinSpacerRef} className="cinematic-car-pin-spacer" aria-hidden="true" />
    <section ref={sectionRef} className="cinematic-car-section" aria-label="Cinematic wedding car introduction">
      <div className="cinematic-scene-layer" aria-hidden="true">
        <div ref={roadRef} className="cinematic-road-layer" />
        <div className="cinematic-road-bottom-filler" />
        <div className="cinematic-road-atmosphere" />
      </div>
      <div className="cinematic-car-clip" aria-hidden="true">
        <div ref={carWrapperRef} className="cinematic-car-wrapper">
          <img
            src="/flocar.png"
            alt="Wedding car"
            className="cinematic-car-image"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
      <div className="cinematic-car-overlay-content">
        <h1 ref={namesRef} className="cinematic-couple-title" aria-label="Aakash loves Viji">
          <span className="cinematic-couple-name cinematic-intro-line">Aakash</span>
          <span className="cinematic-couple-heart cinematic-intro-line" aria-hidden="true">
            ❤
          </span>
          <span className="cinematic-couple-name cinematic-intro-line">Viji</span>
        </h1>
        <div ref={saveDateGroupRef} className="cinematic-save-date-group">
          <p className="cinematic-save-date-label">SAVE</p>
          <p className="cinematic-save-date-label">THE</p>
          <p className="cinematic-save-date-label">DATE</p>
          <p className="cinematic-save-date-value">05/07/26</p>
        </div>
      </div>
    </section>
    </>
  )
}
