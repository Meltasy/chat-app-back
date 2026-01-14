import { Router } from 'express'
import { getUser, getChats } from '../controllers/userController.js'
import { authenticate } from '../authentication/jwtAuthenticate.js'

const userRouter = Router()

userRouter.get('/:id', getUser)
userRouter.get('/:id/chats', authenticate, getChats)

export default userRouter
