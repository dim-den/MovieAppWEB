import { Request, Response } from 'express';
import { Actor } from '../models/actor';
import { ActorService } from '../services/actorService';
import { AppError } from '../util/errors';

class ActorController {
  async deleteById(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const actorService = new ActorService();
    try {
      await actorService.deleteActor(id);
      res.status(201).json({ message: 'Actor succefully deleted' });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const actorService = new ActorService();
    try {
      const info = await actorService.getActor(id);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async saveActor(req: Request, res: Response, next: any) {
    const actorService = new ActorService();
    try {
      const actor = req.body as Actor; 
      await actorService.saveActor(actor);
      res.status(201).json({ message: 'New actor saved' });
    } catch (err) {
      next(err);
    }
  }
}

export default new ActorController();