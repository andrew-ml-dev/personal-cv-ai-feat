// ─────────────────────────────────────────────────────────────────────────────
// CONTACT SECTION
// icon values: 'mail' | 'linkedin' | 'github' | 'twitter' | 'mapPin' | 'globe'
// href: full URL string, or null for non-clickable info rows
// ─────────────────────────────────────────────────────────────────────────────

import { envString } from './env'

const DEFAULT_INTRO =
  "I'm always excited to connect about **edge AI**, **computer vision**, or any challenging ML problems. " +
  'Feel free to reach out — I typically respond within 24 hours.'

export const CONTACT_INTRO = (() => {
  const fromEnv = envString('VITE_CONTACT_INTRO')
  if (!fromEnv) return DEFAULT_INTRO
  return fromEnv.replace(/\\n/g, '\n')
})()

const email = envString('VITE_CONTACT_EMAIL', 'andrew.ludkiewicz@gmail.com')
const linkedinHref = envString('VITE_CONTACT_LINKEDIN_URL', 'https://linkedin.com/in/aludkiewicz')
const githubHref = envString('VITE_CONTACT_GITHUB_URL', 'https://github.com/andrew-ml-dev')
const mapLabel = envString('VITE_CONTACT_LOCATION_LABEL', 'Kraków, PL · Remote OK')

export const CONTACT_LINKS = [
  {
    label: envString('VITE_CONTACT_EMAIL_LABEL', email),
    icon: 'mail',
    href: `mailto:${email}`,
  },
  {
    label: envString('VITE_CONTACT_LINKEDIN_LABEL', '/in/aludkiewicz'),
    icon: 'linkedin',
    href: linkedinHref,
  },
  {
    label: envString('VITE_CONTACT_GITHUB_LABEL', 'github.com/andrew-ml-dev'),
    icon: 'github',
    href: githubHref,
  },
  {
    label: mapLabel,
    icon: 'mapPin',
    href: envString('VITE_CONTACT_LOCATION_HREF') || null,
  },
]
