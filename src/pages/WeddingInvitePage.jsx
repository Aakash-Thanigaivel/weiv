import { motion } from 'framer-motion'
import BackgroundMusic from '../components/BackgroundMusic'
import CinematicCarScrollSection from '../components/CinematicCarScrollSection'
import FloatingHeartTransition from '../components/FloatingHeartTransition'
import GroomsFamilySection from '../components/GroomsFamilySection'
import InvitationHeroSection from '../components/InvitationHeroSection'
import OurStory from '../components/OurStory'
import RsvpParallaxSection from '../components/RsvpParallaxSection'
import SeeTheRouteSection from '../components/SeeTheRouteSection'
import WeddingCelebrationsSection from '../components/WeddingCelebrationsSection'

const cinematicEase = [0.22, 1, 0.36, 1]

export default function WeddingInvitePage() {
  return (
    <div className="relative min-h-screen overflow-x-clip text-[#FDF6EC]">
      <BackgroundMusic />
      <motion.main
        className="relative z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: cinematicEase }}
      >
        <CinematicCarScrollSection />

        <InvitationHeroSection />

        <FloatingHeartTransition />

        <OurStory />

        <WeddingCelebrationsSection />

        <GroomsFamilySection />

        <RsvpParallaxSection />

        <SeeTheRouteSection />
      </motion.main>
    </div>
  )
}
