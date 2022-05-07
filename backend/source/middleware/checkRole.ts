import { Request, Response } from 'express';
import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';
import { AuthService } from '../services/authService';
import { HttpError } from '../util/errors';

export function checkRole(role: string) {
    return async function (req: Request, res: Response, next: any) {
      const authService = new AuthService();
      try {
        const userRole = await authService.getUserRole(req.headers.authorization!.split(' ')[1]);
        if (userRole != role) next(new HttpError(httpErrorStatusCodes.FORBIDDEN, 'You have no rights for this action'));
        else next();
      } catch (err) {
        next(err);
      }
    };
  }