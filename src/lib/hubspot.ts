/**
 * The optional "send me the report" email goes to HubSpot, not to our own
 * database — it belongs with the rest of marketing's contacts, and it keeps the
 * survey's own storage answers-only.
 *
 * Uses HubSpot's public form submission endpoint. Portal id and form guid are
 * not secrets (they sit in every embedded HubSpot form on the web), so this runs
 * straight from the browser with no token and no proxy.
 *
 * HubSpot rejects submissions containing fields that don't exist on the form, so
 * the newsletter checkbox is only sent when its field name is configured.
 */

const PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID ?? ''
const FORM_GUID = import.meta.env.VITE_HUBSPOT_FORM_GUID ?? ''
/** Internal name of the newsletter property on the HubSpot form, if it has one. */
const NEWSLETTER_FIELD = import.meta.env.VITE_HUBSPOT_NEWSLETTER_FIELD ?? ''

/** The tracking cookie HubSpot sets, so a submission joins up with the visit. */
function hubspotCookie(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/)
  return match?.[1]
}

interface HubSpotField { name: string; value: string }

export function buildPayload(email: string, newsletterOptIn: boolean) {
  const fields: HubSpotField[] = [{ name: 'email', value: email }]
  if (NEWSLETTER_FIELD) {
    fields.push({ name: NEWSLETTER_FIELD, value: String(newsletterOptIn) })
  }
  const hutk = hubspotCookie()
  return {
    fields,
    context: {
      ...(hutk ? { hutk } : {}),
      pageUri: window.location.href,
      pageName: document.title,
    },
  }
}

/**
 * Send the email to HubSpot. Answers are already saved at this point, so a
 * failure here only costs the report opt-in — the caller shows a retry.
 */
export async function signupForReport(email: string, newsletterOptIn: boolean): Promise<void> {
  if (!PORTAL_ID || !FORM_GUID) {
    console.error('HubSpot is not configured: set VITE_HUBSPOT_PORTAL_ID and VITE_HUBSPOT_FORM_GUID at build time.')
    throw new Error('Tilmelding er ikke sat op endnu. Prøv igen senere.')
  }

  let response: Response
  try {
    response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(email, newsletterOptIn)),
      },
    )
  } catch {
    throw new Error('Kunne ikke få forbindelse. Tjek din internetforbindelse.')
  }
  if (response.ok) return

  // HubSpot answers 400 with { status, message, errors: [{ message }] }. Those
  // messages are for us, not for the respondent — log them, show plain Danish.
  try {
    const problem = await response.json() as { message?: string; errors?: { message?: string }[] }
    console.error('HubSpot rejected the signup:', problem.message ?? response.status, problem.errors ?? '')
  } catch {
    console.error('HubSpot rejected the signup:', response.status)
  }
  throw new Error('Noget gik galt. Prøv igen.')
}
