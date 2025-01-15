import express from 'express';
import {
    createLocation,
    getAllLocations,
    getLocationById,
    updateLocationById,
    deleteLocationById,
} from '../controllers/location.controller';
import verifyToken from '../middleware/tokenChecker';

const router = express.Router();

router.post('/create', verifyToken, createLocation);

router.get('/getAll', getAllLocations);

router.get('/getOne/:id', getLocationById);

router.put('/update/:id', verifyToken, updateLocationById);

router.delete('/delete/:id',verifyToken, deleteLocationById);

export default router;
