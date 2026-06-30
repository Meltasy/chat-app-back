import { body } from 'express-validator'

const reqErr = 'is required.'
const lengthErr = 'must be between 5 and 100 characters.'
const emailErr = 'This is not a valid email address.'

const validateNewUser = [
  body('username')
    .trim()
    .notEmpty().withMessage(`Username ${reqErr}`)
    .isLength({ min: 5, max: 100 }).withMessage(`Username ${lengthErr}`)
    .matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/).withMessage('Username must only contain letters and single spaces between words.')
    .escape(),
  body('email')
    .notEmpty().withMessage(`Email ${reqErr}`)
    .isEmail().withMessage(`${emailErr}`)
    .isLength({ min: 5, max: 100 }).withMessage(`Email ${lengthErr}`)
    .normalizeEmail({ gmail_remove_dots: false }),
  body('password')
    .trim()
    .notEmpty().withMessage(`Password ${reqErr}`)
    .isLength({ min: 8, max: 24 }).withMessage('Password must be between 8 and 24 characters.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).*$/).withMessage('Password must contain one number, one lowercase letter, one uppercase letter, one special character and no spaces.')
]

const validateLogin = [
  body('email')
    .notEmpty().withMessage(`Email ${reqErr}`)
    .isEmail().withMessage(`${emailErr}`),
  body('password')
    .notEmpty().withMessage(`Password ${reqErr}`)
]

const validateUpdateUsername = [
  body('username')
    .trim()
    .notEmpty().withMessage(`Username ${reqErr}`)
    .isLength({ min: 5, max: 100 }).withMessage(`Username ${lengthErr}`)
    .matches(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/).withMessage('Username must only contain letters and single spaces between words.')
    .escape()
]

const validateUpdatePassword = [
  body('currentPassword')
    .notEmpty().withMessage(`Current password ${reqErr}`),
  body('newPassword')
    .trim()
    .notEmpty().withMessage(`New password ${reqErr}`)
    .isLength({ min: 8, max: 24 }).withMessage('Password must be between 8 and 24 characters.')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).*$/).withMessage('Password must contain one number, one lowercase letter, one uppercase letter, one special character and no spaces.')
]

export {
  validateNewUser,
  validateLogin,
  validateUpdateUsername,
  validateUpdatePassword
}