// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR NAVIGATION
// Each entry maps a nav button to a user message + bot widget response.
// icon values match the ICON_MAP in Sidebar.jsx:
//   'user' | 'briefcase' | 'cpu' | 'layers' | 'mail'
//
// botType must be a key registered in WidgetRegistry.jsx.
// ─────────────────────────────────────────────────────────────────────────────

import { ABOUT_TEXT } from './profile'
import { EXPERIENCE } from './experience'
import { TECH_STACK } from './stack'
import { PROJECTS } from './projects'
import { CONTACT_INTRO, CONTACT_LINKS } from './contact'

export const NAV_ITEMS = [
  {
    id: 'about',
    label: 'About Me',
    icon: 'user',
    userMsg: 'Tell me about yourself.',
    botType: 'TextBubble',
    getBotPayload: () => ({ text: ABOUT_TEXT, isStreaming: false }),
  },
  {
    id: 'architecture',
    label: 'How This AI Works',
    icon: 'bot', 
    userMsg: 'How is this AI portfolio built?',
    botType: 'ArchitectureFlowWidget', // <--- New widget name
    getBotPayload: () => ({
      title: 'AI Data Lifecycle: Edge Inference',
      subtitle: 'From Browser to Raspberry Pi 5 Silicon',
      
      // System components (diagram nodes)
      nodes: {
        browser: { name: 'User Browser', tech: 'React / SSE', icon: 'monitor' },
        backend: { name: 'FastAPI Service', tech: 'Python / Redis', icon: 'server' },
        engine: { name: 'Llama.cpp Engine', tech: 'C++ / Docker', icon: 'brain-circuit' },
      },
      
      // Logical data flow steps
      flow: [
        { from: 'browser', to: 'backend', label: '1. User Message', desc: 'Secure HTTP POST' },
        { node: 'backend', label: '2. Guardrails & Filter', desc: 'Blocks non-CV questions' },
        { node: 'backend', label: '3. Cache Check', desc: 'Redis hit/miss lookup' },
        { from: 'backend', to: 'engine', label: '4. Run Inference', desc: 'Sends history to Llama.cpp' },
        { node: 'engine', label: '5. INT4 Processing', desc: 'Generates response on RPi5' },
        { from: 'engine', to: 'backend', label: '6. Send Raw Output', desc: 'TCP Stream' },
        { node: 'backend', label: '7. Get Stats', desc: 'Fetch CPU/Memory & Timings' },
        { from: 'backend', to: 'browser', label: '8. Stream Response', desc: 'Server-Sent Events' },
      ]
    }),
  },
  {
    id: 'publications',
    label: 'Publications',
    icon: 'book', 
    userMsg: 'Have you written any articles?',
    botType: 'PublicationsWidget',
    getBotPayload: () => [
      {
        title: 'Practical application of the Android Neural Network API for TF Lite',
        url: 'https://codahead.com/blog/practical-application-of-the-android-neural-network-api-for-the-use-of-tensorflow-lite-models',
        tag: 'Edge ML',
        level: 'Advanced',
        readTime: '7 min',
    
        insight:
          'Practical guide to deploying ML models on Android using TensorFlow Lite with hardware acceleration via NNAPI for low-latency inference.',
    
        topics: ['TensorFlow Lite', 'NNAPI', 'Edge AI', 'Android'],
    
        problem:
          'High latency and resource constraints when running ML models on mobile devices',
    
        solution:
          'Leveraging TensorFlow Lite with NNAPI to offload inference to hardware accelerators (GPU/DSP/NPUs)',
    
        contribution:
          'Explained end-to-end pipeline from model conversion to on-device inference and optimization strategies',
      },
    
      {
        title: 'Face Swap System',
        url: 'https://codahead.com/blog/face-swap-system',
        tag: 'Computer Vision',
        level: 'Advanced',
        readTime: '6 min',
    
        insight:
          'Design of a real-time face swap pipeline combining detection, alignment, and image transformation techniques.',
    
        topics: ['Computer Vision', 'Face Detection', 'Image Processing'],
    
        problem:
          'Real-time face transformation requires precise alignment and low-latency processing',
    
        solution:
          'Pipeline combining face detection, landmark alignment, and transformation for seamless swapping',
    
        contribution:
          'Demonstrated full CV pipeline design including preprocessing, transformation, and rendering',
      },
    
      {
        title: 'TikTok clone for beginners',
        url: 'https://codahead.com/blog/tiktok-clone-for-beginners',
        tag: 'Mobile/Video',
        level: 'Production',
        readTime: '5 min',
    
        insight:
          'Breakdown of building a scalable short-video platform including streaming, UI, and backend considerations.',
    
        topics: ['Video Streaming', 'Mobile Dev', 'System Design'],
    
        problem:
          'Handling video delivery, UI responsiveness, and scalability in media-heavy applications',
    
        solution:
          'Architecture combining efficient video loading, feed logic, and mobile-first UX',
    
        contribution:
          'Explained core components of modern video platforms and trade-offs in implementation',
      },
    
      {
        title: 'How to create your own messaging app',
        url: 'https://codahead.com/blog/how-to-create-your-own-messaging-app',
        tag: 'Architecture',
        level: 'Production',
        readTime: '6 min',
    
        insight:
          'System design of real-time messaging applications including backend architecture and communication protocols.',
    
        topics: ['Backend', 'Realtime Systems', 'WebSockets'],
    
        problem:
          'Ensuring low-latency, reliable communication between users at scale',
    
        solution:
          'Using real-time protocols (e.g., WebSockets) with scalable backend architecture',
    
        contribution:
          'Outlined architecture patterns for building production-ready messaging systems',
      }
    ]
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: 'briefcase',
    userMsg: 'What is your work experience?',
    botType: 'ExperienceLogWidget',
    getBotPayload: () => EXPERIENCE,
  },
  {
    id: 'education',
    label: 'Education',
    icon: 'library',
    userMsg: 'Tell me about your education.',
    botType: 'EducationWidget',
    getBotPayload: () => ({
      institution: 'AGH University of Krakow',
      degree: 'Master of Science (MSc)',
      focus: 'Mechatronics, Robotics, and Automation Engineering',
      period: '2014 – 2019',
    }),
  },
  {
    id: 'stack',
    label: 'Tech Stack',
    icon: 'cpu',
    userMsg: 'What is your technology stack?',
    botType: 'StackWidget',
    getBotPayload: () => TECH_STACK,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'layers',
    userMsg: 'Show me your projects.',
    botType: 'ProjectVisionWidget',
    getBotPayload: () => PROJECTS,
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: 'mail',
    userMsg: 'How can I contact you?',
    botType: 'ContactWidget',
    getBotPayload: () => ({ text: CONTACT_INTRO, links: CONTACT_LINKS }),
  },
  {
    id: 'resume',
    label: 'Resume PDF',
    icon: 'file', 
    userMsg: 'Can I see your full resume?',
    botType: 'ResumeWidget',
    getBotPayload: () => ({
      fileName: 'cv.pdf',
      fileSize: '0.5 MB',
      previewUrl: '/resume-preview.png', // Optional: preview screenshot of the first page
      downloadUrl: '/cv.pdf',
    }),
  },
]
