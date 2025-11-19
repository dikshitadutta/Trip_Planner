# SMS OTP Setup Guide

## Option 1: Fast2SMS (Recommended for India - FREE)

### Steps:
1. Go to https://www.fast2sms.com/
2. Sign up with your email and phone number
3. Verify your account
4. Go to Dashboard → Dev API
5. Copy your API Key
6. Add to `server/.env`:
   ```
   FAST2SMS_API_KEY=your_actual_api_key_here
   ```
7. Restart the server

### Free Credits:
- Fast2SMS gives free credits for testing
- You can send OTPs to any Indian mobile number

---

## Option 2: Twilio (International - FREE Trial)

### Steps:
1. Go to https://www.twilio.com/try-twilio
2. Sign up and verify your phone
3. Get your Account SID, Auth Token, and Twilio Phone Number
4. Install: `npm install twilio`
5. Update `server/index.js` to use Twilio instead

### Code for Twilio:
```javascript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (phone, otp) => {
  try {
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}` // Add country code
    });
    return { success: true };
  } catch (error) {
    console.error('Twilio Error:', error);
    return { success: false };
  }
};
```

---

## Option 3: MSG91 (India - FREE Trial)

### Steps:
1. Go to https://msg91.com/
2. Sign up and get API key
3. Similar setup to Fast2SMS

---

## Testing Without SMS (Current Setup)

If you don't add an API key:
- OTP will be shown in browser alert (development mode)
- OTP will be logged in server console
- You can still test the full flow

---

## Production Recommendations:
- Use environment variables for API keys
- Never commit API keys to git
- Add rate limiting to prevent abuse
- Use Redis for OTP storage instead of in-memory
- Implement phone number verification
- Add CAPTCHA before sending OTP
