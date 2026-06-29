import { useEffect, useRef, useState } from 'react'

const MUSIC_SRC = '/music/Wedding_Bells.mp3'

export default function BackgroundMusic() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    let cancelled = false

    const markReady = () => {
      if (!cancelled) setIsReady(true)
    }

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    const removeUnlockListeners = () => {
      document.removeEventListener('pointerdown', unlockPlayback)
      document.removeEventListener('keydown', unlockPlayback)
      document.removeEventListener('scroll', unlockPlayback, true)
      document.removeEventListener('touchstart', unlockPlayback)
    }

    const attemptPlay = async () => {
      if (cancelled || !audio) return false

      try {
        if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
          audio.load()
        }
        await audio.play()
        removeUnlockListeners()
        return true
      } catch {
        return false
      }
    }

    const unlockPlayback = () => {
      void attemptPlay()
    }

    const onReady = () => {
      markReady()
      void attemptPlay().then((started) => {
        if (!started && !cancelled) {
          document.addEventListener('pointerdown', unlockPlayback, { passive: true })
          document.addEventListener('keydown', unlockPlayback)
          document.addEventListener('scroll', unlockPlayback, { passive: true, capture: true })
          document.addEventListener('touchstart', unlockPlayback, { passive: true })
        }
      })
    }

    audio.addEventListener('canplay', markReady)
    audio.addEventListener('canplaythrough', onReady)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.load()

    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      onReady()
    }

    return () => {
      cancelled = true
      removeUnlockListeners()
      audio.removeEventListener('canplay', markReady)
      audio.removeEventListener('canplaythrough', onReady)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      return
    }

    try {
      if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
        audio.load()
      }
      await audio.play()
    } catch {
      // Browser may still require a direct user gesture.
    }
  }

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" />

      <button
        type="button"
        className="background-music-toggle"
        onClick={togglePlayback}
        aria-label={isPlaying ? 'Turn music off' : 'Turn music on'}
        aria-pressed={isPlaying}
        aria-busy={!isReady}
        title={isReady ? (isPlaying ? 'Music on' : 'Music off') : 'Tap to turn music on'}
        style={{
          width: 'auto',
          minWidth: '3rem',
          padding: '0 0.75rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
        }}
      >
        {isPlaying ? <MusicOnIcon /> : <MusicOffIcon />}
        <span>{isPlaying ? 'Music On' : 'Music Off'}</span>
      </button>
    </>
  )
}

function MusicOnIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="background-music-icon">
      <path
        d="M11 5.2v13.1c-.74-.45-1.6-.7-2.52-.7-2.2 0-4 1.35-4 3.02 0 1.67 1.8 3.02 4 3.02s4-1.35 4-3.02V9.3l7.5-2.14v8.16c-.74-.45-1.6-.7-2.52-.7-2.2 0-4 1.35-4 3.02 0 1.67 1.8 3.02 4 3.02s4-1.35 4-3.02V3.06L11 5.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MusicOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="background-music-icon">
      <path
        d="M11 5.2v8.9c-.74-.45-1.6-.7-2.52-.7-2.2 0-4 1.35-4 3.02 0 1.67 1.8 3.02 4 3.02.9 0 1.73-.22 2.45-.6l1.05 1.05V9.3l7.5-2.14v6.46l1.5-.43V3.06L11 5.2ZM3.4 4.1 2 5.5l16.6 16.6 1.4-1.4L3.4 4.1Z"
        fill="currentColor"
      />
    </svg>
  )
}
