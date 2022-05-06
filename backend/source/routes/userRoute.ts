import express from 'express';
import UserController from '../controllers/userController';

export const userRouter = express.Router();

userRouter.get('/:id', UserController.getById);
userRouter.put('/changePassword', UserController.changePassword);
userRouter.put('/changeName', UserController.changeName);
userRouter.put('/changeBirthday',UserController.changeBirthday);
userRouter.delete('/:id', UserController.deleteById);