export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

export const getViewportHeight = () =>
  window.visualViewport?.height ?? window.innerHeight

export const loadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image()
    image.decoding = 'async'

    const finish = () => resolve(image)

    image.onload = () => {
      if (typeof image.decode === 'function') {
        image.decode().then(finish).catch(finish)
        return
      }
      finish()
    }

    image.onerror = finish
    image.src = src
  })

export const preloadImages = (sources) => {
  sources.forEach((src) => {
    void loadImage(src)
  })
}

export const CAR_ASSET = '/flocar.png'
export const ROAD_ASSET = '/roadthree.png'

export const INTRO_HOLD_MS = 2000

export const CELEBRATION_ASSETS = [
  '/engagement.png',
  '/reception.png',
  '/muhurutham.png',
  '/4thsectionbg.jpeg',
]

export const STORY_ASSETS = [
  '/ourstory.png',
  '/AakViji.jpeg',
  '/IMG_1.jpeg',
  '/IMG_2.jpeg',
  '/IMG_3.jpeg',
  '/IMG_4.jpeg',
  '/IMG_5.jpeg',
]

export const FAMILY_ASSETS = [
  '/5thsection.jpeg',
  '/bridefather.png',
  '/bridemother.png',
  '/bridemomnddad.jpeg',
  '/groomfather.png',
  '/groommom.png',
  '/groommomnddad.png',
  '/newarch.png',
]

export const LATE_ASSETS = [
  '/frame.png',
  '/purplepattern.jpeg',
  '/heart.jpeg',
]

let carLoadPromise = null

export const getCarLoadPromise = () => {
  if (!carLoadPromise) {
    carLoadPromise = Promise.all([loadImage(CAR_ASSET), loadImage(ROAD_ASSET)])
  }
  return carLoadPromise
}

export const preloadCelebrationAssets = () => {
  preloadImages(CELEBRATION_ASSETS)
}

export const preloadStoryAssets = () => {
  preloadImages(STORY_ASSETS)
}

export const preloadFamilyAssets = () => {
  preloadImages(FAMILY_ASSETS)
}

export const preloadLateAssets = () => {
  preloadImages(LATE_ASSETS)
}

export const prefetchInviteChunks = () => {
  void import('../components/OurStory')
  void import('../components/WeddingCelebrationsSection')
  void import('../components/GroomsFamilySection')
  void import('../components/RsvpParallaxSection')
  void import('../components/SeeTheRouteSection')
}

export const runStagedInvitePreload = () => {
  void getCarLoadPromise()
  preloadCelebrationAssets()

  const stageTwo = window.setTimeout(() => {
    preloadStoryAssets()
    prefetchInviteChunks()
  }, 400)

  const stageThree = window.setTimeout(() => {
    preloadFamilyAssets()
    preloadLateAssets()
  }, INTRO_HOLD_MS + 600)

  return () => {
    window.clearTimeout(stageTwo)
    window.clearTimeout(stageThree)
  }
}

export const waitForIntroHold = () =>
  new Promise((resolve) => {
    window.setTimeout(resolve, INTRO_HOLD_MS)
  })
