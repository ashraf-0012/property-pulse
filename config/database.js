import mongoose from "mongoose";

let connected = false;

const connectDb = async () =>{
    mongoose.set("strictQuery", true);
    // If already connected dont connect again
    if(connected){
        console.log("MongoDb already connected...");
        return;
    }

    // Connect to database
    try{
       await mongoose.connect(process.env.MONGODB_URI)
       console.log("MongoDB Connected...")
       connected = true
    }catch(error){
        console.log(error)
    }

};

export default connectDb;