const mongoose = require('mongoose')

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

    images: {
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
            ref: 'comment'
        }
    ],

},
    {

        timestamps: true

    }
);

const Post = mongoose.model('post', postSchema);

module.exports = Post;