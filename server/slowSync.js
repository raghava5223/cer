const mongoose = require('mongoose');
const { Pinecone } = require('@pinecone-database/pinecone');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Event = require('./models/Event');
require('dotenv').config();

async function slowSync() {
    try {
        console.log('🐢 Starting Slow Sync...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-event-portal');
        
        const events = await Event.find({});
        const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const index = pc.index(process.env.PINECONE_INDEX);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

        for (const event of events) {
            let success = false;
            let attempt = 0;
            
            while (!success && attempt < 10) {
                try {
                    console.log(`🔄 [Attempt ${attempt + 1}] Embedding: ${event.eventName}`);
                    const eventText = `Event: ${event.eventName}\nDescription: ${event.description}\nCategory: ${event.eventName.toLowerCase().includes('hack') ? 'Hackathon' : 'Cultural/Technical'}\nRules: ${event.rules || 'N/A'}\nPrizes: ${event.prizes || 'N/A'}\nVenue: ${event.venue}\nFees: ₹${event.fees}\nDate: ${new Date(event.date).toDateString()}`.trim();

                    const result = await embedModel.embedContent(eventText);
                    const embedding = result.embedding.values;

                    await index.upsert([{
                        id: event._id.toString(),
                        values: embedding,
                        metadata: { text: eventText, name: event.eventName }
                    }]);
                    
                    console.log(`✅ Success: ${event.eventName}`);
                    success = true;
                    // Wait 15 seconds after success to cool down
                    await new Promise(r => setTimeout(r, 15000));
                } catch (err) {
                    attempt++;
                    const is429 = err.message && err.message.includes('429');
                    console.warn(`⚠️ Error for ${event.eventName}: ${err.message}`);
                    if (is429) {
                        console.log('⏳ Rate limit hit. Waiting 60 seconds before choosing to retry...');
                        await new Promise(r => setTimeout(r, 60000));
                    } else {
                        console.log('⏳ Other error. Waiting 10 seconds...');
                        await new Promise(r => setTimeout(r, 10000));
                    }
                }
            }
        }
        console.log('🏁 Slow Sync Finished.');
        process.exit(0);
    } catch (e) {
        console.error('Fatal:', e);
        process.exit(1);
    }
}

slowSync();
