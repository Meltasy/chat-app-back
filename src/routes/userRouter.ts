import { Router } from 'express'
import { getUser, getAllUsers, updateUsername, updatePassword } from '../controllers/userController.js'
import { validateUpdateUsername, validateUpdatePassword } from '../validations/userValidation.js'
import { validateUuidParam } from '../validations/paramValidation.js'
import { handleValidation } from '../validations/handleValidation.js'

const userRouter = Router()

userRouter.get('/allUsers', getAllUsers)
userRouter.get('/:userId', validateUuidParam('userId'), getUser)
userRouter.patch('/username', validateUpdateUsername, handleValidation, updateUsername)
userRouter.patch('/password', validateUpdatePassword, handleValidation, updatePassword)

export default userRouter
