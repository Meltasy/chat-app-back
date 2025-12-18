import { Router, Request, Response } from 'express'

const userRouter = Router()

userRouter.get('/me', (req: Request, res: Response) => {
  res.send('Current user home')
})

userRouter.get('/:userId', (req: Request, res: Response) => {
  const { userId } = req.params
  res.send(`User ID: ${userId} Profile`)
})

userRouter.get('/:userId/messages', (req: Request, res: Response) => {
  const { userId } = req.params
  res.send(`User ID: ${userId} Messages`)
})

export default userRouter
