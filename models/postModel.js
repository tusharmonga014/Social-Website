const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },

    content: {
        type: String,
        maxLength: 500,
        trim: true
    },

    media: {
        type: Array
    },

    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],

    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Comment'
        }
    ]

},
    {

        timestamps: true

    }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;