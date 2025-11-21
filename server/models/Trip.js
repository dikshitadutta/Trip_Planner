import mongoose from 'mongoose';

const dayPlanSchema = new mongoose.Schema({
  day: Number,
  date: Date,
  title: String,
  activities: [{
    time: String,
    activity: String,
    location: String,
    duration: String,
    cost: Number,
    description: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
  meals: [{
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'] },
    restaurant: String,
    cost: Number
  }],
  accommodation: {
    name: String,
    hotelType: String,
    cost: Number,
    checkIn: String,
    checkOut: String
  }
});

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Form data
  departure: String,
  destination: String,
  startDate: Date,
  endDate: Date,
  duration: Number, // in days
  activityPreference: String,
  groupType: String,
  hotelPreference: String,
  hotelBudgetMin: Number,
  hotelBudgetMax: Number,
  
  // Generated itinerary
  itinerary: [dayPlanSchema],
  
  // Budget breakdown
  budget: {
    accommodation: Number,
    food: Number,
    activities: Number,
    transport: Number,
    miscellaneous: Number,
    total: Number
  },
  
  // Recommendations
  recommendations: {
    flights: [{
      airline: String,
      departure: String,
      arrival: String,
      price: Number,
      duration: String
    }],
    trains: [{
      name: String,
      departure: String,
      arrival: String,
      price: Number,
      duration: String
    }],
    hotels: [{
      name: String,
      rating: Number,
      pricePerNight: Number,
      amenities: [String],
      location: String
    }]
  },
  
  // Collaboration
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    phone: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    invitedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Enriched data from external APIs
  enrichedData: {
    images: [{
      url: String,
      thumbnail: String,
      photographer: String,
      description: String
    }],
    destinationInfo: {
      title: String,
      description: String,
      image: String,
      url: String,
      coordinates: {
        lat: Number,
        lon: Number
      }
    },
    weather: {
      city: String,
      country: String,
      current: {
        temp: Number,
        feels_like: Number,
        description: String,
        icon: String,
        humidity: Number,
        wind_speed: Number
      },
      daily: [{
        date: String,
        temp: Number,
        temp_min: Number,
        temp_max: Number,
        description: String,
        icon: String
      }]
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'planned', 'ongoing', 'completed'],
    default: 'draft'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
tripSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Trip', tripSchema);
