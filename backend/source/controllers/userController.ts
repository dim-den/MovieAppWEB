import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';
import { AppError } from '../util/errors';

class UserController {
  async delete(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const userService = new UserService();
    try {
      await userService.deleteUser(id);
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response, next: any) {
    const id: number = parseInt(req.params.id);
    const userService = new UserService();
    try {
      const info = await userService.getUser(id);
      res.status(200).json(info);
    } catch (err: any) {
      next(new AppError(err.message));
    }
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