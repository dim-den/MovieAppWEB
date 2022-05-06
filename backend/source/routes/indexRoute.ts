import express from 'express';
import { userRouter } from './userRoute';
import { authRouter } from './authRoute';
import { filmRouter } from './filmRoute';
import { filmReviewRouter } from './filmReviewRoute';
import { actorRouter } from './actorRoute';
import { filmCastRouter } from './filmCastRoute';

export const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/film', filmRouter);
router.use('/filmReview', filmReviewRouter);
router.use('/actor', actorRouter);
router.use('/filmCast', filmCastRouter);

