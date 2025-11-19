# MongoDB Setup Guide

## ✅ Current Status
- MongoDB is installed and running
- Database: `trip_planner`
- Connection: `mongodb://localhost:27017/trip_planner`

## 🎯 What's Working Now

### User Authentication Flow:
1. User enters phone number and name
2. Clicks "Send OTP" → OTP sent via SMS (or shown in alert if SMS not configured)
3. User enters OTP
4. Clicks "Verify & Continue"
5. **Backend checks MongoDB:**
   - If phone exists → Login user, update last login
   - If new phone → Create new user account
6. Returns user data with session token

### Database Schema:
```javascript
User {
  phone: String (unique, primary key)
  name: String
  createdAt: Date
  lastLogin: Date
}
```

## 📱 Testing the Flow

1. Go to http://localhost:5173/
2. Fill the form through all 4 steps
3. On Step 4 (Login):
   - Enter name: "Test User"
   - Enter phone: "9876543210"
   - Click "Send OTP"
   - Check console/alert for OTP
   - Enter OTP
   - Click "Verify & Continue"

4. Check server console - you'll see:
   ```
   OTP for 9876543210: 123456
   New user created: 9876543210
   ```

5. Try logging in again with same number:
   ```
   User logged in: 9876543210
   ```

## 🔍 View Database

### Using MongoDB Compass (GUI):
1. Download: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse database: `trip_planner` → collection: `users`

### Using Command Line:
```bash
mongosh
use trip_planner
db.users.find()
```

## ☁️ MongoDB Atlas (Cloud - FREE)

If you want cloud database instead of local:

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (M0 - FREE forever)
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string
6. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trip_planner
   ```

## 🚀 Production Recommendations

- Use MongoDB Atlas for production
- Add indexes on phone field
- Implement JWT tokens instead of simple session strings
- Add user profile fields (email, preferences, etc.)
- Store trip plans linked to user
- Add rate limiting on OTP requests
