const { body, oneOf } = require('express-validator')

module.exports = [

    body('usernameOrEmail').trim()
        .notEmpty()
        .withMessage('Username or Email is required.'),


    oneOf([
        body('usernameOrEmail')
            .isEmail()
            .normalizeEmail(),

        body('usernameOrEmail')
            .not()
            .isEmail()
            .matches(/^[a-z][a-z0-9/_]+$/)
            .bail()
            .isLength({ min: 3, max: 25 })

    ], 'Username or Email is not valid.'),


    body('password')
        .notEmpty()
        .withMessage('Password is required.')
];