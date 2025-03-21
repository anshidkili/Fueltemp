import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://gym666m:nNzrbucBl4GP21gj@cluster0.ctrw1.mongodb.net/fuelstation";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define cached connection object that works in browser environment
const cached: { conn: any; promise: any } = { conn: null, promise: null };

async function connectToDatabase() {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    console.log(
      "Browser environment detected, using mock data instead of MongoDB",
    );
    return null; // Return null in browser environment
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
