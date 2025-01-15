import express from 'express';
import {
    createApprovalNotification,
    getApprovalNotifications,
    readAllNotifications,
    readSingleNotifications
} from '../controllers/notifications';
import verifyToken from '../middleware/tokenChecker';

const router = express.Router();

// Create a new showroom approval notification
router.post('/approval/notification', createApprovalNotification);

// Get showroom approval notifications
router.get('/approval/notifications',
    verifyToken,
    getApprovalNotifications);
router.post('/approval/readAll',
    verifyToken,
    readAllNotifications,
);
router.post('/approval/singleRead',
    verifyToken,
    readSingleNotifications);

export default router;
