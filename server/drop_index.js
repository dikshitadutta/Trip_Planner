import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trip_planner');
        console.log('MongoDB connected');

        const collection = mongoose.connection.collection('users');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);

        const phoneIndex = indexes.find(idx => idx.key.phone === 1);
        if (phoneIndex) {
            console.log(`Found phone index: ${phoneIndex.name}. Dropping...`);
            await collection.dropIndex(phoneIndex.name);
            console.log('Phone index dropped successfully.');
        } else {
            console.log('Phone index not found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB();
