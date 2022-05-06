import { Request, Response } from 'express';
import { FilmReview } from '../models/filmReview';
import { FilmReviewService } from '../services/filmReviewService';
import { AppError } from '../util/errors';

class FilmReviewController {
  async deleteById(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const filmReviewService = new FilmReviewService();
    try {
      await filmReviewService.deleteFilmReview(id);
      res.status(201).json({ message: 'Film review succefully deleted' });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const filmReviewService = new FilmReviewService();
    try {
      const info = await filmReviewService.getFilmReview(id);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async getByFilmId(req: Request, res: Response, next: any) {
    const filmId: number = parseInt(req.params.id);
    const filmReviewService = new FilmReviewService();
    try {
      const info = await filmReviewService.getFilmReviewsByFilmId(filmId);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async getByUserId(req: Request, res: Response, next: any) {
    const userId: number = parseInt(req.params.id);
    const filmReviewService = new FilmReviewService();
    try {
      const info = await filmReviewService.getFilmReviewsByUserId(userId);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async leaveReview(req: Request, res: Response, next: any) {
    const filmReviewService = new FilmReviewService();
    try {
      const filmReview = req.body as FilmReview;
      await filmReviewService.leaveFilmReview(filmReview);
      res.status(201).json({ message: 'New film review saved' });
    } catch (err) {
      next(err);
    }
  }

  async getFilmAvgScore(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const filmReviewService = new FilmReviewService();
    try {
      const info = await filmReviewService.getFilmAvgScore(id);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }
}

export default new FilmReviewController();