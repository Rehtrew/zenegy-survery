import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ChoiceList } from './ChoiceList'

const options = [
  { value: 'a', label: 'Option A', emoji: '🅰️' },
  { value: 'b', label: 'Option B', emoji: '🅱️', subLabel: 'Sub B' },
]

describe('ChoiceList (single)', () => {
  it('renders all options', () => {
    render(<ChoiceList options={options} value="" onChange={vi.fn()} />)
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  it('renders subLabel when provided', () => {
    render(<ChoiceList options={options} value="" onChange={vi.fn()} />)
    expect(screen.getByText('Sub B')).toBeInTheDocument()
  })

  it('calls onChange with clicked value', async () => {
    const onChange = vi.fn()
    render(<ChoiceList options={options} value="" onChange={onChange} />)
    await userEvent.click(screen.getByText('Option A'))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('marks selected option with data-selected', () => {
    render(<ChoiceList options={options} value="b" onChange={vi.fn()} />)
    const selected = screen.getByText('Option B').closest('[data-selected]')
    expect(selected).toHaveAttribute('data-selected', 'true')
  })

  it('unselected option has data-selected=false', () => {
    render(<ChoiceList options={options} value="b" onChange={vi.fn()} />)
    const unselected = screen.getByText('Option A').closest('[data-selected]')
    expect(unselected).toHaveAttribute('data-selected', 'false')
  })
})

describe('ChoiceList (multi)', () => {
  it('adds value on click when not selected', async () => {
    const onChange = vi.fn()
    render(<ChoiceList options={options} value={['a']} onChange={onChange} multi />)
    await userEvent.click(screen.getByText('Option B'))
    expect(onChange).toHaveBeenCalledWith(['a', 'b'])
  })

  it('removes value on click when already selected', async () => {
    const onChange = vi.fn()
    render(<ChoiceList options={options} value={['a', 'b']} onChange={onChange} multi />)
    await userEvent.click(screen.getByText('Option A'))
    expect(onChange).toHaveBeenCalledWith(['b'])
  })
})
