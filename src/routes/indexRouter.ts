import { Router } from 'express'
import { register, login } from '../controllers/indexController.js'

const indexRouter = Router()

indexRouter.post('/register', register)
indexRouter.post('/login', login)

export default indexRouter
