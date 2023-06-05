import mongoose, { connect, connection } from "mongoose";

export async function connectDB() {
  try {
    await connect(process.env.MONGO_URI ?? 'mongodb://localhost:27017/artist');
    
    mongoose.connection.on("connected", () => {
      connection.readyState === 1 && console.log(`Connected to ${process.env.MONGO_URI}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};