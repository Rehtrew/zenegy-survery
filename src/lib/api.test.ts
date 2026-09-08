import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Submission } from '../types'
import { submitSurvey } from './api'

const submission: Submission = {
  track: 'bureau',
  c_client_count: '21-50',
  c_payroll_systems: ['dataloen', 'zenegy'],
  email: '',
  newsletter_opt_in: false,
}

const fetchMock = vi.fn()
const ok = () => ({ ok: true, status: 201, json: async () => ({ ok: true }) }) as Response
const fail = (status: number, body: unknown) => ({ ok: false, status, json: async () => body }) as Response

function servedFrom(pathname: string) {
  window.history.replaceState({}, '', pathname)
}

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => {
  vi.unstubAllGlobals()
  servedFrom('/')
})

describe('endpoint resolution', () => {
  it('posts next to the page when served from a folder', async () => {
    servedFrom('/undersogelse/')
    fetchMock.mockResolvedValueOnce(ok())
    await submitSurvey(submission)
    expect(fetchMock.mock.calls[0][0]).toBe('/undersogelse/api/submit.php')
  })

  it('resolves from the folder even without a trailing slash', async () => {
    servedFrom('/undersogelse/index.html')
    fetchMock.mockResolvedValueOnce(ok())
    await submitSurvey(submission)
    expect(fetchMock.mock.calls[0][0]).toBe('/undersogelse/api/submit.php')
  })

  it('works at the site root', async () => {
    servedFrom('/')
    fetchMock.mockResolvedValueOnce(ok())
    await submitSurvey(submission)
    expect(fetchMock.mock.calls[0][0]).toBe('/api/submit.php')
  })
})

describe('submitSurvey', () => {
  it('sends the answers as JSON', async () => {
    fetchMock.mockResolvedValueOnce(ok())
    await expect(submitSurvey(submission)).resolves.toBeUndefined()
    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toMatchObject({ track: 'bureau', c_client_count: '21-50' })
  })

  it('surfaces the error the endpoint returns', async () => {
    fetchMock.mockResolvedValueOnce(fail(400, { error: 'track skal være en af: zenegy, non-zenegy, employee, bureau' }))
    await expect(submitSurvey(submission)).rejects.toThrow('track skal være en af')
  })

  it('falls back to the status code when the body is not JSON', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 502, json: async () => { throw new Error('no') } } as unknown as Response)
    await expect(submitSurvey(submission)).rejects.toThrow('502')
  })

  it('reports a connection failure in plain Danish', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(submitSurvey(submission)).rejects.toThrow('Kunne ikke få forbindelse')
  })
})
