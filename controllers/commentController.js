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

    },



    updateComment: async (req, res) => {

        try {

            /** User id of the user making the comment request. */
            const userId = req.user._id;


            /** Id of comment to be updated. */
            const commentId = req.params.id;
            /** Updated content of the comment. */
            const { content } = req.body;


            /** Updated comment. */
            const updatedComment = await Comment.findOneAndUpdate({ _id: commentId, user: userId }, { content });
            if (!updatedComment) {
                const commentWithMatchingId = await Comment.findById(commentId);
                if (!commentWithMatchingId) return res.status(404).json({ msg: 'This comment does not exist.' });
                return res.status(403).json({ msg: 'Comment updation request failed. The comment does not belong to the user requesting updation.' });
            }


            res.json({
                msg: 'Comment updated.'
            });


        } catch (err) {

            res.status(500).json({ msg: err.message });
        }

    },



    deleteComment: async (req, res) => {

        try {

            /** User id of the user making the comment request. */
            const userId = req.user._id;


            /** Id of comment to be deleted. */
            const commentId = req.params.id;


            /** Deleted comment. */
            const deletedComment = await Comment.findOneAndDelete({ _id: commentId, user: userId });
            if (!deletedComment) {
                const commentWithMatchingId = await Comment.findById(commentId);
                if (!commentWithMatchingId) return res.status(404).json({ msg: 'This comment does not exist.' });
                return res.status(403).json({ msg: 'Comment deletion request failed. The comment does not belong to the user requesting deletion.' });
            }


            /** Removing comment id from its post's comments' array. */
            await Post.findOneAndUpdate({ _id: deletedComment.postId }, { $pull: { comments: deletedComment._id } });


            res.json({
                msg: 'Comment deleted.',
            });


        } catch (err) {

            res.status(500).json({ msg: err.message });
        }

    },



    likeComment: async (req, res) => {

        try {

            /** User id of the user making the comment request. */
            const userId = req.user._id;


            /** Id of comment to be liked. */
            const commentId = req.params.id;


            /** Tells whether the user has already liked this comment. */
            const comment = await Comment.findOneAndUpdate({ _id: commentId, likes: { $nin: userId } }, { $push: { likes: userId } });
            if (!comment) {
                const commentWithMatchingId = await Comment.findById(commentId);
                if (!commentWithMatchingId) return res.status(404).json({ msg: 'This comment does not exist.' });
                return res.status(400).json({ msg: 'The user has already liked the comment.' });
            }


            res.json({
                msg: 'Comment liked.'
            });


        } catch (err) {

            res.status(500).json({ msg: err.message });
        }

    },



    unlikeComment: async (req, res) => {

        try {

            /** User id of the user making the comment request. */
            const userId = req.user._id;


            /** Id of comment to be unliked. */
            const commentId = req.params.id;


            /** Tells whether the user has liked this comment. */
            const comment = await Comment.findOneAndUpdate({ _id: commentId, likes: userId }, { $pull: { likes: userId } });
            if (!comment) {
                const commentWithMatchingId = await Comment.findById(commentId);
                if (!commentWithMatchingId) return res.status(404).json({ msg: 'This comment does not exist.' });
                return res.status(400).json({ msg: 'The user has not liked the comment.' });
            }


            res.json({
                msg: 'Comment unliked.'
            });


        } catch (err) {

            res.status(500).json({ msg: err.message });
        }

    }

}


module.exports = commentController;