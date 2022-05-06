import express from 'express';
import FilmReviewController from '../controllers/filmReviewController';

export const filmReviewRouter = express.Router();

filmReviewRouter.post('/leaveReview', FilmReviewController.leaveReview);
filmReviewRouter.get('/:id', FilmReviewController.getById);
filmReviewRouter.delete('/:id', FilmReviewController.deleteById);
filmReviewRouter.get('/score/:id', FilmReviewController.getFilmAvgScore);
filmReviewRouter.get('/film/:id', FilmReviewController.getByFilmId);