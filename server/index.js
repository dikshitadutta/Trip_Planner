import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport, { configurePassport } from './config/passport.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import Trip from './models/Trip.js';
import { generateItinerary, generateRecommendations } from './services/itineraryGenerator.js';
import { generateAIItinerary } from './services/aiItineraryGenerator.js';
import { enrichDestinationData } from './services/externalAPIs.js';
import { getExplorePlaces } from './services/googlePlaces.js';
import { getWikipediaSummary } from './services/wikipedia.js';

dotenv.config();

// Configure passport AFTER dotenv loads
configurePassport();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/trip_planner',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trip_planner');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Continuing without database...');
  }
};

connectDB();

console.log('\n🔍 Checking API credentials...');
console.log('Google OAuth Client ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Found' : '❌ Missing');
console.log('Google OAuth Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Found' : '❌ Missing');
console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? '✅ Found' : '❌ Missing');
console.log('Google Maps API Key:', process.env.GOOGLE_MAPS_API_KEY ? '✅ Found' : '❌ Missing');
console.log('AI Itinerary Generation:', (process.env.GEMINI_API_KEY && process.env.GOOGLE_MAPS_API_KEY) ? '✅ ENABLED' : '⚠️  DISABLED (using templates)\n');

app.get('/', (req, res) => {
  res.json({ message: 'Trip Planner API with Google OAuth' });
});

// Google OAuth routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173' }),
  (req, res) => {
    // Successful authentication - redirect back to home page with minimal user data
    const userData = {
      _id: req.user._id.toString(),
      id: req.user._id.toString(),
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar
    };
    console.log('Redirecting with user data:', userData);
    res.redirect(`http://localhost:5173/auth-success?user=${encodeURIComponent(JSON.stringify(userData))}`);
  }
);

// Get current user
app.get('/api/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// Create Trip (Empty Structure for Manual Planning)
app.post('/api/trips/create', async (req, res) => {
  try {
    const tripData = req.body;
    console.log('\n🗺️  Creating new trip for:', tripData.destination);

    // Validate required fields
    if (!tripData.userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    if (!tripData.startDate || !tripData.endDate) {
      return res.status(400).json({ success: false, message: 'Start and end dates are required' });
    }

    // Calculate duration
    const start = new Date(tripData.startDate);
    const end = new Date(tripData.endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Create Empty Itinerary
    const emptyItinerary = Array.from({ length: duration }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return {
        day: i + 1,
        date: date,
        title: `Day ${i + 1} in ${tripData.destination}`,
        activities: [],
        meals: []
      };
    });

    // Fetch initial explore data (images)
    console.log('🌍 Fetching initial destination data...');
    const explorePlaces = await getExplorePlaces(tripData.destination);
    const enrichedData = await enrichDestinationData(tripData.destination); // Keep existing enrichment for weather/info

    // Create trip in database
    const trip = new Trip({
      userId: tripData.userId,
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      duration,
      hotelPreference: tripData.hotelPreference || 'standard',
      hotelBudgetMin: tripData.hotelBudgetMin || 1000,
      hotelBudgetMax: tripData.hotelBudgetMax || 5000,
      invitedEmails: tripData.invitedEmails || [],
      itinerary: emptyItinerary,
      budget: {
        total: 0,
        currency: "INR",
        breakdown: { accommodation: 0, activities: 0, food: 0, transport: 0 }
      },
      enrichedData: {
        images: explorePlaces.length > 0 ? explorePlaces.map(p => ({ url: p.photo, description: p.name })) : enrichedData.images,
        destinationInfo: enrichedData.info,
        weather: enrichedData.weather
      },
      status: 'planned'
    });

    await trip.save();
    console.log('✅ Trip created successfully:', trip._id);

    res.json({
      success: true,
      trip: {
        id: trip._id,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        duration: trip.duration,
        budget: trip.budget,
        itinerary: trip.itinerary,
        enrichedData: trip.enrichedData
      }
    });

  } catch (error) {
    console.error('❌ Error creating trip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create trip: ' + error.message
    });
  }
});

// Get Explore Places
app.get('/api/trips/:id/explore', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const [attractions, hotels, restaurants] = await Promise.all([
      getExplorePlaces(trip.destination, 'attractions'),
      getExplorePlaces(trip.destination, 'hotels'),
      getExplorePlaces(trip.destination, 'restaurants')
    ]);

    // Enrich attractions with Wikipedia summaries
    const enrichedAttractions = await Promise.all(attractions.map(async (place) => {
      const summary = await getWikipediaSummary(place.name);
      return { ...place, description: summary || place.description };
    }));

    res.json({
      success: true,
      places: {
        attractions: enrichedAttractions,
        hotels,
        restaurants
      }
    });
  } catch (error) {
    console.error('Error fetching explore places:', error);
    res.status(500).json({ success: false, message: 'Error fetching places' });
  }
});
// Generate/Regenerate Itinerary with AI
app.post('/api/trips/:id/generate', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    console.log('🤖 Generating AI itinerary for trip:', trip._id);

    // Call AI Generator with CURRENT trip data (to respect existing plans)
    const { itinerary, budget } = await generateAIItinerary(trip);

    // Update trip with new itinerary
    trip.itinerary = itinerary;
    trip.budget = budget;
    await trip.save();

    res.json({ success: true, trip });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ success: false, message: 'Failed to generate itinerary' });
  }
});

// Get user's trips
app.get('/api/trips/user/:userId', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      trips
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips'
    });
  }
});

// Get single trip
app.get('/api/trips/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate('userId', 'name phone')
      .populate('collaborators.userId', 'name phone');

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    res.json({
      success: true,
      trip
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip'
    });
  }
});

// Update trip
app.put('/api/trips/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(
      req.params.tripId,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Trip updated successfully',
      trip
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trip'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
