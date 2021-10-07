const Post = require("../models/postModel");

const postController = {

    createPost: async (req, res) => {

        try {

            /** Id of user who created the post. */
            const userId = req.user._id;

            
            /* Post Content, Images recieved in request. */
            const { content, images } = req.body;


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



module.exports = postController;