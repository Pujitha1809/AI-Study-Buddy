# AI-Powered Study Buddy

An AI-powered RAG (Retrieval-Augmented Generation) web application that enables users to upload PDF lecture notes and interact with them via a chat interface or a dynamic flashcard quiz system.

## Prerequisites
- Node.js (v18 or higher recommended)
- A Google Gemini API Key

## Setup & Running the Project

The project is split into two parts: the `backend` and the `frontend`. You will need to run both simultaneously in separate terminal windows.

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the required dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Add your Gemini API Key:
   Open the `backend/.env` file and replace `your_gemini_api_key_here` with your actual API key.
   ```env
   PORT=5000
   GEMINI_API_KEY=your-actual-api-key-goes-here
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   *You should see "Server is running on port 5000" in the terminal.*

### 2. Frontend Setup
1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the required dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The terminal will output a local URL, typically `http://localhost:5173`.*

### 3. Usage
- Open your browser and go to `http://localhost:5173`.
- Upload a PDF using the Sidebar.
- Wait for it to process (it extracts text and generates vector embeddings).
- Ask questions in the "Chat" tab, or switch to the "Study Mode" tab to test your knowledge with AI-generated flashcards!

## Architecture Note
The backend uses an **in-memory vector store**. This means that when you stop the backend Node.js server, all uploaded PDFs and their vectorized embeddings will be cleared. You will need to re-upload your PDFs the next time you start the server.
