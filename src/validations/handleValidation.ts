import { validationResult } from 'express-validator'
import type { Request, Response, NextFunction } from 'express'

const handleValidation = (req: Request, res: Response, next: NextFunction) => {
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
