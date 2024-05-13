import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery' , true)

    if (!process.env.MONGODB_URI) {
        return console.log('MONGO_URI is required')
    }

    if (isConnected) {
        return console.log('You are already connected')
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI)

        isConnected = true

        console.log('MongoDB Connected Successfully')
    } catch (error) {
        console.log(error)
    }
}