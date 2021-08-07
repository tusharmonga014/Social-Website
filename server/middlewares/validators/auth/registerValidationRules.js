const { body } = require('express-validator')

module.exports = [

  body('fullName').trim()
    .notEmpty()
    .withMessage('Fullname is required.')
    .bail()
    .isLength({ max: 25 })
    .withMessage('Fullname should not be more than 25 characters long.'),


  body('username').trim().toLowerCase()
    .notEmpty()
    .withMessage('username is required.')
    .bail()
    .matches(/^\S*$/)
    .withMessage('Username cannot have white-spaces.')
    .bail()
    .matches(/^[a-zA-Z]/)
    .withMessage('Username can only start with an alphabet.')
    .bail()
    .matches(/^[a-zA-Z][a-zA-Z0-9/_]+$/)
    .withMessage('Username can only have aplhabets, digits and an underscore.')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Username must be atleast 3 characters long.')
    .bail()
    .isLength({ max: 25 })
    .withMessage('Username should not be more than 25 characters long.'),


  body('email').normalizeEmail().trim()
    .notEmpty()
    .withMessage('Email is required.')
    .bail()
    .isEmail()
    .withMessage('Invalid Email.'),


  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password should be atleast 6 characters long.'),


  body('gender').trim().toLowerCase()
    .notEmpty()
    .withMessage('Gender is required.')
    .bail()
    .isIn(['male', 'female', 'others']),
]