const { body } = require('express-validator')

module.exports = [

  body('fullName').trim()
    .notEmpty()
    .withMessage('Full Name is required.')
    .bail()
    .matches(/^[A-Za-z ]+$/)
    .withMessage('Full Name can only have lowercase and uppercase alphabets.')
    .bail()
    .isLength({ max: 25 })
    .withMessage('Full Name should not be more than 25 characters long.'),


  body('username').trim().toLowerCase()
    .notEmpty()
    .withMessage('Username is required.')
    .bail()
    .matches(/^\S*$/)
    .withMessage('Username cannot have white-spaces.')
    .bail()
    .matches(/^[a-z]/)
    .withMessage('Username can only start with a lowercase alphabet.')
    .bail()
    .matches(/^[a-z][a-z0-9/_]+$/)
    .withMessage('Username can only have lowercase aplhabets, digits and an underscore.')
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