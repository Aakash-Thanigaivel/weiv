import { useEffect, useRef, useState } from 'react'

// Replace with your track — drop the file in public/music/
const MUSIC_SRC = '/music/Wedding_Bells.mp3'

export default function BackgroundMusic() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    let cancelled = false

    const onCanPlay = () => setIsReady(true)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    const removeUnlockListeners = () => {
      document.removeEventListener('pointerdown', unlockPlayback)
      document.removeEventListener('keydown', unlockPlayback)
    }

    const attemptPlay = async () => {
      if (cancelled || !audio) return false

      try {
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
      onCanPlay()
      void attemptPlay().then((started) => {
        if (!started && !cancelled) {
          document.addEventListener('pointerdown', unlockPlayback, { once: false })
          document.addEventListener('keydown', unlockPlayback, { once: false })
        }
      })
    }

    audio.addEventListener('canplaythrough', onReady)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      onReady()
    }

    return () => {
      cancelled = true
      removeUnlockListeners()
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
      await audio.play()
    } catch {
      // Ignore if playback is still blocked.
    }
  }

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} loop preload="auto" autoPlay />

      <button
        type="button"
        className="background-music-toggle"
        onClick={togglePlayback}
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        aria-pressed={isPlaying}
        disabled={!isReady}
        title={isReady ? (isPlaying ? 'Pause music' : 'Play music') : 'Loading music…'}
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
