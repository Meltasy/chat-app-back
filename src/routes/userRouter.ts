import { Router } from 'express'
import { getUser, getAllUsers } from '../controllers/userController.js'
import { validateUuidParam } from '../validations/paramValidation.js'
import { authenticate } from '../authentication/jwtAuthenticate.js'

const userRouter = Router()

userRouter.get('/allUsers', authenticate, getAllUsers)
userRouter.get<{ userId: string }>('/:userId', validateUuidParam('userId'), getUser)

export default userRouter
