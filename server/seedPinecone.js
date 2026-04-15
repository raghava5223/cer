const mongoose = require('mongoose');
const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Event = require('./models/Event');
require('dotenv').config();

// Helper for exponential backoff retries
const embedWithRetry = async (model, text, retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            const isRateLimit = error.message && (error.message.includes('429') || error.message.includes('quota'));
            if (isRateLimit && i < retries - 1) {
                const waitTime = Math.pow(2, i) * 3000; // 3s, 6s, 12s...
                console.warn(`[Retry] Rate limit hit. Waiting ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            throw error;
        }
    }
};

async function seedPinecone() {
    try {
        console.log('🚀 Starting Robust Pinecone Seeding...');
        
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-event-portal');
        console.log('✅ MongoDB Connected');

        const events = await Event.find({});
        console.log(`📝 Syncing ${events.length} events...`);

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        
        const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const index = pc.index(process.env.PINECONE_INDEX);

        for (const event of events) {
            try {
                const eventText = `Event: ${event.eventName}\nDescription: ${event.description}\nRules: ${event.rules || 'Check portal'}\nPrizes: ${event.prizes || 'N/A'}\nVenue: ${event.venue}\nFees: ₹${event.fees}\nDate: ${new Date(event.date).toDateString()}`.trim();

                console.log(`🔄 Processing: ${event.eventName}`);
                const embedding = await embedWithRetry(embedModel, eventText);

                await index.upsert([{
                    id: event._id.toString(),
                    values: embedding,
                    metadata: {
                        text: eventText,
                        name: event.eventName,
                        type: 'event_detail'
                    }
                }]);
                console.log(`✅ Success: ${event.eventName}`);
                
                // Add a small pause to avoid bursting
                await new Promise(r => setTimeout(r, 1000));
            } catch (err) {
                console.error(`❌ Failed ${event.eventName}:`, err.message);
            }
        }

        console.log('--- Seeding Done ---');
        
        // Final stat check
        console.log('Verifying index stats...');
        await new Promise(r => setTimeout(r, 3000));
        const stats = await index.describeIndexStats();
        console.log('Final Record Count:', stats.totalRecordCount);

        process.exit(0);
    } catch (error) {
        console.error('CRITICAL SEEDING FAILURE:', error);
        process.exit(1);
    }
}

seedPinecone();
