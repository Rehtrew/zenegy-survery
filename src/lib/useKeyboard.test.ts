import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useKeyboard } from './useKeyboard'

function setup(overrides: Partial<Parameters<typeof useKeyboard>[0]> = {}) {
  const handlers = {
    onAdvance: vi.fn(),
    onBack: vi.fn(),
    onSelectIndex: vi.fn(),
    enabled: true,
    ...overrides,
  }
  renderHook(() => useKeyboard(handlers))
  return handlers
}

describe('useKeyboard', () => {
  it('calls onAdvance on Enter', async () => {
    const { onAdvance } = setup()
    await userEvent.keyboard('{Enter}')
    expect(onAdvance).toHaveBeenCalledOnce()
  })

  it('calls onAdvance on Space', async () => {
    const { onAdvance } = setup()
    await userEvent.keyboard(' ')
    expect(onAdvance).toHaveBeenCalledOnce()
  })

  it('calls onBack on ArrowLeft', async () => {
    const { onBack } = setup()
    await userEvent.keyboard('{ArrowLeft}')
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('calls onBack on Backspace', async () => {
    const { onBack } = setup()
    await userEvent.keyboard('{Backspace}')
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('calls onSelectIndex(2) on key "3"', async () => {
    const { onSelectIndex } = setup()
    await userEvent.keyboard('3')
    expect(onSelectIndex).toHaveBeenCalledWith(2)
  })

  it('calls onSelectIndex(0) on key "1"', async () => {
    const { onSelectIndex } = setup()
    await userEvent.keyboard('1')
    expect(onSelectIndex).toHaveBeenCalledWith(0)
  })

  it('does nothing when enabled is false', async () => {
    const { onAdvance, onBack, onSelectIndex } = setup({ enabled: false })
    await userEvent.keyboard('{Enter}')
    await userEvent.keyboard('{ArrowLeft}')
    await userEvent.keyboard('1')
    expect(onAdvance).not.toHaveBeenCalled()
    expect(onBack).not.toHaveBeenCalled()
    expect(onSelectIndex).not.toHaveBeenCalled()
  })
})
