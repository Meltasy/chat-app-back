import { body } from 'express-validator'

const reqErr = 'is required.'

const validateNewChat = [
  body('name')
    .trim()
    .notEmpty().withMessage(`Name ${reqErr}`)
    .isLength({ min: 5, max: 100 }).withMessage('Name must be between 5 and 100 characters.'),
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
    })
]

const validateNewMessage = [
  body('text')
    .custom((value) => value.trim().length > 0)
    .notEmpty().withMessage(`Message ${reqErr}`)
    .isLength({ min: 5, max: 250 }).withMessage('Message must be between 5 and 250 characters.')
]

export {
  validateNewChat,
  validateNewMessage
}
