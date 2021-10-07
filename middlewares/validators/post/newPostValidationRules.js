const { body, oneOf } = require('express-validator');

module.exports = [

    oneOf([
        body('content')
            .notEmpty(),

        body('images')
            .notEmpty()

    ], 'Post cannot be empty. Post should either include text or images.'),


    body('content').trim().replace(/ +(?= )/g, '')
        .isLength({ max: 500 })
        .withMessage('Post content can not be more than 500 characters long.'),


    body('images')
        .if(body('images').notEmpty())
        .isArray({ max: 10 })
        .withMessage('Post cannot have more than 10 images.')

];