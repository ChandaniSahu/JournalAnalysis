import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
   console.log('✅ MongoDB connected successfully')
  return mongoose.connect(MONGO_URI);
}