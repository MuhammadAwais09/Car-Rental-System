// routes/favoriteRoutes.ts
import express from 'express';
import {
    addtoFavorite,
    getAllFavorites,
    getFavoriteById,
    // updateFavoriteById,
    removeFavoriteById,
} from '../controllers/favorite.controller';
import verifyToken from '../middleware/tokenChecker';

const router = express.Router();

// Create a favorite
router.post('/addFavorite', verifyToken, addtoFavorite);

// Get all favorites
router.get('/', verifyToken, getAllFavorites);

// Get a favorite by ID
router.get('/:id', getFavoriteById);

// // Update a favorite by ID
// router.put('/:id', updateFavoriteById);

// Delete a favorite by ID
router.post('/removeFavorite', verifyToken, removeFavoriteById);

export default router;
