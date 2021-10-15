const { body, oneOf } = require('express-validator');

module.exports = [

    oneOf([

        body('content')
            .notEmpty(),

        body('media')
            .notEmpty()

    ], 'Post cannot be empty. Post should either include text or media.'),


    body('content').trim().replace(/ +(?= )/g, '')
        .isLength({ max: 500 })
        .withMessage('Post content can not be more than 500 characters long.')

];