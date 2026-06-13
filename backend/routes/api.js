const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { splitText } = require('../utils/textSplitter');
const vectorStore = require('../services/vectorStore');
const { generateEmbeddings, generateChatResponse, generateQuiz, generateEmbedding, generateCheatSheet } = require('../services/geminiService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload Endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Parse PDF
        const pdfData = await pdfParse(req.file.buffer);
        const text = pdfData.text;

        // Split text
        const chunks = splitText(text, 500, 100);

        // Generate Embeddings
        const embeddings = await generateEmbeddings(chunks);

        // Save to Vector Store
        vectorStore.addChunks(chunks, embeddings, { filename: req.file.originalname });

        res.json({ message: 'File processed successfully', chunksCount: chunks.length });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: error.message || 'Failed to process file' });
    }
});

// Chat Endpoint
router.post('/chat', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Embed the query
        const queryEmbedding = await generateEmbedding(query);

        // Search the vector store
        const relevantChunks = vectorStore.search(queryEmbedding, 3);

        // Generate Response
        const reply = await generateChatResponse(query, relevantChunks);

        res.json({ reply, context: relevantChunks });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({ error: 'Failed to generate chat response' });
    }
});

// Quiz Endpoint
router.get('/quiz', async (req, res) => {
    try {
        // Get random chunks
        const chunks = vectorStore.getRandomChunks(3);
        if (chunks.length === 0) {
            return res.status(400).json({ error: 'No documents uploaded yet.' });
        }

        // Generate Quiz
        const quiz = await generateQuiz(chunks);

        res.json({ quiz });
    } catch (error) {
        console.error('Quiz Error:', error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});
const PDFDocument = require('pdfkit');

// Simple cache to avoid regenerating cheat sheets on download
const cheatSheetCache = {};

// Cheat Sheet Endpoint
router.get('/cheat-sheet/:documentId', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        
        // Return from cache if available
        if (cheatSheetCache[documentId]) {
            return res.json({ cheatSheet: cheatSheetCache[documentId] });
        }

        const chunks = vectorStore.getChunksByFilename(documentId);
        if (chunks.length === 0) {
            return res.status(404).json({ error: 'Document not found in server memory. The server may have restarted. Please re-upload your file.' });
        }

        const cheatSheet = await generateCheatSheet(chunks);
        cheatSheetCache[documentId] = cheatSheet;
        res.json({ cheatSheet });
    } catch (error) {
        console.error('Cheat Sheet Error:', error);
        res.status(500).json({ error: 'Failed to generate cheat sheet' });
    }
});

// Download PDF Endpoint
router.get('/cheat-sheet/:documentId/download', async (req, res) => {
    try {
        const documentId = req.params.documentId;
        let cheatSheetText = cheatSheetCache[documentId];

        // Fallback: regenerate if not cached (e.g. server restarted)
        if (!cheatSheetText) {
            const chunks = vectorStore.getChunksByFilename(documentId);
            if (chunks.length === 0) {
                return res.status(404).json({ error: 'Document not found in server memory. Please re-upload your file.' });
            }
            cheatSheetText = await generateCheatSheet(chunks);
            cheatSheetCache[documentId] = cheatSheetText;
        }

        // Sanitize text for PDFKit (standard fonts lack unicode/emoji support)
        let cleanText = cheatSheetText
            .replace(/[^\x00-\x7F]/g, "") // Strips non-ASCII unicode emojis smoothly
            .replace(/Ø=\s*[^ ]*/g, "")    // Remaps broken header prefixes
            .replace(/\$8e\^{TM}p/g, "")   // Fixes the Section 3 artifact typo
            .replace(/\'\(Main/g, "Main"); // Fixes the Section 4 typo

        // Initialize PDFKit with bufferPages to allow dynamic footers
        const doc = new PDFDocument({ margin: 40, bufferPages: true });
        
        // We set headers early but if it fails halfway, we can't send a clean 500 JSON.
        // It's better to just log it if piped.
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Study_Buddy_Cheat_Sheet.pdf"`);
        doc.pipe(res);

        // Simple Markdown parsing for PDFKit
        const lines = cleanText.split('\n');
        for (const line of lines) {
            if (line.startsWith('# ')) {
                // Main Title
                doc.fontSize(24).fillColor('#0f172a').font('Helvetica-Bold').text(line.replace('# ', ''), { align: 'center' });
                doc.moveDown(0.5);
                // Horizontal rule
                doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor('#cbd5e1').stroke();
                doc.moveDown();
            } else if (line.startsWith('## ')) {
                // H2 Headers
                doc.moveDown();
                doc.fontSize(14).fillColor('#1e3a8a').font('Helvetica-Bold').text(line.replace('## ', ''));
                doc.moveDown(0.5);
            } else if (line.startsWith('### ')) {
                // H3 Headers
                doc.moveDown(0.5);
                doc.fontSize(12).fillColor('#334155').font('Helvetica-Bold').text(line.replace('### ', ''));
                doc.moveDown(0.2);
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                // Bullet points
                doc.fontSize(10).fillColor('#334155').font('Helvetica').text(`•  ${line.substring(2)}`, { indent: 20 });
                doc.moveDown(0.2);
            } else if (line.trim() === '') {
                // Empty line
                doc.moveDown(0.5);
            } else {
                // Regular text
                // Strip out bold markers ** for regular text rendering simplicity
                const cleanText = line.replace(/\*\*/g, '');
                doc.fontSize(10).fillColor('#334155').font('Helvetica').text(cleanText);
            }
        }

        // Add dynamic footer
        let pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(8).fillColor('#94a3b8').font('Helvetica')
               .text(`Generated via Study Buddy AI • Page ${i + 1}`,
               40, doc.page.height - 30, { align: 'center' });
        }

        doc.end();

    } catch (error) {
        console.error('Download PDF Error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to generate PDF download' });
        } else {
            res.end(); // gracefully end if stream broke
        }
    }
});

module.exports = router;
