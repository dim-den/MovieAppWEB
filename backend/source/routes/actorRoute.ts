import express from 'express';
import { UserRole } from '../constants/userRole';
import ActorController from '../controllers/actorController';
import { checkRole } from '../middleware/checkRole';
import { authenticateJWT } from '../middleware/jwt';
import { newActorRules, updateActorRules, validate } from '../middleware/validationRules';

export const actorRouter = express.Router();

actorRouter.get('/', ActorController.getBySurname);
actorRouter.post('/save', [authenticateJWT, checkRole(UserRole.ADMIN)], newActorRules(), validate, ActorController.saveActor);
actorRouter.get('/all', ActorController.getAll);
actorRouter.post('/uploadImage', [authenticateJWT, checkRole(UserRole.ADMIN)], ActorController.uploadImage);
actorRouter.post('/uploadImage/:id', [authenticateJWT, checkRole(UserRole.ADMIN)], ActorController.uploadImageForActor);
actorRouter.get('/:id', ActorController.getById);
actorRouter.delete('/:id', [authenticateJWT, checkRole(UserRole.ADMIN)], ActorController.deleteById);
actorRouter.put('/update/:id',[ authenticateJWT, checkRole(UserRole.ADMIN)], updateActorRules(), validate, ActorController.updateActor);