const { GoogleGenerativeAI } = require('@google/generative-ai');
const Event = require('../models/Event');
const { generateEmbedding } = require('../services/embeddingService');
const { queryPinecone } = require('../services/pineconeService');

const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('YOUR_')) {
            return res.status(500).json({ message: '⚠️ AI configuration error. Missing or invalid Gemini API key.' });
        }
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // --- RAG INTEGRATION START ---
        let retrievedContext = '';
        try {
            console.log(`[AI Controller] Fetching context for: "${message.substring(0, 30)}..."`);
            const embedding = await generateEmbedding(message);
            retrievedContext = await queryPinecone(embedding);
            console.log('[AI Controller] Context retrieved successfully.');
        } catch (ragError) {
            console.error('[AI Controller] RAG Fallback triggered due to error:', ragError.message);
        }
        // --- RAG INTEGRATION END ---

        const events = await Event.find({}).lean();
        const eventSummary = events.length === 0
            ? 'No events are currently listed.'
            : events.map((e, i) =>
                `Event ${i + 1}:
- Name: ${e.eventName}
- Type: ${e.eventName.toLowerCase().includes('hack') ? 'Hackathon' : e.eventName.toLowerCase().includes('sport') ? 'Sports' : 'Cultural/Technical'}
- Date & Time: ${new Date(e.date).toDateString()} at ${e.time}
- Venue: ${e.venue}
- Registration Fee: ₹${e.fees}
- Seats: ${e.studentEnrollmentLimit - e.currentEnrollmentCount} available
- Description: ${e.description}`
            ).join('\n\n');

        const systemInstruction = `You are CerSafe AI, a professional and highly focused assistant for the College Event Registration Portal.

STRICT MISSION:
Your ONLY purpose is to provide detailed and accurate information about college events (rules, registration, fees, prizes, schedules) based ON THE PROVIDED DATA.

KNOWLEDGE BASE CONTEXT (Retrieved via RAG):
${retrievedContext || "No background details found for this specific query."}

LIVE PORTAL STATUS (Actual Database):
${eventSummary}

IMPORTANT CONSTRAINTS:
1. ONLY answer questions about college events. Do not provide information about general topics, coding, or other subjects.
2. If a user asks something unrelated to events, politely reply: "I'm sorry, I am specifically designed to help with college event details. Please ask me about our upcoming hackathons, cultural fests, or registration rules!"
3. Use the RAG context for deep details (rules/prizes) and the LIVE PORTAL STATUS for dates and availability.
4. Be professional, polite, and concise.
5. Provide information in well-structured markdown.

Today's Date: ${new Date().toDateString()}
`;
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-flash-latest',
            systemInstruction: systemInstruction 
        });

        const formattedHistory = (history || [])
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }]
            }));

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.1, // Lower temperature for more accurate RAG responses
            }
        });

        let responseText = '';
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
            try {
                const result = await chat.sendMessage([{ text: message }]);
                responseText = result.response.text();
                break; 
            } catch (apiError) {
                const isRetryable = apiError.message && (apiError.message.includes('429') || apiError.message.includes('quota') || apiError.message.includes('500'));
                if (isRetryable && retries < maxRetries - 1) {
                    const waitTime = Math.pow(2, retries) * 1500;
                    console.warn(`[AI Controller] API busy. Retrying in ${waitTime}ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    retries++;
                    continue;
                }
                throw apiError; 
            }
        }

        res.json({ reply: responseText });
    } catch (error) {
        console.error('Final AI Controller Error:', error);
        
        // Log detailed error to a file for debugging
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(__dirname, '../logs/ai_error.log');
        if (!fs.existsSync(path.join(__dirname, '../logs'))) {
            fs.mkdirSync(path.join(__dirname, '../logs'));
        }
        const logMessage = `[${new Date().toISOString()}] Error: ${error.message}\nStack: ${error.stack}\n\n`;
        fs.appendFileSync(logPath, logMessage);

        res.status(500).json({ message: '❌ AI technical error. Please check your connectivity and API limits.' });
    }
};

module.exports = { chatWithAI };
