const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({

    content: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    postId: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: true
    },

    reply: mongoose.Types.ObjectId,

    postUserId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },

    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],

    tag: Object

},
    {

        timestamps: true

    }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;