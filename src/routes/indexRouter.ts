import { Router, Request, Response } from 'express'
import { register, login } from '../controllers/indexController.js'

const indexRouter = Router()

indexRouter.get('/register', (req: Request, res: Response) => {
  res.send('Register user')
})
indexRouter.post('/register', register)

indexRouter.get('/login', (req: Request, res: Response) => {
  res.send('Login user')
})
indexRouter.post('/login', login)

export default indexRouter
