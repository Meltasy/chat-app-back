import { Router } from 'express'
import { getUser, getAllUsers } from '../controllers/userController.js'
import { validateUuidParam } from '../validations/paramValidation.js'

const userRouter = Router()

userRouter.get('/allUsers', getAllUsers)
userRouter.get('/:userId', validateUuidParam('userId'), getUser)

export default userRouter
