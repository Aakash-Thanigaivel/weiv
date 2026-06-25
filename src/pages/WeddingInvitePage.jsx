import { lazy, Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import BackgroundMusic from '../components/BackgroundMusic'
import CinematicCarScrollSection from '../components/CinematicCarScrollSection'
import FloatingHeartTransition from '../components/FloatingHeartTransition'
import InvitationHeroSection from '../components/InvitationHeroSection'
import InviteSectionFallback from '../components/InviteSectionFallback'
import useMobileScrollOptimizations from '../hooks/useMobileScrollOptimizations'
import { runStagedInvitePreload } from '../utils/performance'

const CELEBRATION_PRELOADS = [
  '/engagement.png',
  '/reception.png',
  '/muhurutham.png',
  '/4thsectionbg.jpeg',
]

const OurStory = lazy(() => import('../components/OurStory'))
const WeddingCelebrationsSection = lazy(() => import('../components/WeddingCelebrationsSection'))
const GroomsFamilySection = lazy(() => import('../components/GroomsFamilySection'))
const RsvpParallaxSection = lazy(() => import('../components/RsvpParallaxSection'))
const SeeTheRouteSection = lazy(() => import('../components/SeeTheRouteSection'))

const cinematicEase = [0.22, 1, 0.36, 1]

export default function WeddingInvitePage() {
  useMobileScrollOptimizations()

  useEffect(() => {
    return runStagedInvitePreload()
  }, [])

  return (
    <div className="invite-page relative min-h-screen overflow-x-clip bg-[#17090d] text-[#FDF6EC]">
      <div className="invite-preload-cache" aria-hidden="true">
        {CELEBRATION_PRELOADS.map((src) => (
          <img key={src} src={src} alt="" decoding="async" loading="eager" />
        ))}
      </div>
      <BackgroundMusic />
      <motion.main
        className="invite-main relative z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: cinematicEase }}
      >
        <CinematicCarScrollSection />
        <InvitationHeroSection />
        <FloatingHeartTransition />

        <Suspense fallback={<InviteSectionFallback />}>
          <OurStory />
        </Suspense>

        <Suspense fallback={<InviteSectionFallback />}>
          <WeddingCelebrationsSection />
        </Suspense>

        <Suspense fallback={<InviteSectionFallback />}>
          <GroomsFamilySection />
        </Suspense>

        <Suspense fallback={<InviteSectionFallback />}>
          <RsvpParallaxSection />
        </Suspense>

        <Suspense fallback={<InviteSectionFallback />}>
          <SeeTheRouteSection />
        </Suspense>
      </motion.main>
    </div>
  )
}
