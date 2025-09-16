/**
 * Smooth scroll utility function
 * @param targetPosition - The target scroll position
 * @param duration - Animation duration in milliseconds
 */
export function smoothScrollTo(targetPosition: number, duration: number = 1000) {
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  let startTime: number | null = null

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    // Easing function (ease-in-out)
    const ease = progress < 0.5 
      ? 2 * progress * progress 
      : -1 + (4 - 2 * progress) * progress

    window.scrollTo(0, startPosition + distance * ease)

    if (timeElapsed < duration) {
      requestAnimationFrame(animation)
    }
  }

  requestAnimationFrame(animation)
}

/**
 * Smooth scroll to an element
 * @param elementId - The ID of the target element
 * @param offset - Offset from the top (for fixed headers)
 * @param duration - Animation duration in milliseconds
 */
export function smoothScrollToElement(elementId: string, offset: number = 0, duration: number = 1000) {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.offsetTop - offset
    smoothScrollTo(elementPosition, duration)
  }
}

/**
 * Smooth scroll to top
 * @param duration - Animation duration in milliseconds
 */
export function smoothScrollToTop(duration: number = 1000) {
  smoothScrollTo(0, duration)
}
