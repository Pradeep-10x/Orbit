import mongoose, { set } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB= async()=> {
    try{
         const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB connected successfully ${conn.connection.host}`)
           
    }
     catch(err){
        console.log("MongoDB connection failed", err);
        setTimeout(connectDB, 5000);

    }
    }

    export default connectDB;