import express from 'express';
import {
  createCar,
  getAllCars,
  getCarById,
  updateCarById,
  deleteCarById,
  bookCarById,
  carIsUnBookedById,
  searchCars,
  getSearchHistory,
  approvalofCar,
} from '../controllers/car.controller';
import verifyToken, { checkToken } from '../middleware/tokenChecker';

const router = express.Router();

/*================================= Create a new car =================================*/

router.post('/create', verifyToken, createCar);

/*================================= Get all cars =================================*/

router.get('/getAll', checkToken, getAllCars);

/*================================= Get  cars by search =================================*/

router.get('/searchcars', checkToken, searchCars);

/*================================= get the recommended cars =================================*/

router.get('/recommended', checkToken, getSearchHistory);

/*================================= Get a specific car by ID =================================*/

router.get('/getOne/:id', getCarById);

/*================================= Get a specific car by showroom id ID =================================*/

router.get('/getOne/:id', getCarById);

/*=================================  Update a car by ID =================================*/


router.put('/update/:id', verifyToken, updateCarById);

/*================================= Delete a car by ID =================================*/

router.delete('/delete/:id', verifyToken, deleteCarById);

/*================================= Book a car by ID =================================*/

router.post('/book/:id', bookCarById);

/*=================================  Book a car by ID =================================*/

router.post('/unbook/:id', carIsUnBookedById);

/*=================================  Approve a car by ID =================================*/

router.post('/approve', verifyToken, approvalofCar);

export default router;
