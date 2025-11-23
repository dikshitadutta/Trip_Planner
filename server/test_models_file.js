import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);

    const modelsToTest = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-001',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.0-pro'
    ];

    let output = 'Model Test Results:\n';

    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            await model.generateContent('Hello');
            output += `✅ ${modelName}: WORKING\n`;
        } catch (error) {
            output += `❌ ${modelName}: FAILED (${error.message.substring(0, 50)}...)\n`;
        }
    }

    fs.writeFileSync('model_test_results.txt', output);
    console.log('Test complete. Results saved to model_test_results.txt');
}

listModels();
