import { useEffect } from 'react'

interface UseKeyboardOptions {
  onAdvance: () => void
  onBack: () => void
  onSelectIndex: (index: number) => void
  enabled?: boolean
}

export function useKeyboard({
  onAdvance,
  onBack,
  onSelectIndex,
  enabled = true,
}: UseKeyboardOptions): void {
  useEffect(() => {
    if (!enabled) return

    const handler = (e: KeyboardEvent) => {
      // Don't capture when user is typing in an input, textarea, or contenteditable
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) return

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onAdvance()
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault()
        onBack()
      } else if (/^[1-9]$/.test(e.key)) {
        onSelectIndex(parseInt(e.key, 10) - 1)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onAdvance, onBack, onSelectIndex, enabled])
}
