import { Router } from 'express'
import { register, login } from '../controllers/indexController.js'
import { validateNewUser, validateLogin } from '../validations/userValidation.js'

const indexRouter = Router()

indexRouter.post('/register', validateNewUser, register)
indexRouter.post('/login', validateLogin, login)

export default indexRouter
