# Andrew Ludkiewicz
**AI Developer · Computer Vision Engineer · MLOps**

📍 Kraków, Poland &nbsp;|&nbsp; 📞 +48 883 461 961 &nbsp;|&nbsp; ✉️ andrew.ludkiewcz@gmail.com
🔗 [GitHub: andrew-ml-dev](https://github.com/andrew-ml-dev) &nbsp;|&nbsp; 🔗 [LinkedIn: aludkiewicz](https://www.linkedin.com/in/aludkiewicz/)

---

## About Me

AI Developer with **7+ years of commercial experience** in Computer Vision, deep learning, and production ML systems. I specialize in building end-to-end ML pipelines — from raw data collection and model training through optimization and deployment on mobile and cloud infrastructure.

My core expertise spans **object detection, image segmentation, metric learning, face recognition, OCR, and speech recognition**. I enjoy working at the intersection of research and engineering: taking state-of-the-art models and making them work reliably in production.

I'm comfortable owning entire verticals — from dataset annotation strategy and model architecture decisions to containerized deployment on Kubernetes.

---

## Work Experience

### AI Developer — Codahead Sp. z o.o.
**Kraków, Poland · September 2018 — Present (7+ years)**

Codahead is a software house specializing in AI-driven products. I am the primary AI/ML engineer responsible for designing and delivering computer vision and ML features across multiple client projects.

---

#### 🐟 Fish Species Detection, Segmentation & Classification — [Fishial.AI](https://fishial.ai) *(Key Project)*
> Full-stack CV pipeline for large-scale aquatic species recognition at production scale — 700+ classes, 100k+ images, deployed on 200+ edge nodes.

- Designed and maintained the **full ML pipeline**: detection → instance segmentation → fine-grained classification → FAISS embedding retrieval
- **Detection**: Benchmarked and deployed multiple YOLO versions (v5 → v8 → v11); final model — **YOLOv8-nano** optimized for edge inference
- **Edge deployment**: PyTorch → ONNX → **TensorRT INT8** quantization pipeline; achieved **12ms inference latency** on Tensorflow.js
- **Inference performance**: **83 FPS**, **94.2% mAP** on benchmark datasets
- **Segmentation**: Built FPN + ResNet18 architecture for precise instance masks
- **Classification evolution** (iterative research over several years):
  - ResNet → EfficientNet → ConvNeXt → BEiT → settled on **DINOv2** backbone
  - Implemented advanced metric learning losses: **Sub-center ArcFace**, **Multi-Similarity Loss**, **Diversity Loss**
  - Moved to **embedding-based classification** using FAISS for scalable nearest-neighbor search
- **Top-1 accuracy: 91% · Top-5 accuracy: 98%** on 700+ species classes
- Collaborated on annotation strategy using **CVAT** and **FiftyOne**; managed active learning loops across 100k+ images

---

#### 👤 Face Recognition System
> Scalable face identification pipeline for enterprise identity verification.

- Fine-tuned TensorFlow models to generate high-quality **face embeddings**
- Built a **similarity matching system** capable of searching large-scale face databases efficiently
- Designed production-ready face identification pipeline with configurable confidence thresholds

---

#### ⚽ Real-Time Football Player Recognition
> Live player tracking and jersey number recognition for sports analytics.

- Developed real-time player **detection and tracking** system from live broadcast feeds
- Used **YOLO** for player detection, custom OCR models for jersey number recognition
- Applied multi-object tracking algorithms: **OpenCV MIL, CSRT**
- Built Android demo application: **Kotlin + TensorFlow Lite + NNAPI** hardware acceleration

---

#### 📄 Document Digitization & Invoice Processing
> Automated extraction of structured data from scanned business documents.

- Built OCR pipeline combining **Tesseract** with fine-tuned deep learning OCR models
- Designed a structured data extraction system for invoices and forms
- Handled multi-language document sets with layout normalization

---

#### 📱 Mobile AI Deployment (iOS & Android)
> On-device inference optimization for real-time applications.

- Deployed computer vision models on **iOS** using Swift and Xcode + CoreML
- Developed real-time face mask overlay demo app for Android
- Optimized model architectures for mobile inference (quantization, pruning, TFLite export)

---

#### 🎙️ Speech Recognition System
> Voice-to-text pipeline for enterprise applications.

- Built voice recognition system using **OpenAI Whisper** and **NVIDIA NeMo ASR**
- Evaluated trade-offs between accuracy and latency for different model sizes
- Integrated into backend API for streaming transcription

---

#### 🏭 Industrial CCTV Anomaly Detection
> Real-time monitoring system for manufacturing safety compliance.

- Developed a computer vision system to detect **incorrect employee actions** from CCTV streams
- Used **YOLO + OpenCV** for pose and action classification
- Designed to run on edge hardware with minimal latency requirements

---

### Freelance Projects
**2018 — Present (alongside main role)**

#### 🗂️ CRM System for Retail Store
> Custom Django-based CRM for an offline retail business.

- Built full-stack CRM from scratch using **Django + PostgreSQL**
- Designed and deployed the **relational database schema** tailored to retail workflows
- Integrated with **Google Docs / Google Sheets API** for shared reporting and document automation
- Implemented inventory management, customer history, and order tracking modules

---

#### 🕷️ Web Scraping Systems
> Automated data collection pipelines for various clients.

- Built multiple scraping projects using **Scrapy**, **Scrapy-Splash** (JavaScript rendering), **BeautifulSoup**, **Selenium**, and **Requests**
- Handled anti-bot protection, rate limiting, proxy rotation, and dynamic content
- Delivered structured data outputs (JSON, CSV, database inserts) for downstream use

---

#### 🤖 Telegram Bots
> Custom bots for business automation and user interaction.

- Developed multiple Telegram bots using **python-telegram-bot** / **aiogram**
- Covered use cases: notifications, admin panels, order processing, scheduled tasks

---

#### 🎨 Generative AI Pipelines (ComfyUI)
> AI-driven image and video generation workflows for creative clients.

- Built custom **ComfyUI pipelines** for photo and video generation using diffusion models
- Chained nodes for ControlNet, LoRA fine-tuning, upscaling, and video frame generation
- Automated batch generation workflows for commercial content production

---

#### 🔍 Vector Search for Telegram Bot (RAG)
> Semantic knowledge base with vector retrieval for a conversational bot.

- Implemented **vector text search** using **Qdrant** as the vector database
- Embedded documents and queries using sentence transformers for semantic similarity
- Integrated retrieval pipeline into a Telegram bot for intelligent Q&A over a custom knowledge base

---

## Technical Skills

### Machine Learning & AI
| Area | Technologies |
|------|-------------|
| Deep Learning Frameworks | PyTorch, PyTorch Lightning, TensorFlow, TensorFlow Lite |
| Object Detection | YOLO (v5, v6, v7, v8, v11), Faster R-CNN |
| Segmentation | FPN, ResNet-based architectures, Mask R-CNN |
| Metric Learning | ArcFace, Sub-center ArcFace, Multi-Similarity Loss, Triplet Loss |
| Vision Transformers | DINOv2, BEiT, ViT |
| Embedding & Search | FAISS, cosine similarity, nearest-neighbor retrieval |
| OCR | Tesseract, deep learning OCR models |
| Speech Recognition | OpenAI Whisper, NVIDIA NeMo ASR |
| Classical CV | OpenCV (tracking, image processing, video pipelines) |
| Model Hubs | Hugging Face Transformers, timm |

### MLOps & Infrastructure
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes (Azure Kubernetes Service — AKS)
- **Model Optimization**: TensorRT, ONNX, INT8/FP16 quantization, NNAPI
- **Edge Deployment**: Raspberry Pi 5, OTA updates via Docker, custom C++ post-processing
- **Caching**: Redis
- **Experiment Tracking**: MLflow
- **Data & Annotation**: CVAT, FiftyOne
- **Training Infrastructure**: Linux servers, GPU cluster setup and management
- **APIs**: FastAPI (Python), REST API design

### Development
- **Python** — primary language (7+ years): training pipelines, API backends, data processing
- **C++** — custom post-processing for TensorRT inference pipelines
- **Django** — CRM and web backend development
- **Kotlin** — Android app development (TensorFlow Lite integration)
- **Swift** — iOS app development (CoreML integration)

### Tools & Platforms
- Git (GitHub)
- OpenAI API (GPT-4, Whisper, Embeddings)
- Cursor IDE (AI-assisted development)
- Azure Cloud
- **Qdrant** — vector database for semantic search / RAG pipelines
- **ComfyUI** — generative AI (image & video) pipeline automation
- **Scrapy, Scrapy-Splash, BeautifulSoup, Selenium** — web scraping
- **aiogram / python-telegram-bot** — Telegram bot development
- **Google Workspace API** (Docs, Sheets integration)

---

## Key Strengths

- **Research-to-Production**: Ability to evaluate academic papers and translate promising techniques into working production systems
- **Full Pipeline Ownership**: Experience covering every stage — data, training, evaluation, optimization, deployment
- **Edge AI & Optimization**: TensorRT INT8/FP16 pipelines achieving 12ms latency / 83 FPS on Raspberry Pi 5; fleet management of 200+ deployed nodes
- **Mobile AI**: Proven experience deploying optimized models on Android (NNAPI) and iOS (CoreML)
- **Metric Learning**: Deep expertise in embedding-based systems for large-scale recognition tasks
- **Iterative Improvement**: History of incrementally improving models over long project lifetimes using real-world feedback

---

## Education

### AGH University of Science and Technology — Kraków, Poland
**Master of Science (MSc), Faculty of Mechanical Engineering and Robotics**
Specialization: **Automatics and Robotics**
*Graduated: 2018*

Relevant coursework: control systems, computer vision foundations, signal processing, robotics programming.

**Master's Thesis:** *"Detection and Recognition of Vehicle License Plates"*
- Developed a complete ALPR (Automatic License Plate Recognition) pipeline: plate detection → character segmentation → OCR-based recognition
- Built an **Android application** demonstrating real-time license plate detection using the device camera
- Implemented using classical CV techniques (OpenCV) combined with early deep learning approaches

---

## Languages

| Language | Level |
|----------|-------|
| Polish | Native |
| Russian | Native / Fluent |
| English | (B1/B2) |

---

## Interests & Side Activities

- Staying current with CV/ML research (arXiv, Papers With Code)
- Experimenting with open-source models and fine-tuning techniques
- Building personal AI-powered tools and automations
- This portfolio website itself — built with **FastAPI + React + Docker + Caddy + LLAMA.cpp**, featuring an AI chat assistant powered by OpenAI GPT-4

---

*Last updated: March 2026*
