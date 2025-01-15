import { Request, Response } from 'express';
import Car from '../models/car';
import response from '../services/apiresponse';
import { errorHandler } from '../services/handleResponse';
import Favorite from '../models/favorite';
import SearchHistory from '../models/search';
import UserModel from '../models/user';
import { sendApprovalNotification } from './notifications';
import ShowRoom from '../models/showRoom';
import mongoose from 'mongoose';

// import Trash from '../models/trash';
// import Brand from '../models/brand';


/*================================= add new create =================================*/

const createCar = async (req: any, res: Response): Promise<void> => {
    try {
        const { title, feature, model, discount = 0, fuelType, brand, location, mileage, realPrice, driverType, description, pictures, showroomId } = req.body;
        if (!title || !feature || !model || !fuelType || !brand || !location || !mileage || !realPrice || !driverType || !description || !showroomId || !pictures.length) {
            response.useErrorResponse(res, 'Required fields are empty', true, 400);
            return;
        }
        const approvedShowroom = await ShowRoom.findOne({ _id: showroomId, status: 'approved' })
        if (!approvedShowroom) {
            return response.useErrorResponse(res, 'Your Showroom is not approved Please wait for the Approval to add the car',true,400)
        }
        const car = new Car({
            title,
            feature,
            model,
            fuelType,
            brand,
            location,
            mileage,
            realPrice,
            discount: discount,
            discountedPrice: realPrice - ((discount * realPrice) / 100),
            driverType,
            description,
            pictures,
            showroomOwnerId: req.user.userId,
            showroomId,

        });

        await car.save();
        // await data.pictures.map(async (picture) => {
        //     await Trash.findOneAndDelete({ file: picture });
        // })
        const admin = await UserModel.findOne({ role: 'superAdmin' }).sort({ createdAt: -1 })
        sendApprovalNotification(car._id, `New Car Reservation: ${title} - ${model}`, admin._id, 'car', admin.deviceToken, "Approval Required",);

        response.useSuccessResponse(res, 'Car created successfully, Please wait for Approval', car, 201);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

/*================================= get the cars logics for filtering =================================*/


// const getCarsWithPagination = async (page: number, pageSize: number, userId: string) => {
//     const skip = (page - 1) * pageSize;

//     const cars = await Car.find({ isBooked: false })
//         .skip(skip)
//         .limit(pageSize)
//         .populate('brand')

//     const carsWithFavorites = await Promise.all(cars.map(async (car) => {
//         const favorites = await Favorite.exists({ userId, carId: car._id });
//         // console.log(favorites);

//         if (favorites) {
//             return { ...car.toObject(), isFavorite: true };

//         } else
//             return { ...car.toObject(), isFavorite: false };
//     }));

//     return carsWithFavorites;
// };

/*================================= get the cars logics for filtering =================================*/

const getCarsWithPagination = async (page: number, pageSize: number, userId: string, filters: any) => {
    const skip = (parseInt(page.toString()) - 1) * parseInt(pageSize.toString())
    const carFilters: any = { isBooked: false, isDeleted: false, status: "approved" };
    if (filters.showroomId) {
        carFilters.showroomId = filters.showroomId;
    }
    if (filters.driverType) {
        carFilters.driverType = filters.driverType;
    }
    if (filters.driverType) {
        carFilters.driverType = filters.driverType;
    }
    if (filters.status) {

        carFilters.status = filters.status;
    }
    if (filters.brand) {
        carFilters.brand = filters.brand;
    }

    if (filters.minPrice || filters.maxPrice) {
        carFilters.realPrice = {};
        if (filters.minPrice) {
            carFilters.realPrice.$gte = parseFloat(filters.minPrice);
        }
        if (filters.maxPrice) {
            carFilters.realPrice.$lte = parseFloat(filters.maxPrice);
        }
    }

    if (filters.fuelType) {
        carFilters.fuelType = filters.fuelType;
    }

    if (true) {

    }
    const cars = await Car.find(carFilters)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(pageSize.toString()))
        .populate('brand');

    const count = await Car.countDocuments(carFilters);

    const carsWithFavorites = await Promise.all(cars.map(async (car) => {
        const favorites = await Favorite.find({ user: userId, car: car._id }).sort({ createdAt: -1 });

        if (favorites.length) {
            return { ...car.toObject(), isFavorite: true };
        } else {
            return { ...car.toObject(), isFavorite: false };
        }
    }));
    const data = {
        data: carsWithFavorites,
        totalCount: count
    }
    return data;
};

/*================================= get the cars with filter and without filters =================================*/

const getAllCars = async (req: any, res: Response): Promise<void> => {
    try {
        const { page = 1, pageSize = 10, brand, driverType, minPrice, maxPrice, fuelType, showroomId, showroomOwnerId, status } = req.query;

        const userId = req.user?.userId;

        const filters: any = {};

        if (showroomId) {
            filters.showroomId = showroomId;
            const showroom = await ShowRoom.findById(showroomId);
            if (showroom.owner == userId && status) {

                filters.status = status;
            }
        }
        if (showroomOwnerId) {
            filters.showroomOwnerId = showroomOwnerId;
            if (showroomOwnerId === userId) {
                filters.status = status;

            }
        }
        if (brand) {
            filters.brand = brand;
        }
        if (driverType) {
            filters.driverType = driverType;
        }
        if (minPrice) {
            filters.minPrice = minPrice;
        }
        if (maxPrice) {
            filters.maxPrice = maxPrice;
        }
        if (fuelType) {
            filters.fuelType = fuelType;
        }


        if (req.user?.role === "superAdmin" || req.user?.role === "admin") {
            filters.status = status;
        }
        const data = await getCarsWithPagination(Number(page), Number(pageSize), userId, filters);
        return response.useSuccessResponse(res, 'Cars retrieved successfully', data, 200);

    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

/*================================= get the cars by search =================================*/

// export const searchCars = async (req: any, res: any) => {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;
//     const minPrice = parseInt(req.query.minPrice) || 0;
//     const maxPrice = parseInt(req.query.maxPrice) || Infinity;
//     const brand = req.query.brand;
//     const query = req.query.search;

//     try {
//         const userId = req.user?.userId;

//         const parsedPage = parseInt(page.toString());
//         const parsedPageSize = parseInt(pageSize.toString());

//         const skip = (parsedPage - 1) * parsedPageSize;

//         if (userId && query) {
//             await SearchHistory.create({ user: userId, query });
//         }

//         let searchQuery:any = {
//             $and: [
//                 { showroomOwnerId: { $ne: userId } },
//                 {
//                     $or: [
//                         { title: { $regex: new RegExp(query, 'i') } },
//                         { feature: { $regex: new RegExp(query, 'i') } },
//                         { model: { $regex: new RegExp(query, 'i') } },
//                         { fuelType: { $regex: new RegExp(query, 'i') } },
//                         { location: { $regex: new RegExp(query, 'i') } },
//                         { description: { $regex: new RegExp(query, 'i') } },
//                     ],

//                 },
//             ],

//         };
//         if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice >= 0 && maxPrice >= minPrice) {
//             searchQuery['realPrice'] = { $gte: minPrice, $lte: maxPrice };
//         }

//         if (brand) {
//             searchQuery["brand"] = brand;

//         }

//         const totalCount = await Car.countDocuments( searchQuery);
//         const searchResults = await Car.find(searchQuery)
//             .sort({ createdAt: -1 })
//             .populate('brand')
//             .skip(skip)
//             .limit(parsedPageSize);

//         const carsWithFavorites = await Promise.all(searchResults.map(async (car) => {
//             const favorites = await Favorite.find({ user: userId, car: car._id }).sort({ createdAt: -1 });
//             return { ...car.toObject(), isFavorite: favorites.length > 0 };
//         }));

//         return response.useSuccessResponse(res, 'Cars retrieved successfully', { totalCount, carsWithFavorites }, 200);

//     } catch (error) {
//         console.error(error);
//         errorHandler(res, error);
//     }
// };


export const searchCars = async (req: any, res: Response) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || Infinity;
    const brand = req.query.brand;
    const query = req.query.search;

    try {
        const userId = req.user?.userId;

        const parsedPage = parseInt(page.toString());
        const parsedPageSize = parseInt(pageSize.toString());

        const skip = (parsedPage - 1) * parsedPageSize;

        if (userId && query) {
            await SearchHistory.create({ user: userId, query });
        }

        let searchQuery: any = {
            $and: [
                { status: { $eq: "approved" } },
                { showroomOwnerId: { $ne: userId } },
                {
                    $or: [
                        { title: { $regex: new RegExp(query, 'i') } },
                        { feature: { $regex: new RegExp(query, 'i') } },
                        { model: { $regex: new RegExp(query, 'i') } },
                        { fuelType: { $regex: new RegExp(query, 'i') } },
                        { location: { $regex: new RegExp(query, 'i') } },
                        { description: { $regex: new RegExp(query, 'i') } },
                    ],
                },
            ],
        };

        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice >= 0 && maxPrice >= minPrice) {
            searchQuery['realPrice'] = { $gte: minPrice, $lte: maxPrice };
        }

        if (brand) {
            searchQuery["brand"] = brand;
        }

        const totalCount = await Car.countDocuments(searchQuery);
        const searchResults = await Car.find(searchQuery)
            .sort({ createdAt: -1 })
            .populate('brand')
            .skip(skip)
            .limit(parsedPageSize);

        const carsWithFavorites = await Promise.all(searchResults.map(async (car) => {
            const favorites = await Favorite.find({ user: userId, car: car._id }).sort({ createdAt: -1 });
            return { ...car.toObject(), isFavorite: favorites.length > 0 };
        }));

        return response.useSuccessResponse(res, 'Cars retrieved successfully', { totalCount, carsWithFavorites }, 200);

    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};



/*================================= recommendation on the base of search =================================*/

// export const getSearchHistory = async (req: any, res: any) => {
//     const userId = req.user?.userId;
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;

//     try {
//         const searchHistory = await SearchHistory.find({ user: userId }).sort({ createdAt: -1 });

//         const uniqueQueries = [...new Set(searchHistory.map(item => item.query))];
//         if (!searchHistory.length) {
//             const cars = await Car.find()
//                 .sort({ createdAt: -1 })
//                 .skip(0)
//                 .limit(3)
//                 .populate('brand');
//             const carsWithFavorites = await Promise.all(cars.map(async (car) => {
//                 const favorites = await Favorite.find({ user: userId, car: car._id }).sort({ createdAt: -1 });

//                 if (favorites.length) {
//                     return { ...car.toObject(), isFavorite: true };
//                 } else {
//                     return { ...car.toObject(), isFavorite: false };
//                 }
//             }));
//             const responsePayload = {
//                 cars: carsWithFavorites,
//                 totalCount: 3,
//             };

//             return response.useSuccessResponse(res, 'Recommended cars based on search history', responsePayload, 200);


//         }
//         const totalCarsCount = await Car.countDocuments({
//             $or: uniqueQueries.map(query => ({
//                 $or: [
//                     { title: { $regex: new RegExp(query, 'i') } },
//                     { feature: { $regex: new RegExp(query, 'i') } },
//                     { model: { $regex: new RegExp(query, 'i') } },
//                     { fuelType: { $regex: new RegExp(query, 'i') } },
//                     { location: { $regex: new RegExp(query, 'i') } },
//                     { description: { $regex: new RegExp(query, 'i') } },
//                 ],
//             })),
//         });

//         const recommendedCars = await Car.find({
//             $or: uniqueQueries.map(query => ({
//                 $or: [
//                     { title: { $regex: new RegExp(query, 'i') } },
//                     { feature: { $regex: new RegExp(query, 'i') } },
//                     { model: { $regex: new RegExp(query, 'i') } },
//                     { fuelType: { $regex: new RegExp(query, 'i') } },
//                     { location: { $regex: new RegExp(query, 'i') } },
//                     { description: { $regex: new RegExp(query, 'i') } },
//                 ],
//             })),
//         })
//             .sort({ createdAt: -1 })
//             .populate('brand')
//             .skip((page - 1) * pageSize)
//             .limit(pageSize);

//         const carsWithFavorites = await Promise.all(recommendedCars.map(async (car) => {
//             const favorites = await Favorite.find({ user: userId, car: car._id }).sort({ createdAt: -1 });

//             if (favorites.length) {
//                 return { ...car.toObject(), isFavorite: true };
//             } else {
//                 return { ...car.toObject(), isFavorite: false };
//             }
//         }));

//         const responsePayload = {
//             cars: carsWithFavorites,
//             totalCount: totalCarsCount,
//             currentPage: page,
//             pageSize: pageSize,
//         };

//         return response.useSuccessResponse(res, 'Recommended cars based on search history', responsePayload, 200);

//     } catch (error) {
//         console.error(error);
//         errorHandler(res, error);
//     }
// };

export const getSearchHistory = async (req: any, res: any) => {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const minPrice = parseInt(req.query.minPrice) || 0;
    const maxPrice = parseInt(req.query.maxPrice) || Infinity;
    const brand = req.query.brand;

    try {
        const searchHistory = await SearchHistory.find({ user: userId }).sort({ createdAt: -1 });

        const uniqueQueries = [...new Set(searchHistory.map(item => item.query))];
        if (!searchHistory.length) {
            const cars = await Car.find({ status: 'approved' })
                .sort({ createdAt: -1 })
                .skip(0)
                .limit(3)
                .populate('brand');
            const carsWithFavorites = await Promise.all(cars.map(async (car) => {
                const favorites = await Favorite.find({ user: userId, car: car._id }).sort({ createdAt: -1 });

                if (favorites.length) {
                    return { ...car.toObject(), isFavorite: true };
                } else {
                    return { ...car.toObject(), isFavorite: false };
                }
            }));
            const responsePayload = {
                cars: carsWithFavorites,
                totalCount: 3,
            };

            return response.useSuccessResponse(res, 'Recommended cars based on search history', responsePayload, 200);
        }

        const queryConditions = uniqueQueries.map(query => ({
            $and: [
                { status: { $eq: "approved" } },
                { showroomOwnerId: { $ne:new mongoose.Types.ObjectId(userId) } },
                {
                    $or: [
                        { title: { $regex: new RegExp(query, 'i') } },
                        { feature: { $regex: new RegExp(query, 'i') } },
                        { model: { $regex: new RegExp(query, 'i') } },
                        { fuelType: { $regex: new RegExp(query, 'i') } },
                        { location: { $regex: new RegExp(query, 'i') } },
                        { description: { $regex: new RegExp(query, 'i') } },
                    ],
                },
            ],
        }));

        if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice >= 0 && maxPrice >= minPrice) {
            queryConditions.forEach(condition => {
                condition['realPrice'] = { $gte: minPrice, $lte: maxPrice };
            });
        }

        if (brand) {
            queryConditions.forEach(condition => {
                condition["brand"] = brand;
            });
        }

        const totalCarsCount = await Car.countDocuments({
            $or: queryConditions,
        });

        const recommendedCars = await Car.find({
            $or: queryConditions,
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate('brand');

        const carsWithFavorites = await Promise.all(recommendedCars.map(async (car) => {
            const favorites = await Favorite.find({ user: userId, car: car._id }).sort({ createdAt: -1 });

            if (favorites.length) {
                return { ...car.toObject(), isFavorite: true };
            } else {
                return { ...car.toObject(), isFavorite: false };
            }
        }));

        const responsePayload = {
            cars: carsWithFavorites,
            totalCount: totalCarsCount,
            currentPage: page,
            pageSize: pageSize,
        };

        return response.useSuccessResponse(res, 'Recommended cars based on search history', responsePayload, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


/*================================= get car by the id  =================================*/


const getCarById = async (req: any, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const car = await Car.findById(req.params.id);
        if (!car) {
            return response.useErrorResponse(res, 'Car not found', true, 400);
        }
        const favorite = await Favorite.findOne({ user: userId, car: req.params._id });
        let isFavorite = false;
        if (favorite) {
            isFavorite = true;
        }
        const data = {
            car,
            isFavorite
        }
        response.useSuccessResponse(res, 'Car retrieved successfully', car, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


/*================================= update the car by id =================================*/


const updateCarById = async (req: Request, res: Response): Promise<void> => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!car) {
            return response.useErrorResponse(res, 'Car not found', true, 400);
        }

        // If status of car is *rejected make it pending and send notification to admin for approval 
        if (car.status === 'rejected') {
            car.status = 'pending';
            await car.save();
            const admin = await UserModel.findOne({ role: 'superAdmin' }).sort({ createdAt: -1 })
            sendApprovalNotification(car._id, `Updated Car Reservation: ${car.title} - ${car.model}`, admin._id, 'car', admin.deviceToken, "Approval Required",);
        }
        response.useSuccessResponse(res, 'Car updated successfully', car, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


/*================================= delete the car by id  =================================*/


const deleteCarById = async (req: Request, res: Response): Promise<void> => {
    try {
        // const data = await Car.findById(req.params.id);
        const car = await Car.findById(req.params.id);
        car.isDeleted = true;
        await car.save();
        // data.pictures.map(async (picture) => {
        //     const Trash2 = new Trash({
        //         fileName: picture
        //     });
        //     await Trash2.save();
        // })
        if (!car) {
            return response.useErrorResponse(res, 'Car not found', true, 400);
        }
        response.useSuccessResponse(res, 'Car deleted successfully', {}, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


/*================================= book car by its id  =================================*/

const bookCarById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedCar = await Car.findByIdAndUpdate(id, { isBooked: true }, { new: true });
        if (!updatedCar) {
            return response.useErrorResponse(res, 'Car not found', true, 400);
        }
        response.useSuccessResponse(res, 'Car booked successfully', updatedCar, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


/*================================= unbook the car by its id =================================*/


const carIsUnBookedById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedCar = await Car.findByIdAndUpdate(id, { isBooked: false }, { new: true });
        if (!updatedCar) {
            return response.useErrorResponse(res, 'Car not found', true, 400);
        }
        return response.useSuccessResponse(res, 'Car booked successfully', updatedCar, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


/*================================= Approve the car from admin =================================*/

const approvalofCar = async (req: any, res: any): Promise<void> => {
    try {
        const { userId } = req.user;
        const { status, carId } = req.body;
        const car = await Car.findOne({ _id: carId, isDeleted: false });
        const user = await UserModel.findOne({ _id: userId, isDeleted: false })
        const reciever = await UserModel.findOne({ _id: car.showroomOwnerId, isDeleted: false })
        if (!user || user?.role !== 'superAdmin') {
            response.useErrorResponse(res, "Unauthorized: Permission Denied", true, 401);
        }
        if (!car) {
            return response.useErrorResponse(res, 'Car not found', true, 400);
        }

        sendApprovalNotification(car._id, `Approval Required: ${status === 'approved' ? 'Your Car Reservation has been approved' : 'Your Car Reservation has been declined'}`, reciever._id, "car", reciever.deviceToken, "Approval Status");
        car.status = status;
        await car.save();
        response.useSuccessResponse(res, `Car ${status} successfully`, car, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};




export { createCar, getAllCars, getCarById, updateCarById, deleteCarById, bookCarById, carIsUnBookedById, approvalofCar };
