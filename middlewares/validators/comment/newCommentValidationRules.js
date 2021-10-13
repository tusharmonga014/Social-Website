const { body } = require('express-validator');

module.exports = [

    body('content').trim()
        .notEmpty()
        .withMessage('Comment can not be empty.')
        .bail()
        .isLength({ max: 150 })
        .withMessage('Comment can not have more than 150 characters long.'),


    body('postId')
        .notEmpty()
        .withMessage('PostId is required.')
        .bail()
        .isMongoId()
        .withMessage('PostId is not a valid.'),


    body('postUserId')
        .notEmpty()
        .withMessage('PostUserId is required.')
        .bail()
        .isMongoId()
        .withMessage('PostUserId is not a valid id.'),


    body('reply')
        .if(body('reply').notEmpty()).isMongoId()
        .withMessage('Reply is not a valid id.')

];