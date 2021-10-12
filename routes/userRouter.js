const express = require('express');
const userRouter = express.Router();
const auth = require('../middlewares/authentication/auth');
const userController = require('../controllers/userController');

userRouter.get('/search', auth, userController.searchUser);

userRouter.get('/get-user/:id', auth, userController.getUser);

userRouter.patch('/:id/follow', auth, userController.follow);

userRouter.patch('/:id/unfollow', auth, userController.unfollow);

userRouter.get('/user-suggestions', auth, userController.suggestionsForUser);

module.exports = userRouter;