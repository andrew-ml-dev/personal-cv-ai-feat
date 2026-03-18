// ─────────────────────────────────────────────────────────────────────────────
// This file is kept for backward compatibility only.
// All content is now defined in  src/config/
// ─────────────────────────────────────────────────────────────────────────────

import { ABOUT_TEXT, WELCOME_TEXT } from '../config/profile'
import { EXPERIENCE } from '../config/experience'
import { TECH_STACK } from '../config/stack'
import { PROJECTS } from '../config/projects'
import { CONTACT_INTRO, CONTACT_LINKS } from '../config/contact'
export { NAV_ITEMS } from '../config/nav'

export const ABOUT_PAYLOAD   = { text: ABOUT_TEXT, isStreaming: false }
export const STACK_PAYLOAD   = TECH_STACK
export const EXPERIENCE_PAYLOAD = EXPERIENCE
export const PROJECTS_PAYLOAD   = PROJECTS
export const CONTACT_PAYLOAD    = { text: CONTACT_INTRO, links: CONTACT_LINKS }

export const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  type: 'TextBubble',
  payload: { text: WELCOME_TEXT, isStreaming: false },
}
