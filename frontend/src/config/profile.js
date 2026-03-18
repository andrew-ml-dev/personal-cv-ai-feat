// ─────────────────────────────────────────────────────────────────────────────
// PERSONAL INFO
// Change these values to update the portfolio identity everywhere at once.
// ─────────────────────────────────────────────────────────────────────────────

export const FIRST_NAME = 'Andrzej'
export const LAST_NAME = 'Ludkiewicz'
export const FULL_NAME = `${FIRST_NAME} ${LAST_NAME}`

/** Two-letter initials shown in the sidebar avatar when no photo is provided. */
export const INITIALS = 'AL'

/** Job title shown under the name in the sidebar. */
export const JOB_TITLE = 'AI Engineer'

/**
 * Avatar photo URL.
 * Set to a full URL or a path inside /public (e.g. '/avatar.jpg').
 * Set to null to fall back to the initials block.
 */
export const AVATAR_IMAGE_URL = 'https://media.licdn.com/dms/image/v2/C4D03AQFPh5lTJrlp1Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1608738255554?e=1775692800&v=beta&t=t6bzlJV5fmmaSPsivqjk_AqdW-L5fbvM9CFrtx3aFZk'

// ─────────────────────────────────────────────────────────────────────────────
// AVAILABILITY BADGE  (shown in sidebar)
// ─────────────────────────────────────────────────────────────────────────────

export const AVAILABILITY = {
  show: true,
  label: 'Open to work',
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS ROW  (three quick numbers in the sidebar profile card)
// ─────────────────────────────────────────────────────────────────────────────

export const STATS = [
  { label: 'YOE',  value: '7+' },
  { label: 'FPS',  value: '83' },
  { label: 'mAP',  value: '94%' },
]

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER LINKS  (bottom of sidebar)
// ─────────────────────────────────────────────────────────────────────────────

export const LOCATION = 'Kraków, PL'
export const GITHUB_USERNAME = 'andrew-ml-dev'

/** Small caption in the sidebar footer. */
export const FOOTER_TAGLINE = 'Powered by FastAPI · Edge AI'

// ─────────────────────────────────────────────────────────────────────────────
// TOP BAR METRICS  (header live-status strip)
// ─────────────────────────────────────────────────────────────────────────────

export const TOPBAR = {
  liveLabel: 'Live on Raspberry Pi 5 Edge'
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT TEXT  (shown when the user clicks "About Me")
// ─────────────────────────────────────────────────────────────────────────────

export const ABOUT_TEXT =
  `👋 **Hi! I'm ${FULL_NAME}** — a Computer Vision & Machine Learning Engineer with a "Vibe Coding" mindset.\n\n` +
  
  `🚀 **Core Expertise**\n` +
  `I specialize in building end-to-end AI systems, moving from early experiments with **TensorFlow** facial recognition to architecting SOTA production pipelines. My work bridges the gap between complex research and real-world deployment on **Edge (Android/iOS)** and **Cloud (K8s)**.\n\n` +

  `🐟 **Evolution of Fish Recognition (My "Magnum Opus")**\n` +
  `I've led the evolution of a massive segmentation & classification system: starting from **MaskRCNN**, then moving to a triple-**YOLO** pipeline, and finally reaching a sophisticated architecture based on **DinoV2 + Subcenter + Multi-similarity Loss + ArcFace**. This journey involved fine-tuning for extreme accuracy and handling massive datasets with **CVAT**, **FiftyOne**, and **MLFlow**.\n\n` +

  `🏟️ **Real-Time Sports & Industrial AI**\n` +
  `• **Sports:** Developed real-time football player detection and jersey number recognition using **YOLO** and **OpenCV (MIL/CSRT)** tracking.\n` +
  `• **Mobile:** Deployed on-device models for **Android (Kotlin/TFLite/NNAPI)** and **iOS (Swift/CoreML)**.\n` +
  `• **Industrial:** Built vision systems to detect procedural errors on factory floors via live camera streams.\n` +
  `• **Audio/OCR:** Integrated **Whisper/NeMo ASR** for voice and **Tesseract** for document digitalization.\n\n` +

  `🛠️ **Infrastructure & Tools**\n` +
  `I don’t just train models; I ship them. I'm proficient in **PyTorch Lightning**, **Linux** infra, **Docker/Docker Compose**, and scaling on **Azure Kubernetes Service**. My daily driver is **Cursor (Antigravity)**, and I'm a firm believer in the efficiency of the modern AI-assisted workflow.`;

  // ─────────────────────────────────────────────────────────────────────────────
// WELCOME MESSAGE  (first bot message when the app loads)
// ─────────────────────────────────────────────────────────────────────────────

export const WELCOME_TEXT =
  `Hello! I'm **${FULL_NAME}'s** AI portfolio assistant. ` +
  `I can tell you about his experience, skills, projects, and more.\n\n` +
  `Click any section in the **sidebar**, or ask me anything directly in the chat below.`
