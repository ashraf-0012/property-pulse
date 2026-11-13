import mongoose from "mongoose";

let connected = false;

const connectDb = async () => {
  mongoose.set("strictQuery", true);

  // If already connected, don't connect again
  if (connected) {
    console.log("MongoDB already connected...");
    return;
  }

  // Connect to database
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected...");
    connected = true;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDb;
