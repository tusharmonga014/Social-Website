const express = require('express');
const authRouter = express.Router();
const validateData = require('../middlewares/validators');
const authController = require('../controllers/authController');

authRouter.post('/register', validateData.register, authController.register);

authRouter.post('/login', validateData.login, authController.login);

authRouter.post('/logout', authController.logout);

authRouter.post('/refresh_token', authController.generateAccessTokenByRefreshToken);

module.exports = authRouter;