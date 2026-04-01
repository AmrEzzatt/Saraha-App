import mongoose from 'mongoose'
import { User } from '../modules/users/users.model.js'
import { DB_URI } from '../../config/config.service.js'


export const authenticateDB = async () => {
    try {
        await mongoose.connect(DB_URI, { serverSelectionTimeoutMS: 5000 });
        User.syncIndexes();
        console.log('mongoose connected successfully')
        console.log("Connected DB:", mongoose.connection.name);
    } catch (error) {
        console.error('Error connecting to DB:', error)
    }
}

