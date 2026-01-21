import { param } from 'express-validator'

const validateUuidParam = (name: string) =>
  param(name)
    .isUUID().withMessage(`${name} must be a valid UUID`)

export { validateUuidParam }
