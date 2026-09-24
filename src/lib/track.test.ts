import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { trackEvent } from './track'

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  fetchMock.mockResolvedValue({ ok: true })
  vi.stubGlobal('fetch', fetchMock)
  window.history.replaceState({}, '', '/markeds-undersoegelse/')
})
afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

describe('trackEvent', () => {
  it('posts the event next to the survey', () => {
    trackEvent('view')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/markeds-undersoegelse/api.php?event=1')
    expect(JSON.parse(init.body)).toEqual({ event: 'view' })
  })

  it('carries the campaign tags along', () => {
    window.history.replaceState({}, '', '/markeds-undersoegelse/?utm_source=linkedin&utm_medium=social')
    trackEvent('start')
    expect(JSON.parse(fetchMock.mock.calls[0][1].body))
      .toEqual({ event: 'start', utm_source: 'linkedin', utm_medium: 'social' })
  })

  it('never throws at the caller when the request fails', () => {
    fetchMock.mockRejectedValueOnce(new TypeError('offline'))
    expect(() => trackEvent('view')).not.toThrow()
  })

  it('survives a browser with no fetch at all', () => {
    vi.stubGlobal('fetch', undefined)
    expect(() => trackEvent('view')).not.toThrow()
  })
})
