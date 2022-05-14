import { Request, Response } from 'express';
import { Film } from '../models/film';
import { CloudinaryService } from '../services/cloudinaryService';
import { FilmService } from '../services/filmService';
import { AppError } from '../util/errors';
const formidable = require('formidable');

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

  async uploadPosterForFilm(req: Request, res: Response, next: any) {
    const filmId: number = parseInt(req.params.id);
    const form = new formidable.Formidable();
    const cloudinaryService = new CloudinaryService();
    const filmService = new FilmService();

    form.parse(req, async (err: any, fields: any, files: any) => {
      try {
        let path = files.file.filepath;
        const film = await filmService.getFilm(filmId);
        let result: any = await cloudinaryService.UploadImage(path, 'posters');
        if(result) await filmService.updateFilmPoster(film.id, result.url)
        res.status(200).json({ message: 'Succesfully set poster' });
      } catch (err: any) {
        next(new AppError(err.message));
      }
    });
  }

  async uploadPoster(req: Request, res: Response, next: any) {
    const form = new formidable.Formidable();
    const cloudinaryService = new CloudinaryService();
    
    form.parse(req, async (err: any, fields: any, files: any) => {
      try {
        let path = files.file.filepath;
        let result: any = await cloudinaryService.UploadImage(path, 'posters');
        res.status(200).json(result);
      } catch (err: any) {
        next(new AppError(err.message));
      }
    });
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

  async getByTitle(req: Request, res: Response, next: any) {
    const title : string = req.query.title?.toString() || '';
    const filmService = new FilmService();
    try {
      const info = await filmService.getFilmsByTitleContainingTop5(title);
      
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