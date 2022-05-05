import { AuthService } from '../services/authService';
import { Request, Response } from 'express';

class AuthController {
  async login(req: Request, res: Response, next: any) {
    const authService = new AuthService();
    try {
      const token = await authService.loginUser(req.body.email, req.body.password);
      res.status(200).json({ token: token });
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: any) {
    const authService = new AuthService();
    try {
      await authService.registerUser(req.body.name, req.body.email, req.body.password);
      res.status(201).json({ message: 'Succesful registration' });
    } catch (err) {
      next(err);
    }
  }
}
export default new AuthController();