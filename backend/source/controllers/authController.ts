import { AuthService } from '../services/authService';
import { Request, Response } from 'express';

class AuthController {
  async login(req: Request, res: Response, next: any) {
    const authService = new AuthService();
    try {
      const result = await authService.loginUser(req.body.email, req.body.password);

      res.cookie('token', result.token  , {
        httpOnly: true,
        sameSite: 'strict'
      });
      
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: any) {
    const authService = new AuthService();
    try {
      await authService.registerUser(req.body.name, req.body.email, req.body.password);

      const result = await authService.loginUser(req.body.email, req.body.password);
      
      res.cookie('token', result.token  , {
        httpOnly: true,
        sameSite: 'strict'
      });
      
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}
export default new AuthController();