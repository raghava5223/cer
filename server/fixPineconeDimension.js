const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

async function fixIndex() {
    try {
        console.log('🛠️ [Pinecone Fix] Initializing client...');
        const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const indexName = process.env.PINECONE_INDEX || 'collegeevent';

        console.log(`🔍 [Pinecone Fix] Checking index: ${indexName}`);
        const indexes = await pc.listIndexes();
        const exists = indexes.indexes.find(i => i.name === indexName);

        if (exists) {
            console.log(`🗑️ [Pinecone Fix] Deleting existing index (Found ${exists.dimension}d)...`);
            await pc.deleteIndex(indexName);
            console.log('✅ Deleted. Waiting 10s for propagation...');
            await new Promise(r => setTimeout(r, 10000));
        }

        console.log(`🆕 [Pinecone Fix] Creating new index: ${indexName} with 768 dimensions...`);
        await pc.createIndex({
            name: indexName,
            dimension: 768,
            metric: 'cosine',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            }
        });

        console.log('🚀 [Pinecone Fix] Index creation initiated. This may take a minute...');
        
        let ready = false;
        while (!ready) {
            const desc = await pc.describeIndex(indexName);
            if (desc.status.ready) {
                console.log('🎉 [Pinecone Fix] Index is READY with 768d!');
                ready = true;
            } else {
                console.log(`⏳ Waiting... (State: ${desc.status.state})`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ [Pinecone Fix] FAILED:', error.message);
        process.exit(1);
    }
}

fixIndex();
