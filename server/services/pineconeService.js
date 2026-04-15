const { Pinecone } = require('@pinecone-database/pinecone');

/**
 * Service to interact with Pinecone vector database
 */
const queryPinecone = async (vector, topK = 3) => {
    try {
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });
        
        const index = pc.index(process.env.PINECONE_INDEX);
        
        const queryResponse = await index.query({
            vector: vector,
            topK: topK,
            includeMetadata: true
        });
        
        return queryResponse.matches.map(match => match.metadata.text).join('\n\n');
    } catch (error) {
        console.error('Pinecone Query Error:', error);
        // Fallback or handle gracefully
        return '';
    }
};

module.exports = { queryPinecone };
