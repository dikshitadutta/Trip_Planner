import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error('❌ GEMINI_API_KEY not found');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        // There isn't a direct listModels method on the main class in the Node SDK usually exposed easily 
        // without using the model manager or making a direct REST call.
        // However, we can try a simple test with 'gemini-1.5-flash-001' or 'gemini-1.0-pro'.

        // Let's try to generate content with a few different model names to see which one works.
        const modelsToTest = [
            'gemini-1.5-flash',
            'gemini-1.5-flash-001',
            'gemini-1.5-pro',
            'gemini-pro',
            'gemini-1.0-pro'
        ];

        console.log('Testing available models...');

        for (const modelName of modelsToTest) {
            try {
                console.log(`\nTesting model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello, are you there?');
                const response = await result.response;
                console.log(`✅ SUCCESS: ${modelName} is working!`);
                console.log(`   Response: ${response.text().substring(0, 50)}...`);
                // If we find one that works, we can recommend it.
            } catch (error) {
                console.log(`❌ FAILED: ${modelName}`);
                console.log(`   Error: ${error.message.split('\n')[0]}`); // Print first line of error
            }
        }

    } catch (error) {
        console.error('❌ Error initializing:', error.message);
    }
}

listModels();
