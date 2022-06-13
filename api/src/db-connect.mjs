import mongoose from 'mongoose';

export async function dbConnect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/blog');
        console.log('Connected to MongDB...');
        return mongoose.connection;
    } catch (err) {
        console.log(err);
    }
}
