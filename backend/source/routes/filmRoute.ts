import express from 'express';
import FilmController from '../controllers/filmController';
import { UserRole } from '../constants/userRole';
import { checkRole } from '../middleware/checkRole';
import { authenticateJWT } from '../middleware/jwt';
import { newFilmRules, updateFilmRules, validate } from '../middleware/validationRules';

export const filmRouter = express.Router();

filmRouter.get('/', FilmController.getByTitle);
filmRouter.post('/save', [authenticateJWT, checkRole(UserRole.ADMIN)],  newFilmRules(), validate, FilmController.saveFilm);
filmRouter.get('/all', FilmController.getAll);
filmRouter.get('/:id', FilmController.getById);
filmRouter.delete('/:id', [authenticateJWT, checkRole(UserRole.ADMIN)], FilmController.deleteById);
filmRouter.put('/update/:id', [authenticateJWT, checkRole(UserRole.ADMIN)], updateFilmRules(), validate, FilmController.updateFilm);