# 🚀 Complete API Integration Guide for Real-Life Itinerary

## 📍 1. Maps & Location APIs

### Google Maps Platform (Recommended)
**What you get:**
- Interactive maps with markers
- Route planning & directions
- Distance calculations
- Place details & photos
- Street view

**Setup:**
1. Go to: https://console.cloud.google.com/
2. Create new project
3. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Distance Matrix API
   - Geocoding API
4. Get API key
5. Add to `.env`: `GOOGLE_MAPS_API_KEY=your_key`

**Pricing:** $200 free credit/month

**Alternative: Mapbox**
- More customizable
- Better pricing for high volume
- https://www.mapbox.com/

---

## ✈️ 2. Flight Search & Booking APIs

### Amadeus API (Best for Flights)
**What you get:**
- Real-time flight search
- Price comparison
- Booking capabilities
- Flight status
- Airport information

**Setup:**
1. Go to: https://developers.amadeus.com/
2. Sign up for free account
3. Get API key & secret
4. Test environment: 2000 free API calls/month
5. Add to `.env`:
```
AMADEUS_API_KEY=your_key
AMADEUS_API_SECRET=your_secret
```

**Alternative: Skyscanner API**
- https://rapidapi.com/skyscanner/api/skyscanner-flight-search

---

## 🏨 3. Hotel Search & Booking APIs

### Booking.com API
**What you get:**
- Hotel search
- Real-time availability
- Prices & reviews
- Photos
- Booking capabilities

**Setup:**
1. Apply at: https://www.booking.com/affiliate-program
2. Get affiliate partner access
3. API documentation: https://developers.booking.com/

**Alternative: Hotels.com API**
- Via RapidAPI: https://rapidapi.com/apidojo/api/hotels4

**Alternative: Airbnb (Unofficial)**
- Via RapidAPI: https://rapidapi.com/3b-data-3b-data-default/api/airbnb13

---

## 🚂 4. Train & Transport APIs

### Rome2rio API
**What you get:**
- Multi-modal transport options
- Trains, buses, ferries
- Duration & pricing
- Route planning

**Setup:**
1. Go to: https://www.rome2rio.com/api/
2. Request API access
3. Get API key

**For India: IRCTC API**
- Train booking in India
- https://www.irctc.co.in/

---

## 🎭 5. Activities & Attractions APIs

### GetYourGuide API
**What you get:**
- Tours & activities
- Tickets for attractions
- Reviews & ratings
- Booking capabilities

**Setup:**
1. Partner program: https://partner.getyourguide.com/
2. Get API access

**Alternative: Viator API (TripAdvisor)**
- https://www.viator.com/partners

**Alternative: Google Places API**
- Tourist attractions
- Reviews & ratings
- Photos
- Opening hours

---

## 🖼️ 6. Destination Images & Information

### Unsplash API (FREE Images)
**What you get:**
- High-quality destination photos
- Free to use
- 50 requests/hour free

**Setup:**
1. Go to: https://unsplash.com/developers
2. Create app
3. Get access key
4. Add to `.env`: `UNSPLASH_ACCESS_KEY=your_key`

**Code Example:**
```javascript
const searchImages = async (destination) => {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${destination}&client_id=${UNSPLASH_KEY}`
  )
  const data = await response.json()
  return data.results[0]?.urls.regular
}
```

**Alternative: Pexels API**
- https://www.pexels.com/api/
- Also free with good limits

---

## 📰 7. Destination Information & Articles

### Wikipedia API (FREE)
**What you get:**
- Destination descriptions
- Historical information
- Free & unlimited

**Code Example:**
```javascript
const getDestinationInfo = async (destination) => {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${destination}`
  )
  const data = await response.json()
  return {
    description: data.extract,
    image: data.thumbnail?.source
  }
}
```

**Alternative: OpenTripMap API**
- Tourist attractions info
- https://opentripmap.io/
- Free tier: 1000 requests/day

---

## 🌤️ 8. Weather Information

### OpenWeatherMap API
**What you get:**
- Current weather
- 7-day forecast
- Historical data

**Setup:**
1. Go to: https://openweathermap.org/api
2. Sign up free
3. Get API key
4. 1000 calls/day free

---

## 💱 9. Currency Conversion

### ExchangeRate-API (FREE)
**What you get:**
- Real-time exchange rates
- 1500 requests/month free

**Setup:**
1. Go to: https://www.exchangerate-api.com/
2. Get free API key

---

## 🗺️ 10. Route Planning & Distance

### Google Directions API
**What you get:**
- Turn-by-turn directions
- Distance & duration
- Multiple waypoints
- Different travel modes

**Code Example:**
```javascript
const getRoute = async (origin, destination) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/directions/json?` +
    `origin=${origin}&destination=${destination}&` +
    `key=${GOOGLE_MAPS_KEY}`
  )
  return await response.json()
}
```

---

## 📊 Priority Implementation Order

### Phase 1: Essential (Start Here)
1. ✅ **Google Maps API** - Map display & markers
2. ✅ **Unsplash API** - Destination images
3. ✅ **Wikipedia API** - Destination info
4. ✅ **OpenWeatherMap** - Weather data

### Phase 2: Booking & Search
5. **Amadeus API** - Flight search
6. **Booking.com API** - Hotel search
7. **GetYourGuide API** - Activities

### Phase 3: Enhanced Features
8. **Google Directions API** - Route planning
9. **ExchangeRate API** - Currency conversion
10. **Rome2rio API** - Transport options

---

## 💰 Cost Breakdown (Monthly)

**FREE Tier (Good for Development):**
- Google Maps: $200 credit (covers ~28,000 map loads)
- Unsplash: 50 requests/hour
- Wikipedia: Unlimited
- OpenWeatherMap: 1000 calls/day
- **Total: $0**

**Production (Paid):**
- Google Maps: ~$50-200/month
- Amadeus: ~$100-500/month
- Booking.com: Commission-based
- **Total: ~$150-700/month**

---

## 🔧 Implementation Example

### 1. Install Dependencies
```bash
npm install axios
```

### 2. Create API Service
```javascript
// server/services/externalAPIs.js

import axios from 'axios';

export const getDestinationImages = async (destination) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/search/photos`,
      {
        params: {
          query: destination,
          per_page: 5
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    return response.data.results.map(img => img.urls.regular);
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

export const getDestinationInfo = async (destination) => {
  try {
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${destination}`
    );
    return {
      description: response.data.extract,
      fullDescription: response.data.extract_html,
      image: response.data.thumbnail?.source,
      url: response.data.content_urls?.desktop?.page
    };
  } catch (error) {
    console.error('Error fetching destination info:', error);
    return null;
  }
};

export const getWeather = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast`,
      {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};
```

---

## 🎯 Quick Start Checklist

- [ ] Sign up for Google Maps Platform
- [ ] Get Unsplash API key
- [ ] Test Wikipedia API (no key needed)
- [ ] Get OpenWeatherMap API key
- [ ] Add all keys to `.env`
- [ ] Install axios: `npm install axios`
- [ ] Create API service file
- [ ] Test each API endpoint
- [ ] Integrate into itinerary generator

---

## 🔐 Security Best Practices

1. **Never commit API keys** - Use `.env` files
2. **Use environment variables** - Different keys for dev/prod
3. **Implement rate limiting** - Prevent abuse
4. **Cache API responses** - Reduce costs
5. **Handle errors gracefully** - Fallback to defaults
6. **Monitor usage** - Set up billing alerts

---

## 📚 Additional Resources

- **Google Maps Documentation**: https://developers.google.com/maps/documentation
- **Amadeus Self-Service**: https://developers.amadeus.com/self-service
- **RapidAPI Hub**: https://rapidapi.com/hub (Many travel APIs)
- **Travel API Comparison**: https://www.programmableweb.com/category/travel

---

## 🎨 Next Steps

1. Start with Phase 1 APIs (Maps, Images, Info, Weather)
2. Build the enhanced dashboard with real data
3. Add Phase 2 APIs for booking features
4. Implement caching to reduce API costs
5. Add error handling and loading states
6. Test with real destinations

**Ready to implement? Let's start with Google Maps integration!**
