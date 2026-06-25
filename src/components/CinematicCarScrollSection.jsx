import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CinematicCarScrollSection() {
  const sectionRef = useRef(null)
  const roadRef = useRef(null)
  const carRef = useRef(null)
  const namesRef = useRef(null)
  const saveDateGroupRef = useRef(null)

  useLayoutEffect(() => {
    if (!sectionRef.current || !roadRef.current || !carRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

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
          const scrollFactor = isMobile ? -0.48 : isTablet ? -0.54 : -0.60
          const startScale = isMobile ? 0.95 : 0.93
          const endScale = isMobile ? 1.03 : 1.07

          gsap.set(carRef.current, {
            xPercent: -50,
            x: 0,
            y: () => window.innerHeight * startFactor,
            scale: startScale,
            opacity: 0,
            rotate: 0,
            transformOrigin: '50% 65%',
            force3D: true,
          })

          gsap.set(namesRef.current, {
            opacity: 0,
            yPercent: 20,
            filter: 'blur(12px)',
          })

          gsap.set(saveDateGroupRef.current, {
            clipPath: 'inset(100% 0% 0% 0%)',
          })

          const timeline = gsap.timeline({
            paused: true,
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: isMobile ? '+=150%' : '+=200%',
              pin: true,
              pinSpacing: true,
              scrub: isMobile ? 0.7 : isTablet ? 1.2 : 1.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })

          timeline.scrollTrigger.disable()

          timeline
            .to(
              roadRef.current,
              {
                yPercent: -2.8,
                scale: 1.016,
                duration: 1,
                ease: 'sine.inOut',
              },
              0,
            )
            .to(
              carRef.current,
              {
                y: () => window.innerHeight * scrollFactor,
                scale: endScale,
                opacity: 1,
                duration: 1,
                ease: 'sine.inOut',
              },
              0,
            )
            .to(
              saveDateGroupRef.current,
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: 0.52,
                ease: 'none',
              },
              0.2,
            )
            .to(
              namesRef.current,
              {
                opacity: 0,
                yPercent: -20,
                filter: 'blur(14px)',
                duration: 0.34,
                ease: 'sine.inOut',
              },
              0.16,
            )

          const introTimeline = gsap.timeline({
            defaults: { ease: 'power3.out' },
            onComplete: () => {
              timeline.scrollTrigger.enable()
              timeline.scrollTrigger.refresh()
              ScrollTrigger.refresh()
            },
          })

          introTimeline
            .to(
              carRef.current,
              {
                opacity: 1,
                y: () => window.innerHeight * restFactor,
                duration: 2.2,
                ease: 'power3.out',
              },
              0,
            )
            .to(
              carRef.current,
              {
                scale: startScale + 0.04,
                duration: 1.2,
                ease: 'sine.out',
              },
              0.25,
            )
            .to(
              namesRef.current,
              {
                opacity: 1,
                yPercent: 0,
                filter: 'blur(0px)',
                duration: 1.1,
                ease: 'power2.out',
              },
              0.85,
            )
            .to({}, { duration: 0.55 })

          return () => {
            introTimeline.kill()
            timeline.kill()
          }
        },
      )

      return () => {
        media.revert()
      }
    }, sectionRef)

    return () => {
      context.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="cinematic-car-section" aria-label="Cinematic wedding car introduction">
      <div ref={roadRef} className="cinematic-road-layer" aria-hidden="true" />
      <div className="cinematic-road-atmosphere" aria-hidden="true" />
      <div className="cinematic-car-overlay-content" aria-hidden="true">
        <h1 ref={namesRef} className="cinematic-couple-title" aria-label="Aakash and Viji">
          <span className="cinematic-couple-name">Aakash</span>
          <span className="cinematic-couple-heart" aria-hidden="true">
            ❤
          </span>
          <span className="cinematic-couple-name">Viji</span>
        </h1>
        <div ref={saveDateGroupRef} className="cinematic-save-date-group">
          <p className="cinematic-save-date-label">SAVE</p>
          <p className="cinematic-save-date-label">THE</p>
          <p className="cinematic-save-date-label">DATE</p>
          <p className="cinematic-save-date-value">05/07/26</p>
        </div>
      </div>
      <div className="cinematic-car-wrapper" aria-hidden="true">
        <img
          ref={carRef}
          src="/flocar.png"
          alt="Wedding car"
          className="cinematic-car-image"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  )
}