import express from 'express';
import FilmCastController from '../controllers/filmCastController';

export const filmCastRouter = express.Router();

filmCastRouter.post('/save', FilmCastController.saveFilmCast);
filmCastRouter.get('/:id', FilmCastController.getById);
filmCastRouter.delete('/:id', FilmCastController.deleteById);
filmCastRouter.get('/film/:id', FilmCastController.getByFilmId);