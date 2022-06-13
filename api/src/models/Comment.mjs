import mongoose from 'mongoose';
// title content image status publish date author tags
const commentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    },
    { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema, 'comments');

