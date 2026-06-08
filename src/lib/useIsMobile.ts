import { useState, useEffect } from 'react'

/**
 * True when the viewport is narrower than `breakpoint` (default 880px).
 * Used to switch the survey shell from the desktop sidebar layout to a
 * compact top-bar layout on phones and small tablets.
 */
export function useIsMobile(breakpoint = 880): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return isMobile
}
