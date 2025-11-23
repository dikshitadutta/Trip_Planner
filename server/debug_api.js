import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.error('No API Key found');
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

console.log('Fetching models from:', url.replace(key, 'HIDDEN_KEY'));

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error('API Error:', JSON.stringify(json.error, null, 2));
            } else if (json.models) {
                console.log('✅ Available Models:');
                json.models.forEach(m => {
                    if (m.name.includes('gemini')) {
                        console.log(` - ${m.name.replace('models/', '')} (${m.supportedGenerationMethods.join(', ')})`);
                    }
                });
            } else {
                console.log('Unexpected response:', data);
            }
        } catch (e) {
            console.error('Parse error:', e);
            console.log('Raw data:', data);
        }
    });
}).on('error', (e) => {
    console.error('Request error:', e);
});
