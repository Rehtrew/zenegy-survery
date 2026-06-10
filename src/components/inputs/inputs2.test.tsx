import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { useState as useReactState } from 'react'
import { PriorityRank } from './PriorityRank'
import { NPSScale } from './NPSScale'
import { OpenText } from './OpenText'
import type { RankEntry } from '../../types'

function ControlledOpenText({ onChange }: { onChange: (v: string) => void }) {
  const [val, setReactState] = useReactState('')
  return (
    <OpenText
      value={val}
      onChange={v => { setReactState(v); onChange(v) }}
      placeholder="Type here"
      maxLength={200}
    />
  )
}

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
  it('renders boundary labels', () => {
    render(<NPSScale value={null} onChange={vi.fn()} />)
    expect(screen.getByText(/Slet ikke/)).toBeInTheDocument()
    expect(screen.getByText(/Helt sikkert/)).toBeInTheDocument()
  })

  it('shows placeholder text when no value is selected', () => {
    render(<NPSScale value={null} onChange={vi.fn()} />)
    expect(screen.getByText(/Træk skyderen/)).toBeInTheDocument()
  })

  it('shows the selected value in the big readout', () => {
    render(<NPSScale value={7} onChange={vi.fn()} />)
    expect(screen.getByTestId('nps-readout')).toHaveTextContent('7')
  })

  it('hides placeholder once a value is given', () => {
    render(<NPSScale value={7} onChange={vi.fn()} />)
    expect(screen.queryByText(/Træk skyderen/)).not.toBeInTheDocument()
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
    render(<ControlledOpenText onChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('Type here'), 'hello')
    expect(onChange).toHaveBeenLastCalledWith('hello')
  })

  it('shows character count', () => {
    render(<OpenText value="hi" onChange={vi.fn()} maxLength={200} />)
    expect(screen.getByText('2 / 200')).toBeInTheDocument()
  })
})
