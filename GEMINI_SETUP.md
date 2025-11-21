# 🤖 Gemini AI Setup Guide (FREE!)

## Why Gemini + Google Places?

**Perfect Combination:**
- 🆓 **Gemini AI** - FREE (15 requests/min, 1500/day)
- 🆓 **Google Places API** - FREE tier available
- 🎯 **Real Data** - Actual attractions, restaurants, hotels
- 🧠 **Smart Planning** - AI creates personalized itineraries
- 💰 **Cost**: $0 for most usage!

## Quick Setup (2 minutes)

### 1. Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your API key

### 2. Enable Google Places API

1. Go to https://console.cloud.google.com/
2. Select your project (same one with Google Maps)
3. Go to "APIs & Services" > "Library"
4. Search for "Places API"
5. Click "Enable"

### 3. Add to .env

Update `server/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_MAPS_API_KEY=your_existing_maps_key
```

### 4. Restart Server

```bash
cd server
npm start
```

## How It Works

1. **User fills form** → Destination, dates, preferences
2. **Google Places API** → Fetches real attractions, restaurants, hotels
3. **Gemini AI** → Creates personalized itinerary using real data
4. **Result** → Accurate, customized trip plan!

## Features

✅ Real attractions with ratings and coordinates
✅ Actual restaurants from the destination
✅ Real hotels within budget
✅ Personalized based on:
   - Activity preferences
   - Group type (solo, couple, family, friends)
   - Budget range
   - Trip duration

## Free Tier Limits

**Gemini AI:**
- 15 requests per minute
- 1,500 requests per day
- More than enough for most apps!

**Google Places API:**
- First $200/month FREE
- ~$17 per 1000 requests
- You get ~11,000 free requests/month

## Fallback

If API keys are missing or limits exceeded:
- Falls back to template-based generation
- Still works, just less accurate

## Cost Estimate

For 100 itineraries/day:
- Gemini: $0 (within free tier)
- Places API: ~$5/month (3 requests per itinerary)
- **Total: ~$5/month** 🎉

Much better than OpenAI GPT-4 (~$50/month for same usage)!
