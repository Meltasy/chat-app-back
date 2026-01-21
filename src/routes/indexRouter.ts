import { Router } from 'express'
import { register, login } from '../controllers/indexController.js'
import { validateNewUser, validateLogin } from '../validations/userValidation.js'
import { handleValidation } from '../validations/handleValidation.js'

const indexRouter = Router()

indexRouter.post('/register', validateNewUser, handleValidation, register)
indexRouter.post('/login', validateLogin, handleValidation, login)

export default indexRouter
