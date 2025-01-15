import { Request, Response } from 'express';
import FavoriteModel from '../models/favorite';
import response from '../services/apiresponse';
import { errorHandler } from '../services/handleResponse';

const addtoFavorite = async (req: any, res: Response): Promise<void> => {
    try {
        const { car } = req.body;
        const { userId } = req.user
        if (!car) {
            response.useErrorResponse(res, 'Required fields are empty', true, 400);
            return;
        }
      

        const checkFavorite = await FavoriteModel.findOne({ car: car, user: userId });
        if (checkFavorite) {
            const error = {
                iserror: true,
                isExist: true
            }
            response.useErrorResponse(res, 'Car already in favorite', error, 400);
            return
        }

        const favorite = new FavoriteModel({
            user: userId,
            car: car,
        });

        await favorite.save();
        response.useSuccessResponse(res, 'Favorite created successfully', favorite, 201);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const getAllFavorites = async (req: any, res: Response): Promise<void> => {
    try {
        const favorites = await FavoriteModel.find({ user: req.user.userId }).sort({ createdAt: -1 }).populate('car');
        const count = await FavoriteModel.countDocuments({ user: req.user.userId })
        const data = {
            data: favorites,
            totalCount:count
        }
        response.useSuccessResponse(res, 'Favorites retrieved successfully', data, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const getFavoriteById = async (req: Request, res: Response): Promise<void> => {
    try {
        const favorite = await FavoriteModel.findById(req.params.id);
        if (!favorite) {
            response.useErrorResponse(res, 'Favorite not found', true, 400);
            return;
        }
        response.useSuccessResponse(res, 'Favorite retrieved successfully', favorite, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const updateFavoriteById = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedFavorite = await FavoriteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFavorite) {
            response.useErrorResponse(res, 'Favorite not found', true, 400);
            return;
        }
        response.useSuccessResponse(res, 'Favorite updated successfully', updatedFavorite, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const removeFavoriteById = async (req: any, res: Response): Promise<void> => {
    try {
        const { car } = req.body

        const removedFavorite = await FavoriteModel.findOneAndDelete({ user: req.user.userId, car: car });
        if (!removedFavorite) {
            response.useErrorResponse(res, 'Favorite not found', true, 400);
            return;
        }
        response.useSuccessResponse(res, 'Favorite deleted successfully', removedFavorite, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

export {
    addtoFavorite,
    getAllFavorites,
    getFavoriteById,
    updateFavoriteById,
    removeFavoriteById,
};
