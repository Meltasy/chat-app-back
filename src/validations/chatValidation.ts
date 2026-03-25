import { body } from 'express-validator'

const reqErr = 'is required.'

const validateNewChat = [
  body('members')
    .isArray({ min: 1 }).withMessage('Members must be an array of at least one.')
    .custom((members: string[]) => {
      for (const id of members) {
        if(!/^[0-9a-f-]{36}$/i.test(id)) {
          throw new Error('All member IDs must be valid UUIDs.')
        }
      }
      return true
    })
    .custom((members) => {
      if (new Set(members).size !== members.length) throw new Error('Duplicate members not allowed.')
      return true
    }),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage(`Name ${reqErr}`)
    .isLength({ min: 5, max: 100 }).withMessage('Name must be between 5 and 100 characters.')
]

const validateChatName = [
  body('name')
    .trim()
    .notEmpty().withMessage(`Name ${reqErr}`)
    .isLength({ min: 5, max: 100 }).withMessage('Name must be between 5 and 100 characters.')
]

const validateMessage = [
  body('text')
    .trim()
    .notEmpty().withMessage(`Message ${reqErr}`)
    .isLength({ min: 5, max: 250 }).withMessage('Message must be between 5 and 250 characters.')
]

export {
  validateNewChat,
  validateChatName,
  validateMessage
}
