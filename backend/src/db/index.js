import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

const connectDB= async()=> {
    try{
         const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB connected successfully ${conn.connection.host}`)
        retryCount = 0;
           
    }
     catch(err){
        retryCount++;
        console.log(`MongoDB connection failed (Attempt ${retryCount}/${MAX_RETRIES}):`, err.message);
        
        if (retryCount < MAX_RETRIES) {
            setTimeout(connectDB, RETRY_DELAY);
        } else {
            console.error("Max retry attempts reached. Exiting...");
            process.exit(1);
        }

    }
    }

    export default connectDB;