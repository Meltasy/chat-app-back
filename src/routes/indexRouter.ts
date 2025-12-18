import { Router, Request, Response } from 'express'

const indexRouter = Router()

indexRouter.get('/register', (req: Request, res: Response) => {
  res.send('Register user')
})

indexRouter.get('/login', (req: Request, res: Response) => {
  res.send('Login user')
})

indexRouter.get('/logout', (req: Request, res: Response) => {
  res.send('Logout user')
})

export default indexRouter
