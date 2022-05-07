
import express from 'express';
import AuthController from '../controllers/authController';
import { registrationRules, validate } from '../middleware/validationRules';

export const authRouter = express.Router();

authRouter.post('/register', registrationRules(), validate, AuthController.register);
authRouter.post('/login', AuthController.login);