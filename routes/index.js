const express = require('express');
const authRouter = require('./authRouter');
const commentRouter = require('./commentRouter');
const postRouter = require('./postRouter');
const userRouter = require('./userRouter');
const router = express.Router();

router.use('/auth', authRouter);

router.use('/user', userRouter);

router.use('/posts', postRouter);

router.use('/comments', commentRouter);

module.exports = router;