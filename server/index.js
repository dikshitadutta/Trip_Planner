import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';
import mongoose from 'mongoose';
import User from './models/User.js';
import Trip from './models/Trip.js';
import { generateItinerary, generateRecommendations } from './services/itineraryGenerator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

// In-memory storage for OTPs (use Redis in production)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Initialize Twilio client
let twilioClient = null;
console.log('🔍 Checking Twilio credentials...');
console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID ? 'Found' : 'Missing');
console.log('Auth Token:', process.env.TWILIO_AUTH_TOKEN ? 'Found' : 'Missing');
console.log('Phone Number:', process.env.TWILIO_PHONE_NUMBER || 'Missing');

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    console.log('✅ Twilio client initialized successfully');
  } catch (error) {
    console.error('❌ Twilio initialization error:', error.message);
  }
} else {
  console.log('⚠️  Twilio credentials not found in environment variables');
}

// Send SMS using Twilio
const sendSMS = async (phone, otp) => {
  if (!twilioClient) {
    console.log('⚠️  Twilio not configured');
    console.log('📱 OTP (use this to login):', otp);
    return { success: false, message: 'SMS service not configured' };
  }

  try {
    console.log('📤 Sending SMS via Twilio to:', phone);
    const message = `Your Seven Sisters trip planner OTP is: ${otp}. Valid for 5 minutes.`;
    
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}` // Add India country code
    });

    console.log('✅ SMS sent successfully! Message SID:', result.sid);
    return { success: true, message: 'SMS sent successfully' };
  } catch (error) {
    console.error('❌ Twilio Error:', error.message);
    
    // Common Twilio errors
    if (error.code === 21608) {
      console.log('⚠️  Phone number not verified in Twilio trial account');
      console.log('📱 Add this number to verified caller IDs in Twilio console');
    }
    
    return { success: false, message: 'SMS service error' };
  }
};

app.get('/', (req, res) => {
  res.json({ message: 'Trip Planner API' });
});

// Send OTP endpoint
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid phone number. Please provide a 10-digit number.' 
      });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP with expiration
    otpStore.set(phone, { otp, expiresAt, attempts: 0 });

    // Send SMS
    const smsResult = await sendSMS(phone, otp);
    
    // Always log to console in development
    console.log(`\n🔐 OTP GENERATED for ${phone}: ${otp}`);
    console.log(`⏰ Expires at: ${new Date(expiresAt).toLocaleTimeString()}\n`);

    res.json({ 
      success: true, 
      message: smsResult.success ? 'OTP sent to your phone' : 'OTP generated (check console)',
      // Show OTP in development mode if SMS fails
      otp: (process.env.NODE_ENV === 'development' || !smsResult.success) ? otp : undefined
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP. Please try again.' 
    });
  }
});

// Verify OTP endpoint
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name } = req.body;

    console.log(`\n🔍 Verifying OTP for ${phone}`);
    console.log(`📥 Received OTP: ${otp}`);

    if (!phone || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number and OTP are required.' 
      });
    }

    const storedData = otpStore.get(phone);

    if (!storedData) {
      console.log('❌ No OTP found in store for this phone');
      return res.status(400).json({ 
        success: false, 
        message: 'OTP not found. Please request a new OTP.' 
      });
    }

    console.log(`💾 Stored OTP: ${storedData.otp}`);
    console.log(`⏰ Expires: ${new Date(storedData.expiresAt).toLocaleTimeString()}`);
    console.log(`🔢 Attempts: ${storedData.attempts}/3`);

    // Check expiration
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phone);
      console.log('❌ OTP expired');
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new OTP.' 
      });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(phone);
      console.log('❌ Too many attempts');
      return res.status(400).json({ 
        success: false, 
        message: 'Too many failed attempts. Please request a new OTP.' 
      });
    }

    // Verify OTP - compare as strings
    const receivedOTP = String(otp).trim();
    const storedOTP = String(storedData.otp).trim();
    
    console.log(`🔐 Comparing: "${receivedOTP}" === "${storedOTP}"`);

    if (receivedOTP !== storedOTP) {
      storedData.attempts += 1;
      otpStore.set(phone, storedData);
      console.log(`❌ OTP mismatch. Attempts: ${storedData.attempts}/3`);
      return res.status(400).json({ 
        success: false, 
        message: `Invalid OTP. ${3 - storedData.attempts} attempts remaining.` 
      });
    }

    // OTP verified successfully
    otpStore.delete(phone);

    // Create or update user in database
    let user = await User.findOne({ phone });
    
    if (user) {
      // Existing user - update last login and name if provided
      user.lastLogin = new Date();
      if (name) user.name = name;
      await user.save();
      console.log(`User logged in: ${phone}`);
    } else {
      // New user - create account
      user = new User({
        phone,
        name: name || 'User'
      });
      await user.save();
      console.log(`New user created: ${phone}`);
    }

    // Create session token (in production, use JWT)
    const token = `session_${phone}_${Date.now()}`;

    res.json({ 
      success: true, 
      message: user.createdAt.getTime() === user.lastLogin.getTime() ? 'Account created successfully!' : 'Welcome back!',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        isNewUser: user.createdAt.getTime() === user.lastLogin.getTime()
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to verify OTP. Please try again.' 
    });
  }
});

// Create trip with generated itinerary
app.post('/api/trips/create', async (req, res) => {
  try {
    const tripData = req.body;
    
    console.log('\n🗺️  Received trip data:', JSON.stringify(tripData, null, 2));
    console.log('Generating itinerary for:', tripData.destination);
    
    // Validate required fields
    if (!tripData.userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    if (!tripData.startDate || !tripData.endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start and end dates are required'
      });
    }
    
    // Generate itinerary and recommendations
    console.log('📝 Generating itinerary...');
    const { itinerary, budget, duration } = generateItinerary(tripData);
    console.log(`✅ Generated ${duration}-day itinerary with ${itinerary.length} days`);
    
    console.log('🎯 Generating recommendations...');
    const recommendations = generateRecommendations(tripData);
    
    // Create trip in database
    console.log('💾 Saving to database...');
    const trip = new Trip({
      userId: tripData.userId,
      departure: tripData.departure || 'Not specified',
      destination: tripData.destination || 'Not specified',
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      duration,
      activityPreference: tripData.activityPreference || 'Mixed Experience',
      groupType: tripData.groupType || 'solo',
      hotelPreference: tripData.hotelPreference || 'standard',
      hotelBudgetMin: tripData.hotelBudgetMin || 1000,
      hotelBudgetMax: tripData.hotelBudgetMax || 5000,
      itinerary,
      budget,
      recommendations,
      status: 'draft'
    });
    
    await trip.save();
    
    console.log('✅ Trip created successfully:', trip._id);
    console.log(`💰 Total budget: ₹${budget.total}\n`);
    
    res.json({
      success: true,
      message: 'Itinerary generated successfully!',
      trip: {
        id: trip._id,
        destination: trip.destination,
        duration: trip.duration,
        itinerary: trip.itinerary,
        budget: trip.budget,
        recommendations: trip.recommendations
      }
    });
  } catch (error) {
    console.error('❌ Error creating trip:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to generate itinerary: ' + error.message
    });
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

// Clean up expired OTPs every minute
setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
    }
  }
}, 60000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
