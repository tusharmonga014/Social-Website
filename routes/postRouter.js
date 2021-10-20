const express = require('express');
const postRouter = express.Router();
const auth = require('../middlewares/authentication/auth');
const validateData = require('../middlewares/validators');
const postController = require('../controllers/postController');

postRouter.post('/create-post', auth, validateData.createPost, postController.createPost);

postRouter.get('/feed-posts', auth, postController.getPosts);

postRouter.patch('/:id/update-post', auth, validateData.updatePost, postController.updatePost);

postRouter.delete('/:id/delete-post', auth, postController.deletePost);

postRouter.patch('/:id/like-post', auth, postController.likePost);

postRouter.patch('/:id/unlike-post', auth, postController.unlikePost);

postRouter.get('/:id/get-user-posts', auth, postController.getUserPosts);

postRouter.get('/:id/get-post', auth, postController.getPost);

postRouter.get('/:id/get-user-media', auth, postController.getUserMedia);

postRouter.patch('/:id/save-post', auth, postController.savePost);

postRouter.patch('/:id/unsave-post', auth, postController.unsavePost);

module.exports = postRouter;