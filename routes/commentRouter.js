const express = require('express');
const commentRouter = express.Router();
const auth = require('../middlewares/authentication/auth');
const validateData = require('../middlewares/validators');
const commentController = require('../controllers/commentController');

commentRouter.post('/create-comment', auth, validateData.createComment, commentController.createComment);

commentRouter.patch('/:id/update-comment', auth, validateData.updateComment, commentController.updateComment);

commentRouter.delete('/:id/delete-comment', auth, commentController.deleteComment);

module.exports = commentRouter;