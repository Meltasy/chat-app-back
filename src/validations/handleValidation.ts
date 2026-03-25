import { validationResult } from 'express-validator'
import type { RequestHandler } from 'express'

const handleValidation: RequestHandler = (req, res, next) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map(e => e.msg).join(', ')
    })
  }
  next()
}

export { handleValidation }
