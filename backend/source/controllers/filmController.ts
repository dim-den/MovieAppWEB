import { Request, Response } from 'express';
import { Film } from '../models/film';
import { FilmService } from '../services/filmService';
import { AppError } from '../util/errors';

class FilmController {
  async deleteById(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const filmService = new FilmService();
    try {
      await filmService.deleteFilm(id);
      res.status(201).json({ message: 'Film succefully deleted' });
    } catch (err) {
      next(err);
    }
  }

  async updateFilm(req: Request, res: Response, next: any) {
    const filmId: number = parseInt(req.params.id);
    const filmService = new FilmService();
    try {
      const film = req.body as Film;
      await filmService.updateFilm( filmId, film);
      res.status(201).json({ message: 'Film succefully updated' });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const filmService = new FilmService();
    try {
      const info = await filmService.getFilm(id);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async getAll(req: Request, res: Response, next: any) {
    const filmService = new FilmService();
    try {
      const info = await filmService.getFilms();
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async saveFilm(req: Request, res: Response, next: any) {
    const filmService = new FilmService();
    try {
      const film = req.body as Film; 
      await filmService.saveFilm(film);
      res.status(201).json({ message: 'New film saved' });
    } catch (err) {
      next(err);
    }
  }
}

export default new FilmController();