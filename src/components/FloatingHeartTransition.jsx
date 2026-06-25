import { useEffect, useMemo, useRef, useState } from 'react'

const HEART_ASSET = '/heart.jpeg'

const LAYER_CONFIG = {
  background: {
    count: { mobile: 2, tablet: 3, desktop: 4 },
    size: [56, 100],
    opacity: [0.34, 0.48],
    // parallax: how much this layer moves per pixel of scroll velocity
    parallax: 0.22,
    glow: [0.36, 0.5],
    brightness: [1.24, 1.42],
  },
  mid: {
    count: { mobile: 3, tablet: 4, desktop: 5 },
    size: [40, 72],
    opacity: [0.56, 0.72],
    parallax: 0.52,
    glow: [0.5, 0.7],
    brightness: [1.36, 1.56],
  },
  foreground: {
    count: { mobile: 3, tablet: 4, desktop: 4 },
    size: [28, 48],
    opacity: [0.78, 0.96],
    parallax: 0.9,
    glow: [0.68, 0.88],
    brightness: [1.5, 1.84],
  },
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const seeded = (seed) => {
  const value = Math.sin(seed * 127.1 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

const between = (seed, min, max) => min + seeded(seed) * (max - min)

const getViewportTier = (width) => {
  if (width < 760) return 'mobile'
  if (width < 1080) return 'tablet'
  return 'desktop'
}

const generateHearts = (tier) => {
  const hearts = []
  const layers = ['background', 'mid', 'foreground']
  const laneAnchors = [8, 20, 32, 46, 58, 72, 86, 94]

  layers.forEach((layerName, layerIndex) => {
    const config = LAYER_CONFIG[layerName]
    const count = config.count[tier]

    for (let index = 0; index < count; index += 1) {
      const base = 13 + layerIndex * 100 + index * 11
      const laneIndex = (index * 2 + layerIndex) % laneAnchors.length
      const left = clamp(laneAnchors[laneIndex] + between(base + 1, -3.4, 3.4), 4, 96)

      hearts.push({
        id: `${layerName}-${index}`,
        layer: layerName,
        left,
        // initial Y position as a fraction of viewport height (0–1)
        initialYFraction: between(base + 2, 0.04, 0.96),
        size: between(base + 3, config.size[0], config.size[1]),
        opacity: between(base + 4, config.opacity[0], config.opacity[1]),
        // per-heart parallax variation
        parallax: config.parallax * between(base + 6, 0.82, 1.18),
        glow: between(base + 9, config.glow[0], config.glow[1]),
        brightness: between(base + 10, config.brightness[0], config.brightness[1]),
        tilt: between(base + 12, -8, 8),
      })
    }
  })

  return hearts
}

const createTransparentHeart = () =>
  new Promise((resolve) => {
    const image = new Image()
    image.decoding = 'async'

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { willReadFrequently: true })

      if (!context) {
        resolve(HEART_ASSET)
        return
      }

      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      context.drawImage(image, 0, 0)

      const frame = context.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = frame.data

      for (let index = 0; index < pixels.length; index += 4) {
        const red = pixels[index]
        const green = pixels[index + 1]
        const blue = pixels[index + 2]
        const luminance = red * 0.299 + green * 0.587 + blue * 0.114

        if (luminance < 138) {
          pixels[index + 3] = 0
          continue
        }

        const alpha = Math.min(255, ((luminance - 138) / 117) * 255)
        pixels[index + 3] = alpha

        pixels[index] = Math.min(255, red * 1.08)
        pixels[index + 1] = Math.min(255, green * 1.08)
        pixels[index + 2] = Math.min(255, blue * 1.12)
      }

      context.putImageData(frame, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }

    image.onerror = () => resolve(HEART_ASSET)
    image.src = HEART_ASSET
  })

export default function FloatingHeartTransition() {
  const [tier, setTier] = useState(() => getViewportTier(window.innerWidth))
  const [heartAsset, setHeartAsset] = useState(HEART_ASSET)
  const hearts = useMemo(() => generateHearts(tier), [tier])
  const heartRefs = useRef([])
  const containerRef = useRef(null)

  // All mutable animation state lives in a ref — zero re-renders in the loop
  const loopState = useRef({
    velocity: 0,
    lastScrollY: window.scrollY,
    isActive: false,
    positions: [],   // { y, opacity, targetOpacity } per heart
  })

  useEffect(() => {
    const onResize = () => setTier(getViewportTier(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    let mounted = true
    createTransparentHeart().then((asset) => {
      if (mounted) setHeartAsset(asset)
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const state = loopState.current
    const vh = window.innerHeight

    // Initialize per-heart positions spread across the full viewport height
    state.positions = hearts.map((h) => ({
      y: h.initialYFraction * vh,
      opacity: 0,
      targetOpacity: 0,
    }))
    state.velocity = 0
    state.lastScrollY = window.scrollY
    state.isActive = false

    // Start hidden
    if (containerRef.current) containerRef.current.style.display = 'none'

    let rafId = 0

    /**
     * Returns true when hearts should be visible:
     * - after hero has entered from the bottom (so no hearts on the car section)
     * - until our-story has fully scrolled past the top
     */
    const checkActive = () => {
      const hero = document.getElementById('hero')
      const story = document.getElementById('our-story')
      if (!hero) return false

      const heroRect = hero.getBoundingClientRect()
      const viewportH = window.innerHeight

      // If hero is fully below viewport, user is above hero in the car section.
      if (heroRect.top >= viewportH) return false

      // end only when story has completely left the top of the screen
      if (story) {
        const storyRect = story.getBoundingClientRect()
        if (storyRect.bottom <= 0) return false
      }

      return true
    }

    /**
     * Calculates and applies a clip-path so hearts only render inside the
     * visible area of the hero+story sections — never over the car animation.
     */
    const applyClip = () => {
      if (!containerRef.current) return
      const hero = document.getElementById('hero')
      const story = document.getElementById('our-story')
      if (!hero) return

      const heroRect = hero.getBoundingClientRect()
      const storyRect = story ? story.getBoundingClientRect() : heroRect
      const viewportH = window.innerHeight

      // Top edge: where the hero section starts in the viewport (clamped to 0)
      const topClip = Math.max(0, Math.round(heroRect.top))
      // Bottom edge: where the story section ends in the viewport (clamped to viewport)
      const rawBottom = Math.min(viewportH, Math.round(storyRect.bottom))
      const bottomClip = Math.max(0, viewportH - rawBottom)

      containerRef.current.style.clipPath = `inset(${topClip}px 0px ${bottomClip}px 0px)`
    }

    const animate = () => {
      const currentScrollY = window.scrollY
      const rawDelta = currentScrollY - state.lastScrollY
      state.lastScrollY = currentScrollY

      // Cinematic inertia: smooth the raw per-frame scroll delta
      // factor 0.80 = smooth decay, 0.50 = how quickly new input is absorbed
      state.velocity = state.velocity * 0.80 + rawDelta * 0.50

      const nowActive = checkActive()
      const viewportH = window.innerHeight

      // Clip hearts to the visible hero+story area every frame (sections are scrolling)
      if (nowActive) applyClip()

      // Transition active state — no React setState, just DOM toggle
      if (nowActive !== state.isActive) {
        state.isActive = nowActive

        if (nowActive && containerRef.current) {
          containerRef.current.style.display = 'block'
        }

        hearts.forEach((heart, i) => {
          const pos = state.positions[i]
          if (pos) pos.targetOpacity = nowActive ? heart.opacity : 0
        })
      }

      // Check if all hearts have fully faded out so we can hide the container
      let anyVisible = false

      hearts.forEach((heart, i) => {
        const pos = state.positions[i]
        const node = heartRefs.current[i]
        if (!pos || !node) return

        // --- Scroll-driven parallax movement ---
        // Each layer moves at a different speed → clear depth / layered feel
        pos.y += state.velocity * heart.parallax

        // Wrap vertically: hearts that exit the viewport re-enter from the opposite edge
        const buffer = heart.size + 8
        if (pos.y > viewportH + buffer) {
          pos.y -= viewportH + buffer * 2
        } else if (pos.y < -buffer) {
          pos.y += viewportH + buffer * 2
        }

        // Smooth opacity: slow fade-in / fade-out (0.035 ≈ ~0.7 s to full opacity)
        pos.opacity += (pos.targetOpacity - pos.opacity) * 0.035

        if (pos.opacity > 0.004) anyVisible = true

        // Apply to DOM — single transform covers both position and tilt
        node.style.transform = `translate3d(0, ${pos.y.toFixed(2)}px, 0) rotate(${heart.tilt}deg)`
        node.style.opacity = pos.opacity.toFixed(4)
      })

      // Hide container only after all hearts have fully faded out
      if (!nowActive && !anyVisible && containerRef.current) {
        containerRef.current.style.display = 'none'
      }

      rafId = window.requestAnimationFrame(animate)
    }

    rafId = window.requestAnimationFrame(animate)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [hearts, tier])

  return (
    <section
      ref={containerRef}
      aria-hidden="true"
      className="heart-transition-section"
      style={{ display: 'none' }}
    >
      <div className="heart-transition-field">
        {hearts.map((heart, index) => (
          <span
            key={heart.id}
            ref={(node) => { heartRefs.current[index] = node }}
            className={`heart-particle heart-layer-${heart.layer}`}
            style={{
              left: `${heart.left}%`,
              top: 0,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              filter: `brightness(${heart.brightness})`,
              '--heart-glow': heart.glow,
              opacity: 0,
            }}
          >
            <img src={heartAsset} alt="" loading="lazy" decoding="async" draggable="false" />
          </span>
        ))}
      </div>
    </section>
  )
}
