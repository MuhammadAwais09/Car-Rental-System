
import express from 'express';
import * as authController from '../controllers/auth.controller';
import verifyToken from '../middleware/tokenChecker';
import { normalizeEmail, validateUserRegistration } from '../middleware/validator';

const router = express.Router();

router.post('/register', normalizeEmail, validateUserRegistration, authController.register);
router.post('/verify', authController.verifyEmail);
router.post('/verifyForReset', authController.verifyForReset);
router.post('/login', authController.login);
router.post('/forgot', authController.forgotPassword);
router.post('/resendOTP', authController.resendOtp);
router.post('/reset', authController.resetPassword);
router.get('/viewProfile', verifyToken, authController.viewProfile);
router.post('/updateProfile', verifyToken, authController.profileManager);
router.post('/allowNotification', verifyToken, authController.allowNotification);

export default router;
