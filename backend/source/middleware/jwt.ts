import { httpErrorStatusCodes } from '../constants/httpErrorStatusCode';
import { HttpError } from '../util/errors';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/authService';
import { Request, Response } from 'express';
import { jwtConfig } from '../config/jwtConfig';

export function authenticateJWT(req: Request, res: Response, next: any) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, jwtConfig.secret!, async (err: any, user: any) => {
      if (err) next(new HttpError(httpErrorStatusCodes.FORBIDDEN, 'access denied'));
      try {
        // const authService = new AuthService();
        // const fresh = await authService.setFreshToken(token);
        // req.headers.authorization = `Bearer ${fresh}`;
        // res.setHeader('token', fresh);
        next();
      } catch (err) {
        next(err);
      }
    });
  } else {
    next(new HttpError(httpErrorStatusCodes.UNAUTHORIZED, 'unauthorized'));
  }
}