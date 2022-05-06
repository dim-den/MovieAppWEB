import express from 'express';
import FilmController from '../controllers/filmController';

export const filmRouter = express.Router();

filmRouter.post('/save', FilmController.saveFilm);
filmRouter.get('/:id', FilmController.getById);
filmRouter.delete('/:id', FilmController.deleteById);
filmRouter.put('/update/:id', FilmController.updateFilm);