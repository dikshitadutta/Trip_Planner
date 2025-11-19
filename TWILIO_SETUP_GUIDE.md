# Twilio Setup Guide - Get FREE $15 SMS Credits

## 🎉 Why Twilio?
- ✅ **$15 FREE credits** (no payment required)
- ✅ ~1000 FREE SMS messages
- ✅ Works worldwide (including India)
- ✅ 5-minute setup
- ✅ Excellent documentation
- ✅ Reliable delivery

---

## 📱 Step-by-Step Setup

### Step 1: Sign Up for Twilio
1. Go to: **https://www.twilio.com/try-twilio**
2. Click **"Sign up for free"** or **"Start for free"**
3. Fill in the form:
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Email**: Your email address
   - **Password**: Create a strong password
4. Click **"Start your free trial"**

### Step 2: Verify Your Email
1. Check your email inbox
2. Click the verification link from Twilio
3. You'll be redirected to Twilio Console

### Step 3: Verify Your Phone Number
1. Twilio will ask you to verify your phone number
2. Enter your **Indian mobile number** (with +91)
   - Example: +919876543210
3. Choose **"Text me"** or **"Call me"**
4. Enter the verification code you receive
5. Click **"Submit"**

### Step 4: Answer Quick Questions
Twilio will ask a few questions:
- **Which product?** → Choose "SMS"
- **What do you want to build?** → Choose "Alerts & Notifications"
- **How do you want to build?** → Choose "With code"
- **What language?** → Choose "Node.js"

Click **"Get Started"**

### Step 5: Get Your Twilio Phone Number
1. You'll see a screen saying **"Get a Trial Number"**
2. Click **"Get a Trial Number"**
3. Twilio will assign you a FREE phone number
4. **Copy this number** (it looks like: +1234567890)
5. Click **"Choose this Number"**

### Step 6: Get Your Credentials
1. You're now on the Twilio Console Dashboard
2. Look for the **"Account Info"** section (usually on the right side)
3. You'll see:
   - **Account SID**: Starts with "AC..." (copy this)
   - **Auth Token**: Click "Show" to reveal it (copy this)

**Important:** Keep these credentials secret!

### Step 7: Add Your Phone to Verified Numbers
**This is important for trial accounts!**

1. In Twilio Console, go to **"Phone Numbers"** → **"Manage"** → **"Verified Caller IDs"**
2. Click **"Add a new Caller ID"** (red plus button)
3. Enter your **Indian mobile number** (the one you want to receive OTP on)
   - Format: +919876543210
4. Choose verification method: **"Text you"** or **"Call you"**
5. Enter the verification code
6. Your number is now verified!

**Note:** Trial accounts can only send SMS to verified numbers. This is a Twilio security feature.

### Step 8: Update Your Project
1. Open your project folder
2. Go to: `server/.env`
3. Update these lines:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Example:**
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 9: Restart Your Server
1. Stop the server (Ctrl+C)
2. Start it again: `npm run dev`
3. You should see: `✅ Twilio client initialized`

### Step 10: Test It!
1. Go to: http://localhost:5173/
2. Fill the form to Step 4 (Login)
3. Enter your **verified phone number** (the one you added in Step 7)
4. Click **"Send OTP"**
5. **You should receive an SMS!** 📱

---

## 🔍 Where to Find Everything

### Twilio Console Dashboard
```
https://console.twilio.com/

Dashboard
├── Account Info (right side)
│   ├── Account SID ← Copy this
│   └── Auth Token ← Copy this
│
├── Phone Numbers (left menu)
│   ├── Manage
│   │   ├── Active Numbers ← Your Twilio number
│   │   └── Verified Caller IDs ← Add your phone here
│   └── Buy a Number
│
└── Usage (left menu)
    └── See your remaining credits
```

---

## 💰 Free Credits Info

- **Trial Credits**: $15.00
- **SMS Cost**: ~$0.0075 per SMS to India
- **Total SMS**: ~2000 messages
- **Expiration**: Credits don't expire during trial
- **Upgrade**: Can upgrade anytime for more credits

---

## ⚠️ Trial Account Limitations

1. **Verified Numbers Only**: Can only send to numbers you've verified
2. **Twilio Branding**: SMS will have "Sent from your Twilio trial account" prefix
3. **No Toll-Free**: Can't use toll-free numbers
4. **Rate Limits**: Limited to prevent abuse

**To remove limitations:** Upgrade account (add payment method)

---

## 🐛 Troubleshooting

### "Phone number not verified"
- ✅ Go to Phone Numbers → Verified Caller IDs
- ✅ Add your phone number
- ✅ Verify with code

### "Invalid credentials"
- ✅ Check Account SID starts with "AC"
- ✅ Check Auth Token is correct (no spaces)
- ✅ Restart server after updating .env

### "Invalid phone number"
- ✅ Use format: +919876543210 (with +91)
- ✅ No spaces or dashes
- ✅ Must be verified in Twilio console

### "Not receiving SMS"
- ✅ Check phone number is verified
- ✅ Check Twilio phone number is correct
- ✅ Check server logs for errors
- ✅ Check Twilio console for delivery status

---

## 📊 Check SMS Delivery

1. Go to Twilio Console
2. Click **"Monitor"** → **"Logs"** → **"Messaging"**
3. See all sent messages and their status
4. Check for errors or delivery failures

---

## 🚀 Production Tips

When ready for production:
1. **Upgrade account** (add payment method)
2. **Remove trial limitations**
3. **Buy more credits** (very affordable)
4. **Get a dedicated phone number**
5. **Set up webhooks** for delivery status

---

## 💡 Quick Reference

**Twilio Console**: https://console.twilio.com/
**Documentation**: https://www.twilio.com/docs/sms
**Pricing**: https://www.twilio.com/sms/pricing
**Support**: https://support.twilio.com/

---

## ✅ Setup Checklist

- [ ] Signed up on Twilio
- [ ] Verified email
- [ ] Verified phone number
- [ ] Got trial phone number
- [ ] Copied Account SID
- [ ] Copied Auth Token
- [ ] Copied Twilio phone number
- [ ] Added my phone to Verified Caller IDs
- [ ] Updated server/.env file
- [ ] Restarted server
- [ ] Tested and received SMS! 🎉

---

## 🎓 Next Steps

After setup:
1. Test with different phone numbers (add them to verified list)
2. Monitor usage in Twilio console
3. Check delivery reports
4. When ready, upgrade for production use

**Enjoy your FREE SMS OTP system!** 📱✨
