import { Router } from 'express'
import { getUser, getChats } from '../controllers/userController.js'
// Need to set up authentication
import { authenticate } from '../'

const userRouter = Router()

userRouter.get('/:id', getUser)
userRouter.get('/:id/chats', authenticate, getChats)

export default userRouter
