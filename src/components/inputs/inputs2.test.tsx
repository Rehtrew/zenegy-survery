import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { PriorityRank } from './PriorityRank'
import { NPSScale } from './NPSScale'
import { OpenText } from './OpenText'
import type { RankEntry } from '../../types'

const rankOptions = [
  { value: 'price', label: '💰 Pris' },
  { value: 'ux', label: '✨ UX' },
  { value: 'support', label: '🆘 Support' },
  { value: 'integrations', label: '🔗 Integrationer' },
]

describe('PriorityRank', () => {
  it('renders all options', () => {
    render(<PriorityRank options={rankOptions} value={[]} onChange={vi.fn()} maxRank={3} />)
    expect(screen.getByText('💰 Pris')).toBeInTheDocument()
    expect(screen.getByText('✨ UX')).toBeInTheDocument()
  })

  it('assigns rank 1 on first click', async () => {
    const onChange = vi.fn()
    render(<PriorityRank options={rankOptions} value={[]} onChange={onChange} maxRank={3} />)
    await userEvent.click(screen.getByText('💰 Pris'))
    expect(onChange).toHaveBeenCalledWith([{ rank: 1, value: 'price' }])
  })

  it('deselects on second click and re-ranks remaining', async () => {
    const onChange = vi.fn()
    const initial: RankEntry[] = [{ rank: 1, value: 'price' }, { rank: 2, value: 'ux' }]
    render(<PriorityRank options={rankOptions} value={initial} onChange={onChange} maxRank={3} />)
    await userEvent.click(screen.getByText('💰 Pris'))
    // After removing rank-1, 'ux' should become rank 1
    expect(onChange).toHaveBeenCalledWith([{ rank: 1, value: 'ux' }])
  })

  it('does not add more than maxRank selections', async () => {
    const onChange = vi.fn()
    const full: RankEntry[] = [
      { rank: 1, value: 'price' },
      { rank: 2, value: 'ux' },
      { rank: 3, value: 'support' },
    ]
    render(<PriorityRank options={rankOptions} value={full} onChange={onChange} maxRank={3} />)
    await userEvent.click(screen.getByText('🔗 Integrationer'))
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('NPSScale', () => {
  it('renders 11 buttons (0–10)', () => {
    render(<NPSScale value={null} onChange={vi.fn()} />)
    expect(screen.getAllByRole('button')).toHaveLength(11)
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('calls onChange with numeric value on click', async () => {
    const onChange = vi.fn()
    render(<NPSScale value={null} onChange={onChange} />)
    await userEvent.click(screen.getByText('7'))
    expect(onChange).toHaveBeenCalledWith(7)
  })

  it('marks selected value visually', () => {
    render(<NPSScale value={7} onChange={vi.fn()} />)
    const btn = screen.getByText('7')
    expect(btn).toHaveClass('bg-primary')
  })
})

describe('OpenText', () => {
  it('renders textarea with placeholder', () => {
    render(<OpenText value="" onChange={vi.fn()} placeholder="Type here" maxLength={200} label="Notes" />)
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
  })

  it('calls onChange on input', async () => {
    const onChange = vi.fn()
    render(<OpenText value="" onChange={onChange} placeholder="Type here" maxLength={200} />)
    await userEvent.type(screen.getByPlaceholderText('Type here'), 'hello')
    expect(onChange).toHaveBeenLastCalledWith('hello')
  })

  it('shows character count', () => {
    render(<OpenText value="hi" onChange={vi.fn()} maxLength={200} />)
    expect(screen.getByText('2 / 200')).toBeInTheDocument()
  })
})
