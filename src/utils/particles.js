export const spawnCursorSparkle = (container, x, y) => {
  const sparkle = document.createElement('span')
  sparkle.className = 'cursor-sparkle'

  const size = 6 + Math.random() * 8
  sparkle.style.left = `${x - size / 2}px`
  sparkle.style.top = `${y - size / 2}px`
  sparkle.style.width = `${size}px`
  sparkle.style.height = `${size}px`
  sparkle.style.animationDuration = `${500 + Math.random() * 450}ms`

  container.appendChild(sparkle)
  window.setTimeout(() => sparkle.remove(), 1000)
}
