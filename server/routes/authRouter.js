const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');
const validateData = require('../middlewares/validators');

authRouter.post('/register', validateData.register, authController.register);

authRouter.post('/login', authController.login);

authRouter.post('/logout', authController.logout);

authRouter.post('/refresh_token', authController.generateAccessTokenByRefreshToken);

module.exports = authRouter;