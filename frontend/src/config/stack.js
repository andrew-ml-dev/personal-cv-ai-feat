// ─────────────────────────────────────────────────────────────────────────────
// TECH STACK
// Each key is a category label; the value is the list of skill tags.
// Override the entire object with valid JSON in VITE_TECH_STACK_JSON (optional).
// ─────────────────────────────────────────────────────────────────────────────

import { envString } from './env'

const DEFAULT_TECH_STACK = {
  'ML & Vision': [
    'PyTorch Lightning',
    'TensorFlow',
    'YOLO (v3-v8)',
    'DinoV2',
    'ResNet / EfficientNet / ConvNeXt / BEiT',
    'MaskRCNN / FPN',
    'ArcFace / MultiSimilarity Loss',
    'OpenCV (MIL/CSRT Tracking)',
    'Whisper / NeMo ASR',
    'Tesseract OCR',
  ],
  'Edge & Mobile': [
    'TensorFlow Lite',
    'Android NNAPI',
    'Kotlin (Android Studio)',
    'Swift (Xcode)',
    'CoreML',
  ],
  'MLOps & Data': [
    'Docker & Docker Compose',
    'Azure Kubernetes (AKS)',
    'MLFlow',
    'Nuclio',
    'CVAT',
    'FiftyOne',
    'Hugging Face',
    'Prometheus',
  ],
  'Backend & Infra': [
    'FastAPI',
    'Linux / Bash',
    'Git',
    'OpenAI API',
  ],
  'Tools & AI Workflow': ['Cursor IDE', 'Vibecoding', 'AI-Assisted Development'],
}

function loadTechStack() {
  const raw = envString('VITE_TECH_STACK_JSON')
  if (!raw) return DEFAULT_TECH_STACK
  try {
    const o = JSON.parse(raw)
    if (o && typeof o === 'object' && !Array.isArray(o)) return o
  } catch {
    console.warn('VITE_TECH_STACK_JSON: invalid JSON, using built-in tech stack.')
  }
  return DEFAULT_TECH_STACK
}

export const TECH_STACK = loadTechStack()
