const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const { cloudinaryUploadMediaFile, cloudinaryDeleteFile } = require('../utils/cloudinary');
const getDateTimeForUpload = require('../utils/getDateTimeForUpload');

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


            /** All posts of people user is followng and the user. */
            const allPosts = Post.find({
                user: [...userFollowing, userId]
            });


            /** Paginated Posts.*/
            const paginatedPosts = paginating(allPosts, req.query);
            /** Paginated posts of people user is followng and the user. */
            const posts = await paginatedPosts.sort('-createdAt')
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
            const post = await Post.findOneAndUpdate({ _id: postId, user: userId }, { content });
            if (!post) {
                const postWithMatchingId = await Post.findById(postId);
                if (!postWithMatchingId) return res.status(404).json({ msg: 'This post does not exist.' });
                return res.status(403).json({ msg: 'The user does not have the permission to update this post.' });
            }


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
            

            /** Post's images. */
            const imagesArray = media.filter(file => file.fileType === 'image');
            for (let fileCounter = 0; fileCounter < imagesArray.length; fileCounter++)
                await cloudinaryDeleteFile(imagesArray[fileCounter].public_id, 'image');


            /** Post's videos. */
            const videosArray = media.filter(file => file.fileType === 'video');
            for (let fileCounter = 0; fileCounter < videosArray.length; fileCounter++)
                await cloudinaryDeleteFile(videosArray[fileCounter].public_id, 'video');


            /* Deleting all the comments of this post. */
            await Comment.deleteMany({ postId });


            res.json({
                msg: 'Post Deleted.'
            });


        } catch (err) {

            return res.status(500).json({ msg: err.message });
        }

    }

}


/**
 * Uploads post media to cloudinary and stores their publicID and url.
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
 * Paginates the documents based on request's query.
 * @param {*} query Mongoose query.
 * @param {*} queryString Request's query object.
 * @returns Paginated mongoose query.
 */
const paginating = (query, queryString) => {
    const page = queryString.page * 1 || 1;
    const limit = queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    return query;
}


module.exports = postController;