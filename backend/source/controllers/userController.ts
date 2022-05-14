import { Request, Response } from 'express';
import { User } from '../models/user';
import { AuthService } from '../services/authService';
import { CloudinaryService } from '../services/cloudinaryService';
import { UserService } from '../services/userService';
import { AppError } from '../util/errors';
const formidable = require('formidable');


class UserController {
  async deleteById(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const userService = new UserService();
    try {
      await userService.deleteUser(id);
      res.status(201).json({ message: 'User succefully deleted' });
    } catch (err) {
      next(err);
    }
  }

  async getByToken(req: Request, res: Response, next: any) {
    const userService = new UserService();
    try {
      const token = req.body.token;
      const info = await userService.getUserByToken(token);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async getAll(req: Request, res: Response, next: any) {
    const userService = new UserService();
    try {
      const info = await userService.getUsers();
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async updateUser(req: Request, res: Response, next: any) {
    const userId: number = parseInt(req.params.id);
    const userService = new UserService();
    try {
      const user = req.body as User;
      await userService.updateUser(userId, user);
      res.status(201).json({ message: 'User succefully updated' });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const token = req.headers.authorization!.split(' ')[1];
    const userService = new UserService();
    try {
      const info = await userService.getUser(token, id);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
  }

  async uploadImage(req: Request, res: Response, next: any) {
    const token = req.headers.authorization!.split(' ')[1];
    const form = new formidable.Formidable();
    const cloudinaryService = new CloudinaryService();
    const userService = new UserService();
    form.parse(req, async (err: any, fields: any, files: any) => {
      try {
        const user = await userService.getUserByToken(token);

        let path = files.file.filepath;
        let result: any = await cloudinaryService.UploadImage(path, 'avatars');

        if (result) {
          user.imageUrl = result.url;
          userService.updateUser(user.id, user)
        }
        res.status(200).json({ message: 'Succesfully set user avatar' });
      } catch (err: any) {
        next(new AppError(err.message));
      }
    });
  }

  async changePassword(req: Request, res: Response, next: any) {
    const token = req.headers.authorization!.split(' ')[1];
    const authService = new AuthService();
    try {
      await authService.setNewPassword(token, req.body.oldPass, req.body.newPass, req.body.newPassConfirm);
      res.status(200).json({ message: 'Your password successfully updated' });
    } catch (err) {
      next(err);
    }
  }

  async changeName(req: Request, res: Response, next: any) {
    const token = req.headers.authorization!.split(' ')[1];
    const userService = new UserService();
    try {
      await userService.setNewName(token, req.body.newName);
      res.status(200).json({ message: 'Your name successfully updated' });
    } catch (err) {
      next(err);
    }
  }

  async changeBirthday(req: Request, res: Response, next: any) {
    const token = req.headers.authorization!.split(' ')[1];
    const userService = new UserService();
    try {
      await userService.setNewBirthday(token, req.body.newBD);
      res.status(200).json({ message: 'Your date of birth successfully updated' });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();