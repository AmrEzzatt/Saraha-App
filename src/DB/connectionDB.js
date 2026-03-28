import mongoose from 'mongoose'
import { User } from '../modules/users/users.model.js'
import { DB_URI, DB_NAME } from '../../config/config.service.js'


export const authenticateDB = async () => {
    try {
        await mongoose.connect(DB_URI,{dbName: DB_NAME,serverSelectionTimeoutMS: 5000});
        await User.syncIndexes();
        console.log('mongoose connected successfully')
    } catch (error) {
        console.error('Error connecting to DB:', error)
    }   
}