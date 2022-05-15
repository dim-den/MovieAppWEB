import { Request, Response } from 'express';
import { Actor } from '../models/actor';
import { ActorService } from '../services/actorService';
import { AppError } from '../util/errors';
import { CloudinaryService } from '../services/cloudinaryService';
const formidable = require('formidable');

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

  async updateActor(req: Request, res: Response, next: any) {
    const actorId: number = parseInt(req.params.id);
    const actorService = new ActorService();
    try {
      const actor = req.body as Actor;
      await actorService.updateActor(actorId, actor);
      res.status(201).json({ message: 'Actor succefully updated' });
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async uploadImageForActor(req: Request, res: Response, next: any) {
    const actorId: number = parseInt(req.params.id);
    const form = new formidable.Formidable();
    const cloudinaryService = new CloudinaryService();
    const actorService = new ActorService();

    form.parse(req, async (err: any, fields: any, files: any) => {
      try {
        let path = files.file.filepath;
        const actor = await actorService.getActor(actorId);
        let result: any = await cloudinaryService.UploadImage(path, 'actors');
        if(result) await actorService.updateActorImage(actor.id, result.url)
        res.status(200).json({ message: 'Succesfully set image' });
      } catch (err: any) {
        next(new AppError(err.message));
      }
    });
  }

  async uploadImage(req: Request, res: Response, next: any) {
    const form = new formidable.Formidable();
    const cloudinaryService = new CloudinaryService();
    
    form.parse(req, async (err: any, fields: any, files: any) => {
      try {
        let path = files.file.filepath;
        let result: any = await cloudinaryService.UploadImage(path, 'actors');
        res.status(200).json(result);
      } catch (err: any) {
        next(new AppError(err.message));
      }
    });
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

  async getBySurname(req: Request, res: Response, next: any) {
    const surname : string = req.query.surname?.toString() || '';
    const actorService = new ActorService();
    try {
      const info = await actorService.getActorsBySurnameContainingTop5(surname);
      
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async getAll(req: Request, res: Response, next: any) {
    const actorService = new ActorService();
    try {
      const info = await actorService.getActors();
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
    } catch (err: any) {
      console.log('sec123');
      next(new AppError(err.message));
    }
  }
}

export default new ActorController();