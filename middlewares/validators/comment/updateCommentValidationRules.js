const { body } = require('express-validator');

module.exports = [

    body('content').trim()
        .notEmpty()
        .withMessage('Comment can not be empty.')
        .bail()
        .isLength({ max: 150 })
        .withMessage('Comment can not have more than 150 characters long.')

];

