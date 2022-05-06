import express from 'express';
import ActorController from '../controllers/actorController';

export const actorRouter = express.Router();

actorRouter.post('/save', ActorController.saveActor);
actorRouter.get('/:id', ActorController.getById);
actorRouter.delete('/:id', ActorController.deleteById);