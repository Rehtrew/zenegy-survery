import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const fetchMock = vi.fn()
/** Neither box ticked — the common case. */
const NONE = { newsletter: false, futureSurveys: false }
const ok = () => ({ ok: true, status: 200, json: async () => ({}) }) as Response

/** The module reads its config at import time, so each test imports it fresh. */
async function load(env: Record<string, string> = {}) {
  vi.resetModules()
  vi.stubEnv('VITE_HUBSPOT_PORTAL_ID', env.portal ?? '1234567')
  vi.stubEnv('VITE_HUBSPOT_FORM_GUID', env.form ?? 'abcd-efgh')
  vi.stubEnv('VITE_HUBSPOT_NEWSLETTER_FIELD', env.newsletter ?? '')
  vi.stubEnv('VITE_HUBSPOT_SURVEYS_FIELD', env.surveys ?? '')
  return import('./hubspot')
}

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  document.cookie = 'hubspotutk=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
})

describe('signupForReport', () => {
  it('posts the email to the portal and form it is configured with', async () => {
    const { signupForReport } = await load()
    fetchMock.mockResolvedValueOnce(ok())

    await signupForReport('kollega@zenegy.com', { newsletter: false, futureSurveys: false })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.hsforms.com/submissions/v3/integration/submit/1234567/abcd-efgh')
    expect(JSON.parse(init.body).fields).toEqual([{ name: 'email', value: 'kollega@zenegy.com' }])
  })

  it('leaves both opt-ins out unless the form has fields for them', async () => {
    const { buildPayload } = await load()
    expect(buildPayload('a@b.dk', { newsletter: true, futureSurveys: true }).fields).toHaveLength(1)
  })

  it('sends the newsletter choice when the field name is configured', async () => {
    const { buildPayload } = await load({ newsletter: 'nyhedsbrev_tilmeldt' })
    expect(buildPayload('a@b.dk', { newsletter: true, futureSurveys: false }).fields)
      .toContainEqual({ name: 'nyhedsbrev_tilmeldt', value: 'true' })
    expect(buildPayload('a@b.dk', { newsletter: false, futureSurveys: false }).fields)
      .toContainEqual({ name: 'nyhedsbrev_tilmeldt', value: 'false' })
  })

  it('sends the future-surveys choice on its own field', async () => {
    const { buildPayload } = await load({ surveys: 'fremtidige_undersoegelser' })
    expect(buildPayload('a@b.dk', { newsletter: false, futureSurveys: true }).fields)
      .toContainEqual({ name: 'fremtidige_undersoegelser', value: 'true' })
  })

  it('keeps the two opt-ins independent of each other', async () => {
    const { buildPayload } = await load({ newsletter: 'nyhedsbrev', surveys: 'undersoegelser' })
    const fields = buildPayload('a@b.dk', { newsletter: false, futureSurveys: true }).fields
    expect(fields).toContainEqual({ name: 'nyhedsbrev', value: 'false' })
    expect(fields).toContainEqual({ name: 'undersoegelser', value: 'true' })
  })

  it('passes the HubSpot tracking cookie along when the visitor has one', async () => {
    document.cookie = 'hubspotutk=tracking-id-123'
    const { buildPayload } = await load()
    expect(buildPayload('a@b.dk', NONE).context).toMatchObject({ hutk: 'tracking-id-123' })
  })

  it('omits hutk entirely when there is no cookie', async () => {
    const { buildPayload } = await load()
    expect(buildPayload('a@b.dk', NONE).context).not.toHaveProperty('hutk')
  })

  it('refuses to send when HubSpot is not configured', async () => {
    const { signupForReport } = await load({ portal: '', form: '' })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    await expect(signupForReport('a@b.dk', NONE)).rejects.toThrow('ikke sat op')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows plain Danish when HubSpot rejects the submission', async () => {
    const { signupForReport } = await load()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fetchMock.mockResolvedValueOnce({
      ok: false, status: 400,
      json: async () => ({ message: 'Field "nyhedsbrev" does not exist', errors: [] }),
    } as Response)
    await expect(signupForReport('a@b.dk', NONE)).rejects.toThrow('Noget gik galt')
  })

  it('reports a connection failure', async () => {
    const { signupForReport } = await load()
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(signupForReport('a@b.dk', NONE)).rejects.toThrow('Kunne ikke få forbindelse')
  })
})
