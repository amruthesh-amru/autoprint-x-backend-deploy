import express from 'express'
import { checkAuth, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/logout', logoutUser)
userRouter.post('/checkAuth', checkAuth)

export default userRouter
