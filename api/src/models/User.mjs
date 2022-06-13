import mongoose from 'mongoose';

let validateName = function(name) {
    let re = /^[A-Za-z\s]*$/;
    return re.test(name)
};

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        validate: [validateName, 'Please fill a valid first name'],
        match: [/^[A-Za-z\s]*$/, "Please fill a valid first name"]
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['admin', 'author', 'user'],
        default: "user"
    },
    bio: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    links: {
        type: Array,
    }
    },
    { timestamps: true }
);

export const User = mongoose.model('User', userSchema, 'users');

