import { Router } from 'express'
import { getUser, getAllUsers } from '../controllers/userController.js'
import { validateUuidParam } from '../validations/paramValidation.js'
import { authenticate } from '../authentication/jwtAuthenticate.js'

const userRouter = Router()

userRouter.get<{ id: string }>('/:id', validateUuidParam('id'), getUser)
userRouter.get('/allUsers', authenticate, getAllUsers)

export default userRouter
