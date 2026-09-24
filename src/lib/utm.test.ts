import { describe, it, expect } from 'vitest'
import { readUtmTags } from './utm'

describe('readUtmTags', () => {
  it('reads the three campaign tags off the link', () => {
    expect(readUtmTags('?utm_source=linkedin&utm_medium=social&utm_campaign=lonmarked2026'))
      .toEqual({ utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'lonmarked2026' })
  })

  it('returns nothing for a plain visit', () => {
    expect(readUtmTags('')).toEqual({})
  })

  it('keeps whatever is present and ignores the rest', () => {
    expect(readUtmTags('?utm_source=nyhedsbrev&ref=noget')).toEqual({ utm_source: 'nyhedsbrev' })
  })

  it('lowercases and trims, so Linkedin and linkedin count as one', () => {
    expect(readUtmTags('?utm_source=LinkedIn').utm_source).toBe('linkedin')
  })

  it('drops values that are not plain campaign labels', () => {
    expect(readUtmTags('?utm_source=<script>').utm_source).toBeUndefined()
    expect(readUtmTags('?utm_source=hej verden').utm_source).toBeUndefined()
  })

  it('caps a very long value rather than storing it', () => {
    expect(readUtmTags(`?utm_source=${'a'.repeat(200)}`).utm_source).toHaveLength(60)
  })
})
