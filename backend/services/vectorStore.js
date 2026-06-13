/**
 * Simple In-Memory Vector Store
 * Uses cosine similarity to find the most relevant chunks.
 */
class InMemoryVectorStore {
    constructor() {
        this.store = []; // { text: string, embedding: number[], metadata: object }
    }

    addChunks(chunks, embeddings, metadata = {}) {
        for (let i = 0; i < chunks.length; i++) {
            this.store.push({
                text: chunks[i],
                embedding: embeddings[i],
                metadata
            });
        }
    }

    // Compute cosine similarity between two vectors
    cosineSimilarity(vecA, vecB) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }
        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    // Search for the topK chunks closest to queryEmbedding
    search(queryEmbedding, topK = 3) {
        const scoredChunks = this.store.map(item => ({
            text: item.text,
            metadata: item.metadata,
            score: this.cosineSimilarity(queryEmbedding, item.embedding)
        }));

        // Sort by descending score
        scoredChunks.sort((a, b) => b.score - a.score);

        return scoredChunks.slice(0, topK);
    }
    
    // Get random chunks (e.g., for quiz generation)
    getRandomChunks(count = 3) {
        const shuffled = [...this.store].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(item => item.text);
    }

    // Get all chunks for a specific document filename
    getChunksByFilename(filename) {
        return this.store
            .filter(item => item.metadata && item.metadata.filename === filename)
            .map(item => item.text);
    }
}

module.exports = new InMemoryVectorStore();
