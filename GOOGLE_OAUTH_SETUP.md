# 🔐 Google OAuth Setup Guide

## Quick Setup (5 minutes)

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     ```
     http://localhost:3001/api/auth/google/callback
     ```
   - Add authorized JavaScript origins:
     ```
     http://localhost:3001
     http://localhost:5173
     ```

5. Copy your credentials:
   - Client ID
   - Client Secret

### 2. Update Environment Variables

Add to `server/.env`:
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
SESSION_SECRET=your-random-secret-key-here
```

### 3. Restart Server

```bash
cd server
npm start
```

## ✅ What Changed

- ❌ Removed phone OTP authentication (Twilio)
- ✅ Added Google OAuth (free, secure, trusted)
- ✅ Users can now login with their Google account
- ✅ No SMS costs or country restrictions
- ✅ Better user experience

## 🎯 Benefits

- **Free**: No API costs
- **Secure**: Google handles authentication
- **Fast**: One-click login
- **Trusted**: Users already have Google accounts
- **No Phone Required**: Works globally

## 🧪 Testing

1. Start both servers
2. Go to http://localhost:5173
3. Fill out the travel form
4. Click "Continue with Google" on step 4
5. Login with your Google account
6. You'll be redirected back with your trip created!

## 🔒 Production Setup

For production, update:
1. Authorized redirect URIs to your production domain
2. Change SESSION_SECRET to a strong random string
3. Set NODE_ENV=production
