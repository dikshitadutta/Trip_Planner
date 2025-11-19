# Fast2SMS API Key Setup - Step by Step Guide

## 📱 Get FREE SMS Credits for OTP

### Step 1: Sign Up
1. Go to: **https://www.fast2sms.com/**
2. Click on **"Sign Up"** or **"Register"** button (top right)
3. Fill in the registration form:
   - **Name**: Your name
   - **Email**: Your email address
   - **Mobile**: Your 10-digit Indian mobile number
   - **Password**: Create a strong password
4. Click **"Register"** or **"Sign Up"**

### Step 2: Verify Your Account
1. Check your **email inbox** for verification email from Fast2SMS
2. Click the **verification link** in the email
3. You'll also receive an **SMS verification code** on your mobile
4. Enter the SMS code on the Fast2SMS website to verify your phone

### Step 3: Get Your API Key
1. After verification, **login** to Fast2SMS dashboard
2. On the left sidebar, look for **"Dev API"** or **"API"** section
3. Click on **"Dev API"**
4. You'll see your **API Key** displayed on the page
   - It looks like: `iIrK3XTUYVnPHvdqW1pRoQasD5ZzuAFCwm84flOb2Ntc6xJyjB`
   - It's a long string of random characters (around 50-60 characters)

### Step 4: Copy Your API Key
1. Click the **"Copy"** button next to your API key
2. Or manually select and copy the entire key

### Step 5: Add to Your Project
1. Open your project folder
2. Navigate to: `server/.env`
3. Find the line: `FAST2SMS_API_KEY=your_fast2sms_api_key_here`
4. Replace `your_fast2sms_api_key_here` with your actual API key
5. Save the file

**Example:**
```env
FAST2SMS_API_KEY=iIrK3XTUYVnPHvdqW1pRoQasD5ZzuAFCwm84flOb2Ntc6xJyjB
```

### Step 6: Restart Your Server
1. Stop the server (Ctrl+C in terminal)
2. Start it again: `npm run dev`
3. You should see: `Server running on port 3001`

### Step 7: Test SMS
1. Go to your app: http://localhost:5173/
2. Fill the form and reach Step 4 (Login)
3. Enter your **Indian mobile number** (10 digits)
4. Click **"Send OTP"**
5. **You should receive an SMS** with the OTP on your phone! 📱

---

## 💰 Free Credits

Fast2SMS gives you **FREE credits** when you sign up:
- Usually **10-50 free SMS** for testing
- Perfect for development and testing
- No credit card required

---

## 🔍 Where to Find API Key (Visual Guide)

After logging in to Fast2SMS:

```
Dashboard
├── Left Sidebar
│   ├── Dashboard
│   ├── Send SMS
│   ├── Reports
│   ├── Dev API  ← Click here!
│   │   └── Your API Key will be displayed here
│   ├── Pricing
│   └── Settings
```

On the **Dev API** page, you'll see:
- **API Key**: [Your long API key string] [Copy Button]
- **API Documentation**: Links to docs
- **Test API**: Option to test your API

---

## ⚠️ Important Notes

1. **Keep your API key secret** - Don't share it publicly
2. **Don't commit to Git** - The `.env` file should be in `.gitignore`
3. **Indian numbers only** - Fast2SMS works only with Indian mobile numbers (+91)
4. **10-digit format** - Enter numbers without +91 (e.g., 9876543210)
5. **Check credits** - Monitor your free credits in the dashboard

---

## 🐛 Troubleshooting

### "SMS not sending"
- ✅ Check if API key is correct (no extra spaces)
- ✅ Verify your Fast2SMS account is activated
- ✅ Check if you have remaining credits
- ✅ Ensure phone number is 10 digits (Indian number)
- ✅ Restart the server after adding API key

### "Invalid API Key"
- ✅ Copy the entire key (it's very long)
- ✅ No spaces before or after the key
- ✅ Check if account is verified

### "No credits"
- ✅ Login to Fast2SMS dashboard
- ✅ Check "Credits" or "Balance" section
- ✅ You can buy more credits if needed (very cheap)

---

## 📞 Alternative: Test Without SMS

If you don't want to set up Fast2SMS right now:
- The OTP will be shown in **browser alert**
- Also logged in **server console**
- You can still test the complete flow
- Just copy the OTP from alert/console

---

## 🚀 Production Tips

For production deployment:
1. Buy credits on Fast2SMS (very affordable)
2. Use environment variables for API key
3. Add rate limiting (max 3 OTP per hour per number)
4. Add CAPTCHA before sending OTP
5. Monitor SMS delivery rates

---

## 📧 Need Help?

- Fast2SMS Support: support@fast2sms.com
- Fast2SMS Docs: https://docs.fast2sms.com/
- Check their FAQ section on the website

---

## ✅ Quick Checklist

- [ ] Signed up on Fast2SMS
- [ ] Verified email
- [ ] Verified phone number
- [ ] Found API key in Dev API section
- [ ] Copied API key
- [ ] Pasted in `server/.env` file
- [ ] Restarted server
- [ ] Tested with real phone number
- [ ] Received SMS! 🎉
