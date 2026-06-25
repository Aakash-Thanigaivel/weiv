export const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches

export const getViewportHeight = () =>
  window.visualViewport?.height ?? window.innerHeight

export const preloadImages = (sources) => {
  sources.forEach((src) => {
    const image = new Image()
    image.decoding = 'async'
    image.src = src
  })
}

const BELOW_FOLD_ASSETS = [
  '/ourstory.png',
  '/AakViji.jpeg',
  '/IMG_1.jpeg',
  '/IMG_2.jpeg',
  '/4thsectionbg.jpeg',
  '/engagement.png',
  '/reception.png',
  '/muhurutham.png',
  '/5thsection.jpeg',
  '/bridefather.png',
  '/bridemother.png',
  '/bridemomnddad.jpeg',
  '/groomfather.png',
  '/groommom.png',
  '/groommomnddad.png',
  '/newarch.png',
  '/frame.png',
  '/purplepattern.jpeg',
]

export const preloadBelowFoldAssets = () => {
  const run = () => preloadImages(BELOW_FOLD_ASSETS)

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(run, { timeout: 2200 })
    return () => window.cancelIdleCallback(id)
  }

  const timeoutId = window.setTimeout(run, 600)
  return () => window.clearTimeout(timeoutId)
}
