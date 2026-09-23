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
 * each checkbox is only sent when its field name is configured.
 */

const PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID ?? ''
const FORM_GUID = import.meta.env.VITE_HUBSPOT_FORM_GUID ?? ''
/**
 * The newsletter is a HubSpot *subscription*, not a form field. Ticking the box
 * has to be sent as consent (legalConsentOptions) against this subscription
 * type id, or nothing is recorded.
 */
const NEWSLETTER_SUBSCRIPTION_ID = import.meta.env.VITE_HUBSPOT_NEWSLETTER_SUBSCRIPTION_ID ?? ''

/** Internal name of the newsletter property, for forms that use a plain checkbox instead. */
const NEWSLETTER_FIELD = import.meta.env.VITE_HUBSPOT_NEWSLETTER_FIELD ?? ''
/** Internal name of the "tell me about future surveys" property, if the form has one. */
const SURVEYS_FIELD = import.meta.env.VITE_HUBSPOT_SURVEYS_FIELD ?? ''

/**
 * Whether each checkbox has somewhere to go. HubSpot accepts a submission
 * carrying a field its form doesn't have and silently drops that field, so an
 * unconfigured checkbox would look like it worked and record nothing. Better to
 * not offer the choice until the form can keep it.
 */
export const NEWSLETTER_ENABLED = NEWSLETTER_FIELD !== '' || NEWSLETTER_SUBSCRIPTION_ID !== ''
export const SURVEYS_ENABLED = SURVEYS_FIELD !== ''

/** The tracking cookie HubSpot sets, so a submission joins up with the visit. */
function hubspotCookie(): string | undefined {
  const match = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]+)/)
  return match?.[1]
}

interface HubSpotField { name: string; value: string }

/** What the respondent ticked. Both are optional and independent of each other. */
export interface SignupOptIns {
  /** Zenegy's newsletter: tips and product updates. */
  newsletter: boolean
  /** A heads-up when we run the next survey. */
  futureSurveys: boolean
}

/**
 * The wording stored alongside the consent. HubSpot keeps it as the record of
 * what the person actually agreed to, so it has to match the screen they saw.
 */
export const CONSENT_TEXT =
  'Jeg giver Zenegy lov til at gemme min email og sende mig Lønmarkedsrapporten 2026.'
export const NEWSLETTER_TEXT =
  'Ja tak, send mig også Zenegys nyhedsbrev med tips og produktopdateringer.'

export function buildPayload(email: string, optIns: SignupOptIns) {
  const fields: HubSpotField[] = [{ name: 'email', value: email }]
  if (NEWSLETTER_FIELD) {
    fields.push({ name: NEWSLETTER_FIELD, value: String(optIns.newsletter) })
  }
  if (SURVEYS_FIELD) {
    fields.push({ name: SURVEYS_FIELD, value: String(optIns.futureSurveys) })
  }
  const hutk = hubspotCookie()
  return {
    fields,
    context: {
      ...(hutk ? { hutk } : {}),
      pageUri: window.location.href,
      pageName: document.title,
    },
    // Asking for the report is the consent to be emailed it. The newsletter is a
    // separate yes or no, carried on its own subscription type.
    ...(NEWSLETTER_SUBSCRIPTION_ID
      ? {
          legalConsentOptions: {
            consent: {
              consentToProcess: true,
              text: CONSENT_TEXT,
              communications: [{
                value: optIns.newsletter,
                subscriptionTypeId: Number(NEWSLETTER_SUBSCRIPTION_ID),
                text: NEWSLETTER_TEXT,
              }],
            },
          },
        }
      : {}),
  }
}

/**
 * Send the email to HubSpot. Answers are already saved at this point, so a
 * failure here only costs the report opt-in — the caller shows a retry.
 */
export async function signupForReport(email: string, optIns: SignupOptIns): Promise<void> {
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
        body: JSON.stringify(buildPayload(email, optIns)),
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
