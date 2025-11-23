import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// Initialize Gemini AI (lazy initialization)
let genAI = null;
function getGenAI() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    const key = process.env.GEMINI_API_KEY.trim();
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

// Fetch real places from Google Places API
async function fetchPlacesData(destination, type = 'tourist_attraction') {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query: `${type} in ${destination}`,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    return response.data.results.slice(0, 15).map(place => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating || 4.0,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
      types: place.types,
    }));
  } catch (error) {
    console.error(`Error fetching ${type}:`, error.message);
    return [];
  }
}

// Generate itinerary using Gemini AI
export async function generateAIItinerary(trip) {
  const { destination, startDate, endDate, itinerary: currentItinerary, hotelPreference, hotelBudgetMin, hotelBudgetMax } = trip;

  // Calculate duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  console.log(`🤖 Fetching real data for ${destination}...`);

  // Fetch real data from Google Places
  const [attractions, restaurants, hotels] = await Promise.all([
    fetchPlacesData(destination, 'tourist_attraction'),
    fetchPlacesData(destination, 'restaurant'),
    fetchPlacesData(destination, 'hotel'),
  ]);

  console.log(`✅ Found ${attractions.length} attractions, ${restaurants.length} restaurants, ${hotels.length} hotels`);

  // Construct a summary of the current plan to send to Gemini
  const currentPlanSummary = currentItinerary ? currentItinerary.map(day => ({
    day: day.day,
    activities: day.activities.map(a => a.activity).join(', ')
  })) : [];

  // Create prompt for Gemini
  const prompt = `You are a professional travel planner. I have a ${duration}-day trip to ${destination}.
  
  **Current Plan Status:**
  ${JSON.stringify(currentPlanSummary, null, 2)}

  **Goal:**
  Fill in the empty days or gaps in the itinerary with logical, geographically efficient activities. 
  DO NOT duplicate activities that are already planned.
  
  **Trip Details:**
  - Destination: ${destination}
  - Duration: ${duration} days (${new Date(startDate).toDateString()} to ${new Date(endDate).toDateString()})
  - Hotel Preference: ${hotelPreference} (Budget: ₹${hotelBudgetMin} - ₹${hotelBudgetMax})
  
  **Available Real Places (Use these primarily):**
  Attractions: ${attractions.map(a => a.name).join(', ')}
  Restaurants: ${restaurants.map(r => r.name).join(', ')}
  Hotels: ${hotels.map(h => h.name).join(', ')}

  **Output Format:**
  Return a JSON object with the FULL itinerary (including existing plans if they were good, or improved versions) and a budget breakdown.
  Structure:
  {
    "itinerary": [
      {
        "day": 1,
        "title": "Theme of the day",
        "activities": [
          {
            "time": "09:00 AM",
            "activity": "Name of activity",
            "location": "Name of place",
            "duration": "2 hours",
            "cost": 100,
            "description": "A short, engaging paragraph describing the place and why it's worth visiting."
          }
        ],
        "meals": [],
        "accommodation": {}
      }
    ],
    "budget": { "total": 0, "breakdown": {} }
  }
  
  IMPORTANT:
  - Write unique, engaging descriptions for each activity.
  - Ensure logical flow (morning -> afternoon -> evening).
  - Return ONLY valid JSON.`;

  try {
    console.log('🤖 Generating itinerary with Gemini AI...');
    const ai = getGenAI();
    if (!ai) {
      throw new Error('Gemini API not initialized');
    }
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const aiResponse = JSON.parse(text);

    // Enrich with coordinates
    aiResponse.itinerary.forEach(day => {
      day.date = new Date(start);
      day.date.setDate(start.getDate() + (day.day - 1));

      day.activities.forEach(activity => {
        const attraction = attractions.find(a =>
          a.name.toLowerCase().includes(activity.location.toLowerCase()) ||
          activity.location.toLowerCase().includes(a.name.toLowerCase())
        );
        if (attraction) {
          activity.coordinates = attraction.coordinates;
        }
      });
    });

    console.log('✅ AI itinerary generated successfully!');
    return {
      itinerary: aiResponse.itinerary,
      budget: aiResponse.budget,
      duration,
    };
  } catch (error) {
    console.error('❌ Error generating AI itinerary:', error.message);
    throw error;
  }
}
