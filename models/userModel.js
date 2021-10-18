const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    fullName: {
        type: String,
        trim: true,
        required: true,
        maxLength: 25
    },

    username: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        set: u => u.replace(/ /g, ''),
        minLength: 3,
        maxLength: 25,
        unique: true
    },

    email: {
        type: String,
        trim: true,
        required: true,
        match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minLength: 6
    },

    userImage: {
        type: String,
        default: 'https://image.flaticon.com/icons/png/512/17/17004.png'
    },

    gender: {
        type: String,
        default: 'male',
        lowercase: true,
        trim: true,
        enum: ['male', 'female', 'others']
    },

    mobile: {
        type: Number
    },

    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],

    following: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],

    saved: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Post'
        }
    ]

},

    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;