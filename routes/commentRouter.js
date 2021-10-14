const express = require('express');
const commentRouter = express.Router();
const auth = require('../middlewares/authentication/auth');
const validateData = require('../middlewares/validators');
const commentController = require('../controllers/commentController');

commentRouter.post('/create-comment', auth, validateData.createComment, commentController.createComment);

commentRouter.patch('/:id/update-comment', auth, validateData.updateComment, commentController.updateComment);

commentRouter.delete('/:id/delete-comment', auth, commentController.deleteComment);

commentRouter.post('/:id/like-comment', auth, commentController.likeComment);

commentRouter.post('/:id/unlike-comment', auth, commentController.unlikeComment);

module.exports = commentRouter;