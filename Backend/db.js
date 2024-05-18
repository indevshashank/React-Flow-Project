import mongoose from 'mongoose';
import { config } from 'dotenv';

config(); // Load environment variables
const mongoURI = process.env.MONGODB_URI; // Get MongoDB URI from environment variables

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Mongoose Connected");
    } catch (err) {
        console.error(err);
    }
};

export default connectToMongo;
