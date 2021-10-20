const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const { cloudinaryUploadMediaFile, cloudinaryDeleteFile } = require('../utils/cloudinary');
const getDateTimeForUpload = require('../utils/getDateTimeForUpload');
const User = require('../models/userModel');

const postController = {

    createPost: async (req, res) => {

        try {

            /** Id of user who created the post. */
            const userId = req.user._id;

            /** New post created by user. */
            const newPost = new Post({});
            /** _id of new post. */
            const newPostId = newPost._id;

            /* Post content recieved in request. */
            const { content } = req.body;

            /** Post image and video files array for storing cloudinary public_id and url. */
            const media = [];


            /** Files recieved in request. */
            const files = req.files;
            if (files) {

                /** Post media files in request. */
                const mediaFiles = files.media;
                if (mediaFiles) {

                    await uploadPostMediaToCloudinary(newPostId, mediaFiles, media);
                }
            }


            /* Setting new post items. */
            newPost.user = userId;
            newPost.content = content;
            newPost.media = media;


            /* Saving the new post. */
            await newPost.save();


            res.json({
                msg: 'Post Created.',
                newPost: {
                    ...newPost._doc
                }
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    getPosts: async (req, res) => {

        try {

            /** Id of user. */
            const userId = req.user._id;
            /** User's followings. */
            const userFollowing = req.user.following;


            /** Page to be returned for query. */
            const page = req.query.page * 1 || 1;
            /** Number of posts to be returned of mentioned page. */
            const limit = req.query.limit * 1 || 9;


            /** Posts of people user is followng and the user. */
            const posts = await Post.find({ user: [...userFollowing, userId] })
                .skip((page - 1) * limit).limit(limit)
                .sort('-createdAt')
                .populate('user', 'userImage username fullName followers')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: '-password'
                    }
                });


            res.json({
                msg: 'Posts Sent.',
                result: posts.length,
                posts
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    updatePost: async (req, res) => {

        try {

            /** Id of user. */
            const userId = req.user._id;
            /** Post id of the post to be updated. */
            const postId = req.params.id;


            /** Post content which needs to be updated. */
            const content = req.body.content;


            /** Post which needs to be updated */
            const post = await Post.findOne({ _id: postId, user: userId });
            if (!post) {
                const postWithMatchingId = await Post.findById(postId);
                if (!postWithMatchingId) return res.status(404).json({ msg: 'This post does not exist.' });
                return res.status(403).json({ msg: 'The user does not have the permission to update this post.' });
            }


            /** Post's media array. */
            const media = post._doc.media;
            /** Updated media array recieved in request. */
            const recievedMedia = req.body.media;
            /** Media array to be updated. */
            const updatedMedia = [];


            /* Reject if request has new files. */
            recievedMedia.map(recievedMediaFile => {
                let recievedMediaFileFound = false;
                for (const mediaFile of media) {
                    if (mediaFile.public_id === recievedMediaFile.public_id && mediaFile.url === recievedMediaFile.url
                        && mediaFile.fileType === recievedMediaFile.fileType) {
                        recievedMediaFileFound = true;
                        break;
                    }
                }
                if (!recievedMediaFileFound) return res.status(400).json({ msg: 'Request contains extra media files than post.' });
            });


            /** Media files which are to be removed from cloudinary. */
            const mediaToBeDeleted = media.filter(mediaFile => {
                let mediaFileFound = false;
                for (const recievedMediaFile of recievedMedia) {
                    if (mediaFile.public_id === recievedMediaFile.public_id && mediaFile.url === recievedMediaFile.url
                        && mediaFile.fileType === recievedMediaFile.fileType) {
                        mediaFileFound = true;
                        updatedMedia.push(mediaFile);
                        break;
                    }
                }
                if (!mediaFileFound) return mediaFile;
            });


            /* Updating post content and media. */
            await Post.findOneAndUpdate({ _id: postId, user: userId }, { content, $set: { media: updatedMedia } });
            /* Deleting removed media files from cloudinary. */
            await deletePostMediaFromCloudinary(mediaToBeDeleted);


            res.json({
                msg: 'Post Updated.',
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    deletePost: async (req, res) => {

        try {

            /** Id of user. */
            const userId = req.user._id;

            /** Id of the post to be deleted. */
            const postId = req.params.id;


            /** Post to be deleted. */
            const post = await Post.findOneAndDelete({ _id: postId, user: userId });
            if (!post) {
                const postWithMatchingId = await Post.findById(postId);
                if (!postWithMatchingId) return res.status(404).json({ msg: 'This post does not exist.' });
                return res.status(403).json({ msg: 'The user does not have the permission to delete this post.' });
            }


            /** Post's media array. */
            const media = post._doc.media;


            /* Deleting post's media files from cloudinary. */
            await deletePostMediaFromCloudinary(media);
            /* Deleting all the comments of this post. */
            await Comment.deleteMany({ postId });


            res.json({
                msg: 'Post Deleted.'
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    likePost: async (req, res) => {

        try {

            /** Id of user. */
            const userId = req.user._id;

            /** Id of the post to be liked. */
            const postId = req.params.id;

            /** Tells whether the user has already liked this post. */
            const post = await Post.findOneAndUpdate({ _id: postId, likes: { $nin: userId } }, { $push: { likes: userId } });
            if (!post) {
                const postWithMatchingId = await Post.findById(postId);
                if (!postWithMatchingId) return res.status(404).json({ msg: 'This post does not exist.' });
                return res.status(400).json({ msg: 'The user has already liked the post.' });
            }


            res.json({
                msg: 'Post liked.'
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    unlikePost: async (req, res) => {

        try {

            /** Id of user. */
            const userId = req.user._id;

            /** Id of the post to be unliked. */
            const postId = req.params.id;

            /** Tells whether the user has liked this post. */
            const post = await Post.findOneAndUpdate({ _id: postId, likes: userId }, { $pull: { likes: userId } });
            if (!post) {
                const postWithMatchingId = await Post.findById(postId);
                if (!postWithMatchingId) return res.status(404).json({ msg: 'This post does not exist.' });
                return res.status(400).json({ msg: 'The user has not liked the post.' });
            }


            res.json({
                msg: 'Post unliked.'
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    getUserPosts: async (req, res) => {

        try {

            /** Id of the user whose posts are to be sent. */
            const userId = req.params.id;

            /** User whose posts are to be sent. */
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ msg: 'This user does not exist.' });


            /** Page to be returned for query. */
            const page = req.query.page * 1 || 1;
            /** Number of posts to be returned of mentioned page. */
            const limit = req.query.limit * 1 || 9;


            /** User's all posts which are to be sent. */
            const posts = await Post.find({ user: userId })
                .skip((page - 1) * limit).limit(limit)
                .sort('-createdAt')
                .populate('user', 'userImage username fullName followers')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: '-password'
                    }
                });


            res.json({
                msg: 'User Posts Sent.',
                result: posts.length,
                posts
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    getPost: async (req, res) => {

        try {

            /** Id of the post to be sent. */
            const postId = req.params.id;


            /** Post to be sent in response. */
            const post = await Post.findById(postId)
                .populate('user', 'userImage username fullName followers')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: '-password'
                    }
                });


            if (!post) return res.status(400).json({ msg: 'This post does not exist.' });


            res.json({
                msg: 'Post Sent.',
                post
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    getUserMedia: async (req, res) => {

        try {

            /** User whose media is to be sent. */
            const userId = req.params.id;

            /** User whose media is to be snet. */
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ msg: 'This user does not exist.' });


            /** Page to be returned for query. */
            const page = req.query.page * 1 || 1;
            /** Number of posts to be returned of mentioned page. */
            const limit = req.query.limit * 1 || 9;


            /** Posts which have media. */
            const mediaPosts = await Post.find({ user: userId, 'media.0': { '$exists': true } })
                .skip((page - 1) * limit).limit(limit)
                .sort('-createdAt');


            /** Media to be sent. */
            const media = [];
            mediaPosts.map(mediaPost => {
                mediaPost.media.map((value, index, mediaFiles) => {
                    media.push({ ...mediaFiles[mediaFiles.length - 1 - index], postId: mediaPost._id });
                });
            });


            res.json({
                msg: 'User Media Sent.',
                media: media,
                result: media.length
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    savePost: async (req, res) => {

        try {

            /** Id of user who wants to save the post. */
            const userId = req.user._id;


            /** Id of the post which is to be saved. */
            const postId = req.params.id;

            /** Post which is to be saved. */
            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ msg: 'This post does not exist.' });


            /** Requesting user who did not had the post saved. */
            const user = await User.findOneAndUpdate({ _id: userId, saved: { $nin: postId } }, { $push: { saved: { $each: [postId], $position: 0 } } });
            if (!user) return res.status(400).json({ msg: 'The user has already saved the post.' });


            res.json({
                msg: 'Post Saved.'
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    unsavePost: async (req, res) => {

        try {

            /** Id of user who wants to unsave the post. */
            const userId = req.user._id;


            /** Id of the post which is to be unsaved. */
            const postId = req.params.id;

            /** Post which is to be unsaved. */
            const post = await Post.findById(postId);
            if (!post) return res.status(404).json({ msg: 'This post does not exist.' });


            /** Requesting user who has already saved the post. */
            const user = await User.findOneAndUpdate({ _id: userId, saved: { $in: postId } }, { $pull: { saved: postId } });
            if (!user) return res.status(400).json({ msg: 'The user has not saved the post.' });


            res.json({
                msg: 'Post Unsaved.'
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    },



    getSavedPosts: async (req, res) => {

        try {

            /** Ids of posts saved by the user. */
            const savedPostsIds = req.user.saved;


            /** Page to be returned for query. */
            const page = req.query.page * 1 || 1;
            /** Number of posts to be returned of mentioned page. */
            const limit = req.query.limit * 1 || 9;


            /** User's saved posts which are to be sent. */
            const posts = await Post.find({ _id: { $in: savedPostsIds } })
                .skip((page - 1) * limit).limit(limit)
                .sort('-createdAt')
                .populate('user', 'userImage username fullName followers')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: '-password'
                    }
                });


            res.json({
                msg: 'Saved Posts Sent.',
                posts: posts,
                result: posts.length
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    }

}


/**
 * Uploads post media to cloudinary and stores their publicID, url and fileType.
 * @param {String} postId _id of new post.
 * @param {*} files Media files in the post to be uploaded.
 * @param {*} media Media array to be saved in database.
 */
const uploadPostMediaToCloudinary = async (userId, files, media) => {

    /** Date and Time for upload record and publicID of post file. */
    const dateTime = getDateTimeForUpload();

    /** Cloudinary common post public_id for storing post file along with upload date and time for file name. */
    const cloudinaryPublicId_CommonPostId = 'posts/' + userId + '_' + dateTime;

    if (files.length > 1) {
        for (let fileCounter = 0; fileCounter < files.length; fileCounter++) {
            const file = files[fileCounter];
            const cloudinaryPublicId = cloudinaryPublicId_CommonPostId + '_' + fileCounter;
            const response = await cloudinaryUploadMediaFile(file, cloudinaryPublicId);
            const response_publicId = response.public_id;
            const response_url = response.secure_url;
            const response_resource_type = response.resource_type;
            media.push({ public_id: response_publicId, url: response_url, fileType: response_resource_type });
        }
    } else if (files) {
        const file = files;
        const cloudinaryPublicId = cloudinaryPublicId_CommonPostId + '_' + '0';
        const response = await cloudinaryUploadMediaFile(file, cloudinaryPublicId);
        const response_publicId = response.public_id;
        const response_url = response.secure_url;
        const response_resource_type = response.resource_type;
        media.push({ public_id: response_publicId, url: response_url, fileType: response_resource_type });
    }
}


/**
 * Removes post media files from cloudinary.
 * @param {Array} media Media array containing files to be removed.
 */
const deletePostMediaFromCloudinary = async (media) => {

    /** Post's images. */
    const imagesArray = media.filter(file => file.fileType === 'image');
    for (let fileCounter = 0; fileCounter < imagesArray.length; fileCounter++)
        await cloudinaryDeleteFile(imagesArray[fileCounter].public_id, 'image');

    /** Post's videos. */
    const videosArray = media.filter(file => file.fileType === 'video');
    for (let fileCounter = 0; fileCounter < videosArray.length; fileCounter++)
        await cloudinaryDeleteFile(videosArray[fileCounter].public_id, 'video');

}


module.exports = postController;