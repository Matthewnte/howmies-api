const { body } = require('express-validator');

exports.userSignupValidator = [
  body('firstName')
    .trim(' ')
    .notEmpty()
    .withMessage('Input your first name')
    .isLength({ max: 24 })
    .withMessage('Too long')
    .escape(),
  body('lastName')
    .trim(' ')
    .notEmpty()
    .withMessage('Input your last name')
    .isLength({ max: 24 })
    .withMessage('Too long')
    .escape(),
  body('email')
    .trim(' ')
    .notEmpty()
    .withMessage('Input a user email')
    .isEmail()
    .withMessage('Input correct email address')
    .normalizeEmail({ all_lowercase: true }),
  body('phone')
    .trim(' ')
    .notEmpty()
    .withMessage('Input a phone number into the phone number field')
    .isMobilePhone(['en-NG'])
    .withMessage('Input a standard phone number e.g +234 8012345678')
    .escape(),
  body('password')
    .trim(' ')
    .notEmpty()
    .withMessage('Input a user password')
    .isLength({ max: 24, min: 8 })
    .withMessage('Password must be between 8 - 24 characters')
    .escape(),
];
