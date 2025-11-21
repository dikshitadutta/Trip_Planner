import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// Initialize Gemini AI (lazy initialization)
let genAI = null;
function getGenAI() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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

    return response.data.results.slice(0, 10).map(place => ({
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
export async function generateAIItinerary(tripData) {
  const { destination, startDate, endDate, activityPreference, groupType, hotelPreference, hotelBudgetMin, hotelBudgetMax } = tripData;

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

  // Create prompt for Gemini
  const prompt = `You are a professional travel planner. Create a detailed ${duration}-day itinerary for ${destination}.

**Trip Details:**
- Destination: ${destination}
- Duration: ${duration} days (${startDate} to ${endDate})
- Group Type: ${groupType}
- Activity Preference: ${activityPreference}
- Hotel Preference: ${hotelPreference}
- Hotel Budget: ₹${hotelBudgetMin} - ₹${hotelBudgetMax} per night

**Available Attractions:**
${attractions.map((a, i) => `${i + 1}. ${a.name} (Rating: ${a.rating})`).join('\n')}

**Available Restaurants:**
${restaurants.map((r, i) => `${i + 1}. ${r.name} (Rating: ${r.rating})`).join('\n')}

**Available Hotels:**
${hotels.map((h, i) => `${i + 1}. ${h.name} (Rating: ${h.rating})`).join('\n')}

Create a JSON response with this EXACT structure:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Exploration",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Visit [attraction name]",
          "location": "[attraction name from list above]",
          "duration": "2 hours",
          "cost": 100,
          "description": "Brief description"
        }
      ],
      "meals": [
        {"name": "[restaurant from list]", "mealType": "breakfast", "cost": 200},
        {"name": "[restaurant from list]", "mealType": "lunch", "cost": 300},
        {"name": "[restaurant from list]", "mealType": "dinner", "cost": 400}
      ],
      "accommodation": {
        "name": "[hotel from list]",
        "hotelType": "${hotelPreference}",
        "cost": ${(hotelBudgetMin + hotelBudgetMax) / 2},
        "checkIn": "02:00 PM",
        "checkOut": "11:00 AM"
      }
    }
  ],
  "budget": {
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "transport": 0,
    "miscellaneous": 0,
    "total": 0
  }
}

IMPORTANT:
- Use ONLY attractions, restaurants, and hotels from the lists provided above
- Match the activity preference: ${activityPreference}
- Consider the group type: ${groupType}
- Keep hotel costs within ₹${hotelBudgetMin}-${hotelBudgetMax}
- Calculate realistic costs in Indian Rupees
- Return ONLY valid JSON, no markdown or extra text`;

  try {
    console.log('🤖 Generating itinerary with Gemini AI...');
    const ai = getGenAI();
    if (!ai) {
      throw new Error('Gemini API not initialized');
    }
    const model = ai.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response (remove markdown code blocks if present)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const aiResponse = JSON.parse(text);

    // Enrich with coordinates from our fetched data
    aiResponse.itinerary.forEach(day => {
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
    // Fallback to template-based if AI fails
    return generateFallbackItinerary(tripData, attractions, restaurants, hotels);
  }
}

// Fallback itinerary if AI fails
function generateFallbackItinerary(tripData, attractions, restaurants, hotels) {
  const { startDate, endDate, hotelPreference, hotelBudgetMin, hotelBudgetMax } = tripData;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const itinerary = [];
  let totalBudget = { accommodation: 0, food: 0, activities: 0, transport: 0, miscellaneous: 0 };

  for (let day = 1; day <= duration; day++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + day - 1);

    const dayPlan = {
      day,
      date: currentDate,
      title: day === 1 ? 'Arrival & Exploration' : day === duration ? 'Departure Day' : `Day ${day} - Exploration`,
      activities: [],
      meals: [],
      accommodation: null,
    };

    // Add 2 activities per day
    if (attractions.length > 0) {
      const morning = attractions[(day - 1) * 2 % attractions.length];
      const afternoon = attractions[(day - 1) * 2 + 1 % attractions.length];

      dayPlan.activities.push({
        time: '09:00 AM',
        activity: `Visit ${morning.name}`,
        location: morning.name,
        duration: '2-3 hours',
        cost: 100,
        description: `Explore ${morning.name}`,
        coordinates: morning.coordinates,
      });

      if (day < duration) {
        dayPlan.activities.push({
          time: '02:00 PM',
          activity: `Explore ${afternoon.name}`,
          location: afternoon.name,
          duration: '2-3 hours',
          cost: 100,
          description: `Discover ${afternoon.name}`,
          coordinates: afternoon.coordinates,
        });
      }

      totalBudget.activities += day < duration ? 200 : 100;
    }

    // Meals
    dayPlan.meals = [
      { name: restaurants[0]?.name || 'Local Cafe', mealType: 'breakfast', cost: 200 },
      { name: restaurants[1]?.name || 'Local Restaurant', mealType: 'lunch', cost: 300 },
      { name: restaurants[2]?.name || 'Fine Dining', mealType: 'dinner', cost: 400 },
    ];
    totalBudget.food += 900;

    // Accommodation
    if (day < duration) {
      const hotel = hotels.find(h => h.rating >= 4.0) || hotels[0];
      const hotelCost = Math.floor((hotelBudgetMin + hotelBudgetMax) / 2);
      
      dayPlan.accommodation = {
        name: hotel?.name || 'Standard Hotel',
        hotelType: hotelPreference,
        cost: hotelCost,
        checkIn: '02:00 PM',
        checkOut: '11:00 AM',
      };
      totalBudget.accommodation += hotelCost;
    }

    itinerary.push(dayPlan);
  }

  totalBudget.transport = duration * 500;
  totalBudget.miscellaneous = duration * 300;
  totalBudget.total = Object.values(totalBudget).reduce((sum, val) => sum + val, 0);

  return { itinerary, budget: totalBudget, duration };
}
