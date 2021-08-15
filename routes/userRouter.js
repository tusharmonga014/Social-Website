const express = require('express');
const userRouter = express.Router();
const auth = require('../middlewares/authentication/auth');
const userController = require('../controllers/userController');

userRouter.get('/search', auth, userController.searchUser);

userRouter.get('/user/:id', auth, userController.getUser);

module.exports = userRouter;