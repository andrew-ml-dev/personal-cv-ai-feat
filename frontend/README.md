# CV Portfolio Frontend

This is the frontend component of the CV Portfolio, built with React, Vite, and Tailwind CSS. It features a modern, interactive chat interface providing real-time AI responses using Server-Sent Events (SSE) streaming.

## Features

- **Modern UI**: Implements a dark mode aesthetic with glassmorphism and neon glows.
- **Interactive Chat**: A dynamic feed that displays messages with a typing indicator and streams responses from the AI.
- **Widgets System**: A scalable `WidgetRegistry` mapping specialized UI components to message types. Available widgets include:
  - `TextBubble`: Formatted chat bubbles.
  - `StackWidget`: Colour-coded grid of technical skills.
  - `ExperienceLogWidget`: Animated experience timeline.
  - `ProjectVisionWidget`: Visual demo component.
  - `ContactWidget`: Curated contact links layout.
- **Vite Proxy**: Pre-configured resolving of `/api/*` requests to the local backend during development.

## Tech Stack

- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React

## Getting Started Locally

1. Make sure you have Node.js and `npm` installed.
2. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to **http://localhost:5173**. The app will automatically proxy backend API calls to `localhost:8000`.

## Building for Production

To create a production-ready bundle, run:
```bash
npm run build
```
This command compiles the React application into the `dist/` directory, which can then be served by Nginx, Caddy, or any other web server (as used in the project's Docker setup).

## Project Structure

```
frontend/
├── index.html                  ← Main HTML entry
├── vite.config.js              ← Vite build and proxy settings
├── tailwind.config.js          ← Tailwind theme definitions
├── src/
│   ├── main.jsx                ← React root
│   ├── App.jsx                 ← Main application layout
│   ├── index.css               ← Global styles
│   ├── data/
│   │   └── mockData.js         ← Menu configuration and static widget data
│   ├── hooks/
│   │   └── useChat.js          ← State logic and SSE streaming implementation
│   └── components/
│       ├── Sidebar.jsx         ← Navigation sidebar
│       ├── ChatFeed.jsx        ← Renders the message history
│       ├── InputBar.jsx        ← Message input component
│       └── widgets/            ← Component registry and specific widget UI
```

## Customisation

- To change the available static data or sidebar options, edit `src/data/mockData.js`.
- To add a newly designed widget, create a new React component inside `src/components/widgets/` and register it inside `WidgetRegistry.jsx`.
