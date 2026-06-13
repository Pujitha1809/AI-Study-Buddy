const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function generateEmbedding(text) {
    try {
        console.log("[EMBEDDING TRY] Sending chunks to gemini-embedding-2...");
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-2',
            contents: text,
        });
        return response.embeddings[0].values;
    } catch (err) {
        console.error("[EMBEDDING ERROR]", err);
        throw err;
    }
}

async function generateEmbeddings(texts) {
    // GenAI SDK allows embedding arrays, but we map for simplicity
    const embeddings = [];
    for (const text of texts) {
        const emb = await generateEmbedding(text);
        embeddings.push(emb);
    }
    return embeddings;
}

async function generateChatResponse(query, contextChunks) {
    const contextText = contextChunks.map(c => c.text).join('\n\n');
    const prompt = `You are an AI-Powered Study Buddy. Use the following context from uploaded lecture notes to answer the user's question. If the answer is not in the context, say so.\n\nContext:\n${contextText}\n\nQuestion: ${query}`;
    
    console.log("[DEBUG] Using chat model: 'gemini-2.5-flash'");
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
}

async function generateQuiz(contextChunks) {
    const contextText = contextChunks.join('\n\n');
    const prompt = `You are a helpful study buddy. Based on the following text, generate 3 multiple-choice flashcard questions.
You must output a raw JSON array ONLY, with no markdown formatting.
Each object in the array should have exactly these keys: "question", "options" (an array of 4 strings), "correctAnswer" (the string of the correct option), and "explanation".\n\nText:\n${contextText}`;

    console.log("[DEBUG] Using quiz model: 'gemini-2.5-flash'");
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    let text = response.text;
    // Clean up if it contains markdown JSON block
    if (text.startsWith('\`\`\`json')) {
        text = text.substring(7, text.length - 3).trim();
    } else if (text.startsWith('\`\`\`')) {
        text = text.substring(3, text.length - 3).trim();
    }
    
    return JSON.parse(text);
}

async function generateCheatSheet(contextChunks) {
    const contextText = contextChunks.join('\n\n');
    const prompt = `You are an elite academic tutor. Analyze the provided study material and generate a high-density, beautifully structured Markdown Cheat Sheet. Include: 1. Core Terminology & Definitions, 2. Essential Formulas or Main Theorems, 3. Critical Concepts & Mechanisms broken down into bullet points, 4. A 3-sentence summary of the main takeaway.\n\nMaterial:\n${contextText}`;

    console.log("[DEBUG] Using cheat sheet model: 'gemini-2.5-flash'");
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
}

module.exports = {
    generateEmbedding,
    generateEmbeddings,
    generateChatResponse,
    generateQuiz,
    generateCheatSheet
};
