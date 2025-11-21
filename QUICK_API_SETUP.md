# 🚀 Quick API Setup Guide (5 Minutes)

## Step 1: Unsplash API (Images) - 2 minutes

1. Go to: **https://unsplash.com/developers**
2. Click **"Register as a developer"**
3. Create a **New Application**
4. Accept terms
5. Copy your **Access Key**
6. Add to `server/.env`:
   ```
   UNSPLASH_ACCESS_KEY=your_key_here
   ```

**Limits:** 50 requests/hour FREE

---

## Step 2: OpenWeatherMap API (Weather) - 2 minutes

1. Go to: **https://openweathermap.org/api**
2. Click **"Sign Up"** (top right)
3. Verify your email
4. Go to **API keys** tab
5. Copy your **API key**
6. Add to `server/.env`:
   ```
   OPENWEATHER_API_KEY=your_key_here
   ```

**Limits:** 1000 calls/day FREE

---

## Step 3: Google Maps API (Maps) - 3 minutes

1. Go to: **https://console.cloud.google.com/**
2. Create a **New Project**
3. Go to **APIs & Services** → **Library**
4. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
5. Go to **Credentials** → **Create Credentials** → **API Key**
6. Copy your **API Key**
7. Add to `server/.env`:
   ```
   GOOGLE_MAPS_API_KEY=your_key_here
   ```

**Limits:** $200 FREE credit/month

---

## Step 4: Restart Server

```bash
cd server
npm run dev
```

---

## ✅ Test It!

Create a new trip and you'll see:
- ✨ Real destination images
- 📚 Wikipedia descriptions
- 🌤️ Weather forecasts
- 🗺️ Interactive maps (coming next)

---

## 🆓 All FREE!

- No credit card required
- Perfect for development
- Generous free tiers
- Upgrade only when needed

**Total setup time: ~7 minutes**
**Total cost: $0**
