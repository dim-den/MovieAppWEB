import express from 'express';
import FilmCastController from '../controllers/filmCastController';
import { UserRole } from '../constants/userRole';
import { checkRole } from '../middleware/checkRole';
import { authenticateJWT } from '../middleware/jwt';
import { newFilmCastRules, updateFilmCastRules, validate } from '../middleware/validationRules';

export const filmCastRouter = express.Router();

filmCastRouter.post('/save', [authenticateJWT, checkRole(UserRole.ADMIN)], newFilmCastRules(), validate, FilmCastController.saveFilmCast);
filmCastRouter.get('/all', FilmCastController.getAll);
filmCastRouter.get('/:id', FilmCastController.getById);
filmCastRouter.delete('/:id', [authenticateJWT, checkRole(UserRole.ADMIN)], FilmCastController.deleteById);
filmCastRouter.get('/film/:id', FilmCastController.getByFilmId);
filmCastRouter.get('/actor/:id', FilmCastController.getByActorId);
filmCastRouter.put('/update/:id', [authenticateJWT, checkRole(UserRole.ADMIN)], updateFilmCastRules(), validate, FilmCastController.updateFilmCast);