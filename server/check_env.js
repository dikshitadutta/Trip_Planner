import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.log('❌ GEMINI_API_KEY is not set in .env file');
} else {
    console.log('✅ GEMINI_API_KEY is set');
    console.log(`   Length: ${key.length} characters`);
    console.log(`   First 6 chars: ${key.substring(0, 6)}`);
    console.log(`   Last 4 chars: ...${key.substring(key.length - 4)}`);

    // Check for common issues
    if (key.includes('YOUR_') || key.includes('your_') || key.includes('here')) {
        console.log('⚠️  WARNING: This looks like a placeholder key!');
        console.log('   Please replace it with a real API key from https://aistudio.google.com/app/apikey');
    } else if (!key.startsWith('AIza')) {
        console.log('⚠️  WARNING: Gemini API keys typically start with "AIza"');
        console.log('   Your key starts with: ' + key.substring(0, 6));
    } else if (key.length < 35 || key.length > 45) {
        console.log('⚠️  WARNING: Gemini API keys are typically 39 characters long');
        console.log('   Your key is: ' + key.length + ' characters');
    } else {
        console.log('✅ Key format looks valid!');
    }
}
