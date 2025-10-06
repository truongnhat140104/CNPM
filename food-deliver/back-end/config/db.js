import mongoose from "mongoose";

export const connectDB = async() =>{
    await mongoose.connect('mongodb+srv://elvis140104_db_user:1234566@cluster1.mnnl32w.mongodb.net/food-delivery').then(()=>console.log('DB connect'));
}