const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const commentController = {

    createComment: async (req, res) => {

        try {

            /** User id of the user making the comment request. */
            const userId = req.user._id;
            /** Comment details. */
            const { content, postId, postUserId, reply, tag } = req.body;


            /** Post on which comment is made. */
            const post = await Post.findOne({ _id: postId, user: postUserId });
            if (!post) return res.status(404).json({ msg: 'This post does not exist.' });


            if (reply) {

                /** If commentId, postId or postUserId  doesn't match or exist, reject request. */
                const replyToComment = await Comment.findOne({ _id: reply, postId: postId, postUserId: postUserId });
                if (!replyToComment) return res.status(404).json({ msg: 'This comment does not exist.' });
            }


            /** New comment which is to be added. */
            const newComment = new Comment({
                content, user: userId, postId,
                postUserId, reply, tag
            });
            /** Comment Id of new comment created. */
            const newCommentId = newComment._id;


            /* Saving the new comment and adding the commentId to post' comments array. */
            await newComment.save()
            await Post.findByIdAndUpdate({ _id: postId },
                { $push: { comments: newCommentId } }, { new: true });


            res.json({
                msg: 'Comment created.',
                comment: newComment._doc
            });


        } catch (err) {

            res.status(500).json({ msg: err.message });
        }

    }

}


module.exports = commentController;