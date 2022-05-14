import express from 'express';
import UserController from '../controllers/userController';
import { UserRole } from '../constants/userRole';
import { checkRole } from '../middleware/checkRole';
import { authenticateJWT } from '../middleware/jwt';
import { newBirthdayRules, newNameRules, newPasswordRules, updateUserRules, validate } from '../middleware/validationRules';

export const userRouter = express.Router();

userRouter.get('/all', [authenticateJWT, checkRole(UserRole.ADMIN)], UserController.getAll);
userRouter.post('/token', UserController.getByToken);
userRouter.post('/upload', authenticateJWT, UserController.uploadImage);
userRouter.get('/:id', authenticateJWT, UserController.getById);
userRouter.put('/changePassword', authenticateJWT, newPasswordRules(), validate, UserController.changePassword);
userRouter.put('/changeName', authenticateJWT, newNameRules(), validate, UserController.changeName);
userRouter.put('/changeBirthday',authenticateJWT, newBirthdayRules(), validate, UserController.changeBirthday);
userRouter.delete('/:id', [authenticateJWT, checkRole(UserRole.ADMIN)], UserController.deleteById);
userRouter.put('/update/:id', [authenticateJWT, checkRole(UserRole.ADMIN)], updateUserRules(), validate, UserController.updateUser);