import express from 'express';
import { userRouter } from './userRoute';
import { authRouter } from './authRoute';


export const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);