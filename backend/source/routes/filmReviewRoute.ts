import express from 'express';
import { UserRole } from '../constants/userRole';
import FilmReviewController from '../controllers/filmReviewController';
import { checkRole } from '../middleware/checkRole';
import { authenticateJWT } from '../middleware/jwt';
import { leaveReviewRules, leaveScoreRules, validate } from '../middleware/validationRules';

export const filmReviewRouter = express.Router();

filmReviewRouter.post('/leaveReview', authenticateJWT, leaveReviewRules(), validate,  FilmReviewController.saveReview);
filmReviewRouter.post('/leaveScore', authenticateJWT, leaveScoreRules(), validate,  FilmReviewController.saveReview);
filmReviewRouter.get('/:id', FilmReviewController.getById);
filmReviewRouter.delete('/:id', [authenticateJWT, checkRole(UserRole.ADMIN)],  FilmReviewController.deleteById);
filmReviewRouter.get('/score/:id', FilmReviewController.getFilmAvgScore);
filmReviewRouter.get('/film/:id', FilmReviewController.getByFilmId);
filmReviewRouter.get('/user/:id', FilmReviewController.getByUserId);