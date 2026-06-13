# 📘 AI Study Buddy — Full-Stack AI-Powered RAG System

[![React](https://img.shields.io/badge/Frontend-React%20%2F%20Vite-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Gemini](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%20Pro-4285F4?style=flat-square&logo=googlegemini)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Render](https://img.shields.io/badge/Deployment-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com/)

An advanced, responsive full-stack **Retrieval-Augmented Generation (RAG)** application designed to transform static study materials into dynamic, interactive learning environments. Users can upload educational PDFs and immediately unlock context-aware chat interfaces, comprehensive structured summaries, and optimized quick-reference cheat sheets generated natively by LLMs.

🚀 **Live Interactive Demo:** [https://study-buddy-ui-bfuf.onrender.com/](https://study-buddy-ui-bfuf.onrender.com/)

---

## 📸 Product Preview

<table width="100%">
  <tr>
    <td width="50%" align="center">
      <h3>🏠 Interactive User Dashboard</h3>
      <img src="./assets/HomePage.png" alt="AI Study Buddy Home Page" width="100%">
    </td>
    <td width="50%" align="center">
      <h3>📝 Dynamic Cheat Sheet Compilation</h3>
      <img src="./assets/CheatSheet.png" alt="AI Generated Cheat Sheet" width="100%">
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <h3>🧠 Context-Aware Study Session (View 1)</h3>
      <img src="./assets/FlashCard%201.png" alt="Flashcards View 1" width="100%">
    </td>
    <td width="50%" align="center">
      <h3>💬 Interactive Knowledge Testing (View 2)</h3>
      <img src="./assets/FlashCard%202.png" alt="Flashcards View 2" width="100%">
    </td>
  </tr>
</table>

---

## ✨ Core Features

*   📂 **Robust PDF Ingestion Pipeline:** Seamless drag-and-drop document uploads coupled with real-time text parsing and token-optimized chunking matrices.
*   💬 **Context-Aware Document Chat:** Deep semantic document interrogation using custom text-splitting heuristics to fetch precise source contexts for the Gemini AI architecture.
*   🧠 **Structured Study Assistant Mode:** Instantly converts dry technical textbooks or slide decks into clean, thematic interactive learning outlines.
*   📝 **Dynamic Cheat Sheet Compilation:** Auto-extracts critical formulas, foundational definitions, and core concepts into a scannable dashboard.

---

## 🛠️ Tech Stack & Architecture

### Frontend (User Interface)
*   **React 18 & Vite:** Ultra-fast, component-driven client architecture optimized for rapid single-page updates.
*   **Tailwind CSS:** Fully tailored layout utilities providing a responsive, dark-mode-first aesthetic dashboard.
*   **Context API:** Client-side state orchestration handling dynamic route references, processing spinners, and persistent dialogue histories.

### Backend (API Gateway & Engine)
*   **Node.js & Express:** Production-scale server runtime routing asynchronous network requests across localized controller groups.
*   **Retrieval-Augmented Generation (RAG):** Custom structural token segmentation mechanics slicing material strings before injecting matching reference payloads.
*   **Google Gemini Pro Integration:** Direct orchestration layer interacting natively with Google’s generative AI ecosystem via structured environment variable masks.

---

## 🗂️ Repository Structure

```text
AI-Study-Buddy/
├── assets/               # Production screenshots and media assets
├── frontend/             # React/Vite Client UI Application
│   ├── src/
│   │   ├── components/   # Modular, re-usable dashboard elements
│   │   ├── App.jsx       # Root framework router and state initialization
│   │   └── main.jsx
│   └── package.json
│
├── backend/              # Node.js REST API Architecture
│   ├── routes/           # Express router declarations (/api/upload, etc.)
│   ├── services/         # Generative AI pipeline and orchestration services
│   ├── utils/            # Document parsing and intelligent text-splitters
│   ├── server.js         # Server initialization, CORS tuning, and boot configs
│   └── package.json
│
└── render.yaml           # Automated Blueprint Infrastructure Schema