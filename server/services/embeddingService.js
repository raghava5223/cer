const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service to generate vector embeddings using Gemini with robust retry logic
 */
const generateEmbedding = async (text, retries = 3) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            const isRateLimit = error.message && (error.message.includes('429') || error.message.includes('quota'));
            if (isRateLimit && i < retries - 1) {
                const waitTime = Math.pow(2, i) * 2000; // Exponential backoff: 2s, 4s, 8s
                console.warn(`[Embedding Service] Rate limit hit. Retrying in ${waitTime}ms... (Attempt ${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            console.error('Embedding Generation Error:', error.message);
            throw error;
        }
    }
};

module.exports = { generateEmbedding };
