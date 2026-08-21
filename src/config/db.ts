// MongoDB
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export default async function DBconfig(){
  try{
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log("mongoDB connect succefuly")
  }
  catch(error){
    console.log(`failed , ${error}`)
  }
}