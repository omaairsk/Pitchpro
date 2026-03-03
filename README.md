🚀 PitchPro - Interactive Pitch Deck Builder

PitchPro is a powerful, fully responsive, web-based presentation builder inspired by the classic Microsoft PowerPoint ribbon interface, but completely reimagined for the modern browser environment. Whether you are a founder pitching to investors, a student finalizing a report, or a business professional organizing data, PitchPro provides a robust, zero-installation platform to create, format, animate, and export professional-grade pitch decks.

Built with performance and user experience in mind, PitchPro bridges the gap between complex desktop software and intuitive web applications. It offers a familiar workflow, augmented by cutting-edge AI capabilities and seamless export options, all running locally in your browser.

⚡ React + TypeScript + Vite Template

This project uses a modern development setup to provide a fast and reliable developer experience:

Vite: Next-generation frontend tooling with Instant HMR.

TypeScript: Strict type checking for reliable code.

Fast Refresh: Uses @vitejs/plugin-react with Babel.

React Compiler: Enabled for optimized performance (Note: impacts dev/build timings).

✨ Key Features

🎨 Modern Workspace & Ribbon UI

Classic Ribbon Navigation: Experience a familiar, tabbed interface (Home, Insert, Design, Transitions, Animations, Slide Show, Record, Review, View) for immediate access to tools.

Fully Responsive Architecture: Adapts flawlessly across desktops, tablets, and mobile devices using smart slide-over utility panels.

Multiple Presentation Views: Switch between Normal View for granular editing and Slide Sorter for a high-level deck overview.

📝 Rich Slide Editing

Smart Canvas Layouts: Choose from predefined Title, Content, and Split (Media + Text) layouts.

Granular Text Formatting: Full control over Bold, Italic, Underline, and paragraph alignments.

Seamless Media Integration: Upload local images, paste URLs, or embed dynamic YouTube videos.

Design & Theming: Apply global themes or individual slide backgrounds from a premium color palette.

🪄 Animations & Presentations

Slide Transitions: Professional effects including Fade, Slide-Up, Zoom, Wipe, and Morph.

Element Animations: Entrance animations like Appear, Fade, Fly-In, and Zoom.

Immersive Presentation Mode: built-in full-screen mode with standard keyboard navigation (Arrow keys, Space, Escape).

🤖 AI-Powered Tools (Powered by Gemini)

Intelligent Spelling & Grammar Check: Leverage AI to review and fix slide copy automatically.

Universal Translator: Instantly translate text into over 100 global languages.

💾 High-Fidelity Export Options

Export to Native PPTX: Compile slides into fully editable, native Microsoft PowerPoint files.

Export to High-Quality PDF: Generate perfectly scaled, 16:9 high-resolution PDF documents.

🛠️ Tech Stack

Core Framework: React 18 & TypeScript

Styling & UI: Tailwind CSS

Iconography: Lucide React

PDF Generation: html2pdf.js

PowerPoint Compilation: PptxGenJS

AI Integration: Google Gemini API

🚀 Getting Started

Prerequisites

Node.js (v16 or higher)

npm or yarn

Installation

Clone the repository:

git clone [https://github.com/omaairsk/Pitchpro.git](https://github.com/omaairsk/Pitchpro.git)
cd pitchpro


Install dependencies:

npm install


Configure Tailwind:
Ensure tailwind.config.js is scanning your files and src/App.css imports Tailwind directives.

Add Gemini API Key:
In src/App.jsx, update the apiKey variable inside the performGeminiTask function.

Development

npm run dev


🔧 ESLint Configuration

For production development, update your configuration to enable type-aware lint rules:

// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])


💡 Usage Guide

New Slides: Click + New Slide in the Home tab or sidebar.

Layouts: Use the floating toolbar or ribbon Home tab.

Media: Use the Insert tab to upload images or paste URLs.

Exporting: Use the PDF or PPTX buttons in the top header.

🤝 Contributing

Feel free to check the issues page for feature requests or bug reports.

📄 License

Distributed under the MIT License. See LICENSE for more information.

react presentation-builder pitch-deck tailwind-css ai-tools gemini-api pdf-generation pptx-generator powerpoint-clone web-app

Built with ❤️ by [https://github.com/omaairsk](https://github.com/omaairsk)]
