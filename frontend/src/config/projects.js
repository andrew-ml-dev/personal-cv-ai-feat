// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// Fields:
//   title        — project name
//   model        — model / architecture name
//   metrics      — one-line performance summary (shown in monospace block)
//   description  — short paragraph
//   tags         — array of tag strings
//   featured     — true = first card, shows the live CV bounding-box demo
//   image        — URL or /public path for a real screenshot/thumbnail.
//                  Set to null to use the animated CV demo placeholder instead.
//   demoUrl      — link to a live demo (null if none)
//   repoUrl      — link to the GitHub repo (null if private/none)
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECTS = [
  {
    title: 'Fish Detection, Segmentation & Classification',
    featured: true,
    model: 'DinoV2 + ArcFace + MultiSimilarity Loss',

    description:
      'Advanced fish recognition pipeline with metric learning and large-scale classification. Transitioned from classical detection to embedding-based retrieval system.',

    metrics: 'Top-1: 91% · Top-5: 98% · 100k images · 700+ classes',

    pipeline:
      'YOLO → Crop → Embeddings → FAISS → Classification',

    evolution: [
      'MaskRCNN',
      'YOLO x3',
      'ConvNeXt',
      'DinoV2',
    ],

    problem:
      'Noisy labels, high intra-class similarity, large class count',

    solution:
      'Metric learning (ArcFace, MultiSimilarity) + embedding matching',

    scale:
      '30k images · 500+ classes · multi-stage pipeline',

    tags: ['PyTorch Lightning', 'YOLO', 'DinoV2', 'Metric Learning'],

    repoUrl:
      'https://github.com/fishial/fish-identification/tree/main',

    cvDemoType: 'fish',
  },

  {
    title: 'Football Player Detection & Tracking',
    featured: false,
    model: 'YOLOv8 + OpenCV (MIL/CSRT)',

    description:
      'Real-time player tracking and jersey number recognition with on-device inference.',

    metrics: 'Real-time · Edge inference · TF Lite + NNAPI',

    pipeline:
      'YOLO → Tracking → OCR → Player ID',

    problem:
      'Fast motion, occlusion, low-res jersey numbers',

    solution:
      'Tracking + temporal consistency + OCR filtering',

    scale:
      'Real-time video stream · mobile inference',

    tags: ['TensorFlow Lite', 'Android', 'Tracking', 'OCR'],
  },

  {
    title: 'Enterprise Employee Error Detection',
    featured: false,
    model: 'YOLO + OpenCV Stream Analytics',

    description:
      'Industrial safety system detecting anomalous worker behavior in live streams.',

    metrics: 'Live stream processing · anomaly detection',

    pipeline:
      'Detection → Zones → Behavior Rules → Alerts',

    problem:
      'Undefined anomalies, dynamic environment',

    solution:
      'Geometry-based logic + CV detection hybrid',

    scale:
      'Multi-camera stream processing',

    tags: ['YOLO', 'Stream Processing', 'Safety AI'],
  },

  {
    title: 'Face Match & Identity Systems',
    featured: false,
    model: 'TensorFlow + Embeddings Matching',

    description:
      'High-speed facial recognition system with embedding matching and mobile demos.',

    metrics: 'Fast similarity search · real-time matching',

    pipeline:
      'Face Detection → Embeddings → DB Matching',

    problem:
      'Latency and scaling for large identity databases',

    solution:
      'Embedding optimization + efficient search',

    scale:
      'Large identity databases',

    tags: ['Face Recognition', 'TensorFlow', 'iOS', 'CoreML'],
  },

  {
    title: 'Voice & Document Digitalization',
    featured: false,
    model: 'Whisper + NeMo ASR / Tesseract OCR',

    description:
      'Multimodal system for speech recognition and document parsing.',

    metrics: 'ASR + OCR · structured extraction',

    pipeline:
      'Audio → ASR → Text → Structuring',

    problem:
      'Unstructured data (voice + invoices)',

    solution:
      'ASR + OCR + post-processing pipeline',

    scale:
      'Multi-modal data processing',

    tags: ['Whisper', 'OCR', 'NLP'],
  },
]