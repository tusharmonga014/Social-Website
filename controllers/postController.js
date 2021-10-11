const Post = require("../models/postModel");
const cloudinaryUploadMediaFile = require("../utils/cloudinaryFileUpload");
const getDateTimeForUpload = require("../utils/getDateTimeForUpload");

const postController = {

    createPost: async (req, res) => {

        try {

            /** Id of user who created the post. */
            const userId = req.user._id;

            /* Post content recieved in request. */
            const { content } = req.body;

            /** Post image and video files array for storing cloudinary public_id and url. */
            const images = [];


            /** Files recieved in request. */
            const files = req.files;
            if (files) {

                /** Post images and video files in request. */
                const imageFiles = files.images;
                if (imageFiles) {

                    await uploadPostImagesToCloudinary(userId, imageFiles, images);
                }
            }


            /** New post created by user. */
            const newPost = new Post(
                {
                    user: userId,
                    content,
                    images
                }
            );


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

    }
}


/**
 * Uploads post images to cloudinary and stores their publicID and url.
 * @param {String} userId UserId of user who is uploading the post.
 * @param {*} files Image/Video files in the post to be uploaded.
 * @param {*} images Images array to be saved in datbase.
 */
const uploadPostImagesToCloudinary = async (userId, files, images) => {

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
            images.push({ public_id: response_publicId, url: response_url });
        }
    } else if (files) {
        const file = files;
        const cloudinaryPublicId = cloudinaryPublicId_CommonPostId + '_' + '0';
        const response = await cloudinaryUploadMediaFile(file, cloudinaryPublicId);
        const response_publicId = response.public_id;
        const response_url = response.secure_url;
        images.push({ public_id: response_publicId, url: response_url });
    }
}


module.exports = postController;