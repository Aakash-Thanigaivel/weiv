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
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        aria-pressed={isPlaying}
        aria-busy={!isReady}
        title={isReady ? (isPlaying ? 'Pause music' : 'Play music') : 'Tap to play music'}
      >
        {isPlaying ? <MusicPauseIcon /> : <MusicPlayIcon />}
      </button>
    </>
  )
}

function MusicPlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="background-music-icon">
      <path
        d="M9 18V6l10 6-10 6Z"
        fill="currentColor"
      />
      <path
        d="M4.5 7.2c0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3v9.6c0 .72-.58 1.3-1.3 1.3-.72 0-1.3-.58-1.3-1.3V7.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function MusicPauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="background-music-icon">
      <path
        d="M6.5 6.8c0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3v10.4c0 .72-.58 1.3-1.3 1.3-.72 0-1.3-.58-1.3-1.3V6.8Z"
        fill="currentColor"
      />
      <path
        d="M16.2 6.8c0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3v10.4c0 .72-.58 1.3-1.3 1.3-.72 0-1.3-.58-1.3-1.3V6.8Z"
        fill="currentColor"
      />
    </svg>
  )
}
