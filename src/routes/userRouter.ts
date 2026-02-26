import { Router } from 'express'
import { getUser} from '../controllers/userController.js'
import { validateUuidParam } from '../validations/paramValidation.js'

const userRouter = Router()

userRouter.get<{ id: string }>('/:id', validateUuidParam('id'), getUser)

export default userRouter
