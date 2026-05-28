import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}
let cached = global.mongoose;

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

if (!cached) {
  cached = global.mongoose = {
    conn: null, // actual connection object
    promise: null, //  connection ka ongoing promise
  };
}

export async function connectDB() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI);
    }

    cached.conn = await cached.promise;
    console.log("MongoDB Connected");
    return cached.conn;
    
  } catch (error) {
    console.log("Database connection failed", error);

  
  }
}
