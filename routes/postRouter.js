const express = require('express');
const postRouter = express.Router();
const auth = require('../middlewares/authentication/auth');
const validateData = require('../middlewares/validators');
const postController = require('../controllers/postController');

postRouter.post('/create-post', auth, validateData.createPost, postController.createPost);

module.exports = postRouter;