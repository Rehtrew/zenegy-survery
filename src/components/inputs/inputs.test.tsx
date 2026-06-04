import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LogoGrid } from './LogoGrid'
import { PillSelect } from './PillSelect'
import { EmojiRating } from './EmojiRating'

const logoOptions = [
  { value: 'a', label: 'SystemA', logoInitials: 'SA', logoStyle: { background: '#333' } },
  { value: 'andet', label: 'Andet', logoInitials: '?', logoStyle: { background: '#999' } },
]

describe('LogoGrid', () => {
  it('renders logo cards', () => {
    render(<LogoGrid options={logoOptions} value="" onChange={vi.fn()} />)
    expect(screen.getByText('SystemA')).toBeInTheDocument()
    expect(screen.getByText('Andet')).toBeInTheDocument()
  })

  it('calls onChange on card click', async () => {
    const onChange = vi.fn()
    render(<LogoGrid options={logoOptions} value="" onChange={onChange} />)
    await userEvent.click(screen.getByText('SystemA'))
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('shows text input when "andet" is selected', () => {
    render(<LogoGrid options={logoOptions} value="andet" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Hvilket system bruger du?')).toBeInTheDocument()
  })

  it('hides text input when "andet" not selected', () => {
    render(<LogoGrid options={logoOptions} value="a" onChange={vi.fn()} />)
    expect(screen.queryByPlaceholderText('Hvilket system bruger du?')).not.toBeInTheDocument()
  })

  it('calls onOtherChange when text input changes', async () => {
    const onOtherChange = vi.fn()
    render(
      <LogoGrid options={logoOptions} value="andet" onChange={vi.fn()} onOtherChange={onOtherChange} />
    )
    await userEvent.type(screen.getByPlaceholderText('Hvilket system bruger du?'), 'My system')
    expect(onOtherChange).toHaveBeenCalled()
  })
})

const pillOptions = [
  { value: 'price', label: '💸 Prisen er for høj' },
  { value: 'slow', label: '🐢 Langsomt' },
]

describe('PillSelect', () => {
  it('renders all pills', () => {
    render(<PillSelect options={pillOptions} value={[]} onChange={vi.fn()} />)
    expect(screen.getByText('💸 Prisen er for høj')).toBeInTheDocument()
  })

  it('toggles pill on click (select)', async () => {
    const onChange = vi.fn()
    render(<PillSelect options={pillOptions} value={[]} onChange={onChange} />)
    await userEvent.click(screen.getByText('💸 Prisen er for høj'))
    expect(onChange).toHaveBeenCalledWith(['price'])
  })

  it('toggles pill on click (deselect)', async () => {
    const onChange = vi.fn()
    render(<PillSelect options={pillOptions} value={['price']} onChange={onChange} />)
    await userEvent.click(screen.getByText('💸 Prisen er for høj'))
    expect(onChange).toHaveBeenCalledWith([])
  })
})

const emojiOptions = [
  { value: 'unhappy', label: 'Ikke tilfreds' },
  { value: 'happy', label: 'Tilfreds' },
]

describe('EmojiRating', () => {
  it('renders label options', () => {
    render(<EmojiRating options={emojiOptions} value="" onChange={vi.fn()} />)
    expect(screen.getByText('Ikke tilfreds')).toBeInTheDocument()
    expect(screen.getByText('Tilfreds')).toBeInTheDocument()
  })

  it('calls onChange with value on click', async () => {
    const onChange = vi.fn()
    render(<EmojiRating options={emojiOptions} value="" onChange={onChange} />)
    await userEvent.click(screen.getByText('Tilfreds'))
    expect(onChange).toHaveBeenCalledWith('happy')
  })

  it('marks selected option', () => {
    render(<EmojiRating options={emojiOptions} value="happy" onChange={vi.fn()} />)
    const selected = screen.getByText('Tilfreds').closest('[data-selected]')
    expect(selected).toHaveAttribute('data-selected', 'true')
  })
})
