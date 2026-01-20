import { body } from 'express-validator'

const reqErr = 'is required.'

const validateNewChat = [
  body('name')
    .trim()
    .notEmpty().withMessage(`Name ${reqErr}`)
    .isLength({ min: 5, max: 100 }).withMessage('Name must be between 5 and 100 characters.')
]


const validateNewMessage = [
  body('text')
    .trim()
    .notEmpty().withMessage(`Message ${reqErr}`)
    .isLength({ min: 5, max: 250 }).withMessage('Message must be between 5 and 250 characters.')
]

export {
  validateNewChat,
  validateNewMessage
}