import express from 'express';
import {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrandById,
    deleteBrandById,
} from '../controllers/brand.controller';
import verifyToken from '../middleware/tokenChecker';

const router = express.Router();

router.post('/create', verifyToken, createBrand);

router.get('/getAll', getAllBrands);

router.get('/getOne/:id', getBrandById);

router.put('/update/:id', verifyToken, updateBrandById);

router.delete('/delete/:id', verifyToken, deleteBrandById);

export default router;
