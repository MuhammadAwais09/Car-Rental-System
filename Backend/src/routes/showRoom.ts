import express from 'express';
import {
    createShowRoom,
    getAllShowRooms,
    getShowRoomById,
    updateShowRoomById,
    deleteShowRoomById,
    getShowRoomByOwnerId,
    approvalofShowRoom,
} from '../controllers/showroom.controller';
import verifyToken, { checkToken } from '../middleware/tokenChecker';

const router = express.Router();

router.post('/', verifyToken, createShowRoom);

router.get('/getAll', checkToken, getAllShowRooms);

router.get('/get/userShowRoom', verifyToken, getShowRoomByOwnerId);

router.get('/:id', verifyToken, getShowRoomById);

router.put('/:id', updateShowRoomById);

router.delete('/:id', deleteShowRoomById);

router.post('/approve', verifyToken, approvalofShowRoom);

export default router;
