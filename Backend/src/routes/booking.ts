// routes/favoriteRoutes.ts
import express from 'express';
import {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingById,
    UpdateStatusOfBooking,
} from '../controllers/booking.controller';
import verifyToken from '../middleware/tokenChecker';

const router = express.Router();

// Create a favorite
router.post('/addtobooking', verifyToken, createBooking);

// Get all favorites
router.get('/getAll', verifyToken, getAllBookings);

// Get a favorite by ID
router.get('/getById/:id', verifyToken, getBookingById);

// Update a favorite by ID
router.put('/updatebooking/:id', verifyToken, updateBookingById);

// Delete a favorite by ID
router.post('/updateStatus', verifyToken, UpdateStatusOfBooking);

export default router;
