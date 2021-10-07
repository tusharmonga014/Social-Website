const express = require('express');
const authRouter = require('./authRouter');
const postRouter = require('./postRouter');
const userRouter = require('./userRouter');
const router = express.Router();

router.use('/auth', authRouter);

router.use('/user', userRouter);

router.use('/posts', postRouter);

module.exports = router;