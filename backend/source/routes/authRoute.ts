
import express from 'express';
import AuthController from '../controllers/authController';

export const authRouter = express.Router();

authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);