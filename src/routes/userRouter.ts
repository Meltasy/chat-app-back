import { Router } from 'express'
import { getUser, getChats } from '../controllers/userController.js'
import { authenticate } from '../authentication/jwtAuthenticate.js'
import { validateUuidParam } from '../validations/paramValidation.js'

const userRouter = Router()

userRouter.get<{ id: string }>('/:id', validateUuidParam('id'), getUser)
userRouter.get<{ id: string }>('/:id/chats', authenticate, validateUuidParam('id'), getChats)

export default userRouter
