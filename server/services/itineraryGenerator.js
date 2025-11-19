// Itinerary generation service
// This uses templates - can be replaced with AI (OpenAI GPT) later

const destinationData = {
  'Shillong': {
    attractions: [
      { name: 'Elephant Falls', duration: '2 hours', cost: 20, description: 'Three-tiered waterfall surrounded by lush greenery', coordinates: { lat: 25.3176, lng: 91.8933 } },
      { name: 'Shillong Peak', duration: '3 hours', cost: 50, description: 'Highest point in Shillong with panoramic views', coordinates: { lat: 25.5788, lng: 91.8933 } },
      { name: 'Ward\'s Lake', duration: '1.5 hours', cost: 10, description: 'Scenic horseshoe-shaped lake perfect for boating', coordinates: { lat: 25.5788, lng: 91.8933 } },
      { name: 'Don Bosco Museum', duration: '2 hours', cost: 100, description: 'Seven-story museum showcasing Northeast culture', coordinates: { lat: 25.5788, lng: 91.8933 } },
      { name: 'Umiam Lake', duration: '3 hours', cost: 30, description: 'Beautiful reservoir with water sports activities', coordinates: { lat: 25.6751, lng: 91.9026 } },
      { name: 'Police Bazaar', duration: '2 hours', cost: 0, description: 'Main shopping area with local handicrafts', coordinates: { lat: 25.5788, lng: 91.8933 } },
      { name: 'Cathedral of Mary Help', duration: '1 hour', cost: 0, description: 'Beautiful Gothic-style cathedral', coordinates: { lat: 25.5788, lng: 91.8933 } }
    ],
    restaurants: [
      { name: 'City Hut Family Dhaba', type: 'lunch', cost: 300 },
      { name: 'Cafe Shillong Heritage', type: 'breakfast', cost: 200 },
      { name: 'Trattoria', type: 'dinner', cost: 500 }
    ],
    hotels: [
      { name: 'Hotel Polo Towers', type: 'luxury', pricePerNight: 4000, rating: 4.5 },
      { name: 'Hotel Centre Point', type: 'standard', pricePerNight: 2500, rating: 4.0 },
      { name: 'Ri Kynjai Resort', type: 'luxury', pricePerNight: 8000, rating: 5.0 },
      { name: 'Hotel Pegasus Crown', type: 'budget', pricePerNight: 1500, rating: 3.5 }
    ]
  },
  'Gangtok': {
    attractions: [
      { name: 'Tsomgo Lake', duration: '4 hours', cost: 500, description: 'Glacial lake at 12,400 ft with stunning mountain views', coordinates: { lat: 27.3389, lng: 88.6065 } },
      { name: 'Nathula Pass', duration: '5 hours', cost: 1000, description: 'Indo-China border pass at 14,140 ft (permit required)', coordinates: { lat: 27.3914, lng: 88.8428 } },
      { name: 'MG Marg', duration: '2 hours', cost: 0, description: 'Pedestrian-only street with shops and cafes', coordinates: { lat: 27.3314, lng: 88.6138 } },
      { name: 'Rumtek Monastery', duration: '2 hours', cost: 50, description: 'Largest monastery in Sikkim with beautiful architecture', coordinates: { lat: 27.2892, lng: 88.6138 } },
      { name: 'Hanuman Tok', duration: '1.5 hours', cost: 20, description: 'Temple with panoramic views of Kanchenjunga', coordinates: { lat: 27.3389, lng: 88.6065 } },
      { name: 'Tashi Viewpoint', duration: '1 hour', cost: 10, description: 'Best sunrise views of Mt. Kanchenjunga', coordinates: { lat: 27.3389, lng: 88.6065 } }
    ],
    restaurants: [
      { name: 'Baker\'s Cafe', type: 'breakfast', cost: 250 },
      { name: 'The Square Restaurant', type: 'lunch', cost: 400 },
      { name: 'Taste of Tibet', type: 'dinner', cost: 350 }
    ],
    hotels: [
      { name: 'Mayfair Spa Resort', type: 'luxury', pricePerNight: 6000, rating: 5.0 },
      { name: 'Hotel Sonam Delek', type: 'standard', pricePerNight: 2000, rating: 4.0 },
      { name: 'The Elgin Nor-Khill', type: 'luxury', pricePerNight: 7500, rating: 4.8 },
      { name: 'Hotel Sher-E-Punjab', type: 'budget', pricePerNight: 1200, rating: 3.5 }
    ]
  },
  // Add more destinations as needed
  'default': {
    attractions: [
      { name: 'Local Market', duration: '2 hours', cost: 100, coordinates: { lat: 0, lng: 0 } },
      { name: 'City Center', duration: '3 hours', cost: 50, coordinates: { lat: 0, lng: 0 } },
      { name: 'Cultural Museum', duration: '2 hours', cost: 150, coordinates: { lat: 0, lng: 0 } },
      { name: 'Scenic Viewpoint', duration: '2 hours', cost: 50, coordinates: { lat: 0, lng: 0 } }
    ],
    restaurants: [
      { name: 'Local Restaurant', type: 'lunch', cost: 300 },
      { name: 'Cafe', type: 'breakfast', cost: 150 },
      { name: 'Fine Dining', type: 'dinner', cost: 500 }
    ],
    hotels: [
      { name: 'Standard Hotel', type: 'standard', pricePerNight: 2500, rating: 4.0 },
      { name: 'Luxury Resort', type: 'luxury', pricePerNight: 5000, rating: 4.5 }
    ]
  }
};

export const generateItinerary = (tripData) => {
  const { destination, startDate, endDate, activityPreference, groupType, hotelPreference, hotelBudgetMin, hotelBudgetMax } = tripData;
  
  // Calculate duration
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  
  // Get destination data
  const destKey = Object.keys(destinationData).find(key => 
    destination.toLowerCase().includes(key.toLowerCase())
  ) || 'default';
  const destData = destinationData[destKey];
  
  // Generate day-by-day itinerary
  const itinerary = [];
  let totalBudget = {
    accommodation: 0,
    food: 0,
    activities: 0,
    transport: 0,
    miscellaneous: 0
  };
  
  for (let day = 1; day <= duration; day++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + day - 1);
    
    const dayPlan = {
      day,
      date: currentDate,
      title: day === 1 ? 'Arrival & Exploration' : 
             day === duration ? 'Departure Day' : 
             `Day ${day} - ${destData.attractions[day % destData.attractions.length]?.name || 'Exploration'}`,
      activities: [],
      meals: [],
      accommodation: null
    };
    
    // Morning activity
    if (day > 1 || day === 1) {
      const morningAttraction = destData.attractions[(day - 1) % destData.attractions.length];
      dayPlan.activities.push({
        time: '09:00 AM',
        activity: `Visit ${morningAttraction.name}`,
        location: morningAttraction.name,
        duration: morningAttraction.duration,
        cost: morningAttraction.cost,
        description: `Explore the beautiful ${morningAttraction.name}`,
        coordinates: morningAttraction.coordinates
      });
      totalBudget.activities += morningAttraction.cost;
    }
    
    // Afternoon activity
    if (day < duration) {
      const afternoonAttraction = destData.attractions[(day) % destData.attractions.length];
      dayPlan.activities.push({
        time: '02:00 PM',
        activity: `Explore ${afternoonAttraction.name}`,
        location: afternoonAttraction.name,
        duration: afternoonAttraction.duration,
        cost: afternoonAttraction.cost,
        description: `Discover ${afternoonAttraction.name}`,
        coordinates: afternoonAttraction.coordinates
      });
      totalBudget.activities += afternoonAttraction.cost;
    }
    
    // Meals
    dayPlan.meals = [
      { ...destData.restaurants.find(r => r.type === 'breakfast'), mealType: 'breakfast' },
      { ...destData.restaurants.find(r => r.type === 'lunch'), mealType: 'lunch' },
      { ...destData.restaurants.find(r => r.type === 'dinner'), mealType: 'dinner' }
    ];
    totalBudget.food += dayPlan.meals.reduce((sum, meal) => sum + meal.cost, 0);
    
    // Accommodation (except last day)
    if (day < duration) {
      const hotel = destData.hotels.find(h => 
        h.type === hotelPreference && 
        h.pricePerNight >= hotelBudgetMin && 
        h.pricePerNight <= hotelBudgetMax
      ) || destData.hotels[0];
      
      dayPlan.accommodation = {
        name: hotel.name,
        hotelType: hotel.type,
        cost: hotel.pricePerNight,
        checkIn: '02:00 PM',
        checkOut: '11:00 AM'
      };
      totalBudget.accommodation += hotel.pricePerNight;
    }
    
    itinerary.push(dayPlan);
  }
  
  // Add transport costs (estimated)
  totalBudget.transport = duration * 500; // ₹500 per day for local transport
  totalBudget.miscellaneous = duration * 300; // ₹300 per day for misc
  totalBudget.total = Object.values(totalBudget).reduce((sum, val) => sum + val, 0);
  
  return {
    itinerary,
    budget: totalBudget,
    duration
  };
};

export const generateRecommendations = (tripData) => {
  // Mock recommendations - replace with real API calls
  return {
    flights: [
      {
        airline: 'IndiGo',
        departure: '10:00 AM',
        arrival: '12:30 PM',
        price: 4500,
        duration: '2h 30m'
      },
      {
        airline: 'Air India',
        departure: '02:00 PM',
        arrival: '04:45 PM',
        price: 5200,
        duration: '2h 45m'
      }
    ],
    trains: [
      {
        name: 'Rajdhani Express',
        departure: '08:00 PM',
        arrival: '06:00 AM',
        price: 1500,
        duration: '10h'
      }
    ],
    hotels: destinationData[tripData.destination]?.hotels || destinationData.default.hotels
  };
};
