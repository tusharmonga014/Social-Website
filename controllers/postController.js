const Post = require("../models/postModel");
const cloudinaryFileUpload = require('../utils/cloudinaryFileUpload');
const getDateTimeForUpload = require("../utils/getDateTimeForUpload");

const postController = {

    createPost: async (req, res) => {

        try {

            /** Id of user who created the post. */
            const userId = req.user._id;

            /* Post content recieved in request. */
            const { content } = req.body;


            /** Files recieved in request. */
            const files = req.files;
            if (files) {


                /** Post images and video files in request. */
                const images = files.images;
                if (images) {


                    /** Date and Time for upload record and publicID of post file. */
                    const dateTime = getDateTimeForUpload();

                    /** Cloudinary common post public_id for storing post file along with upload date and time for file name. */
                    const cloudinaryPublicId_CommonPostId = 'posts/' + userId + '_' + dateTime;


                    if (images.length > 1) {

                        for (let fileCounter = 0; fileCounter < images.length; fileCounter++) {
                            const file = images[fileCounter];
                            const fileBuffer = file.data;
                            const fileType = file.mimetype.substring(0, 5) === 'image' ? 'image' : 'video';
                            const cloudinaryPublicId = cloudinaryPublicId_CommonPostId + '_' + fileCounter;
                            const result = await cloudinaryFileUpload(fileBuffer, fileType, cloudinaryPublicId);
                            console.log(result); // WORK TO BE DONE
                        }

                    } else if (images) {

                        const file = images;
                        const fileBuffer = file.data;
                        const fileType = file.mimetype.substring(0, 5) === 'image' ? 'image' : 'video';
                        const cloudinaryPublicId = cloudinaryPublicId_CommonPostId + '_' + '0';
                        const result = await cloudinaryFileUpload(fileBuffer, fileType, cloudinaryPublicId);
                        console.log(result); // WORK TO BE DONE

                    }

                }

            }


            /** New post created by user. */
            const newPost = new Post(
                {
                    user: userId,
                    content,
                    // images
                }
            );


            /* Saving the new post. */
            // await newPost.save();


            res.json({
                msg: 'Post Created.',
                newPost: {
                    ...newPost._doc
                }
            });


        } catch (err) {

            console.log(err);
            return res.status(500).json({ msg: err.message });
        }

    }
}



module.exports = postController;