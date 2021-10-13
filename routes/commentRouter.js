const express = require('express');
const commentRouter = express.Router();
const auth = require('../middlewares/authentication/auth');
const validateData = require('../middlewares/validators');
const commentController = require('../controllers/commentController');

commentRouter.post('/create-comment', auth, validateData.createComment, commentController.createComment);

module.exports = commentRouter;