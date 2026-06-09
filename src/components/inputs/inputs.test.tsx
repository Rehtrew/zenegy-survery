import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LogoGrid } from './LogoGrid'
import { TileSelect } from './TileSelect'
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

const tileOptions = [
  { value: 'price', label: 'Prisen er for høj', iconName: 'tag' },
  { value: 'slow', label: 'Langsomt', iconName: 'hourglass' },
  { value: 'other', label: 'Andet', iconName: 'pencil' },
]

describe('TileSelect', () => {
  it('renders all tiles', () => {
    render(<TileSelect options={tileOptions} value={[]} onChange={vi.fn()} />)
    expect(screen.getByText('Prisen er for høj')).toBeInTheDocument()
    expect(screen.getByText('Andet')).toBeInTheDocument()
  })

  it('toggles a tile on click (select)', async () => {
    const onChange = vi.fn()
    render(<TileSelect options={tileOptions} value={[]} onChange={onChange} />)
    await userEvent.click(screen.getByText('Prisen er for høj'))
    expect(onChange).toHaveBeenCalledWith(['price'])
  })

  it('toggles a tile on click (deselect)', async () => {
    const onChange = vi.fn()
    render(<TileSelect options={tileOptions} value={['price']} onChange={onChange} />)
    await userEvent.click(screen.getByText('Prisen er for høj'))
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('reveals the free-text input when the "other" trigger is selected', () => {
    render(
      <TileSelect options={tileOptions} value={['other']} onChange={vi.fn()}
        otherTrigger="other" otherPlaceholder="Hvad frustrerer dig?" />
    )
    expect(screen.getByPlaceholderText('Hvad frustrerer dig?')).toBeInTheDocument()
  })

  it('hides the free-text input when the "other" trigger is not selected', () => {
    render(
      <TileSelect options={tileOptions} value={['price']} onChange={vi.fn()}
        otherTrigger="other" otherPlaceholder="Hvad frustrerer dig?" />
    )
    expect(screen.queryByPlaceholderText('Hvad frustrerer dig?')).not.toBeInTheDocument()
  })

  it('calls onOtherChange when the free-text input changes', async () => {
    const onOtherChange = vi.fn()
    render(
      <TileSelect options={tileOptions} value={['other']} onChange={vi.fn()}
        otherTrigger="other" otherPlaceholder="Hvad frustrerer dig?" onOtherChange={onOtherChange} />
    )
    await userEvent.type(screen.getByPlaceholderText('Hvad frustrerer dig?'), 'noget')
    expect(onOtherChange).toHaveBeenCalled()
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
