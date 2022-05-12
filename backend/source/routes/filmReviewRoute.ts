import express from 'express';
import { UserRole } from '../constants/userRole';
import FilmReviewController from '../controllers/filmReviewController';
import { checkRole } from '../middleware/checkRole';
import { authenticateJWT } from '../middleware/jwt';
import { leaveReviewRules, leaveScoreRules, newFilmReviewRules, updateFilmReviewRules, validate } from '../middleware/validationRules';

export const filmReviewRouter = express.Router();

filmReviewRouter.post('/leaveReview', authenticateJWT, leaveReviewRules(), validate,  FilmReviewController.saveReview);
filmReviewRouter.post('/leaveScore', authenticateJWT, leaveScoreRules(), validate,  FilmReviewController.saveReview);
filmReviewRouter.post('/save', [authenticateJWT, checkRole(UserRole.ADMIN)], newFilmReviewRules(), validate, FilmReviewController.saveFilmReview);
filmReviewRouter.put('/update/:id', [authenticateJWT, checkRole(UserRole.ADMIN)], updateFilmReviewRules(), validate, FilmReviewController.updateFilmReview);
filmReviewRouter.get('/', FilmReviewController.getByUserIdAndFilmId);
filmReviewRouter.get('/all', FilmReviewController.getAll);
filmReviewRouter.get('/:id', FilmReviewController.getById);
filmReviewRouter.delete('/:id', [authenticateJWT, checkRole(UserRole.ADMIN)],  FilmReviewController.deleteById);
filmReviewRouter.get('/userAvgScore/:id', FilmReviewController.getUserFilmAvgScore);
filmReviewRouter.get('/score/:id', FilmReviewController.getFilmAvgScore);
filmReviewRouter.get('/film/:id', FilmReviewController.getByFilmId);
filmReviewRouter.get('/user/:id', FilmReviewController.getByUserId);