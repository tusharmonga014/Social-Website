const express = require('express');
const userRouter = express.Router();
const auth = require('../middlewares/authentication/auth');
const userController = require('../controllers/userController');

userRouter.get('/search', auth, userController.searchUser);

userRouter.get('/:id', auth, userController.getUser);

userRouter.patch('/:id/follow', auth, userController.follow);

userRouter.patch('/:id/unfollow', auth, userController.follow);

module.exports = userRouter;