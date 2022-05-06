import { Request, Response } from 'express';
import { FilmCast } from '../models/filmCast';
import { FilmCastService } from '../services/filmCastService';
import { AppError } from '../util/errors';

class FilmCastController {
  async deleteById(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const filmCastService = new FilmCastService();
    try {
      await filmCastService.deleteFilmCast(id);
      res.status(201).json({ message: 'Film cast succefully deleted' });
    } catch (err) {
      next(err);
    }
  }

  async updateFilmCast(req: Request, res: Response, next: any) {
    const filmCastId: number = parseInt(req.params.id);
    const filmCastService = new FilmCastService();
    try {
      const filmCast = req.body as FilmCast;
      await filmCastService.updateFilmCast( filmCastId, filmCast);
      res.status(201).json({ message: 'Film cast succefully updated' });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const filmCastService = new FilmCastService();
    try {
      const info = await filmCastService.getFilmCast(id);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async getByFilmId(req: Request, res: Response, next: any) {
    const filmId: number = parseInt(req.params.id);
    const filmCastService = new FilmCastService();
    try {
      const info = await filmCastService.getFilmCastsByFilmId(filmId);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async getByActorId(req: Request, res: Response, next: any) {
    const actorId: number = parseInt(req.params.id);
    const filmCastService = new FilmCastService();
    try {
      const info = await filmCastService.getFilmCastsByActorId(actorId);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async saveFilmCast(req: Request, res: Response, next: any) {
    const filmCastService = new FilmCastService();
    try {
      const filmCast = req.body as FilmCast; 
      await filmCastService.saveFilmCast(filmCast);
      res.status(201).json({ message: 'New film cast saved' });
    } catch (err) {
      next(err);
    }
  }
}

export default new FilmCastController();