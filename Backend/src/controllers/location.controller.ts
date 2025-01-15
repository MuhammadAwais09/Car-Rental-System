import { Request, Response } from 'express';
import Location from '../models/location';
import response from '../services/apiresponse';
import { errorHandler } from '../services/handleResponse';
import UserModel from '../models/user';


const createLocation = async (req: any, res: Response): Promise<void> => {
    try {
        const { userId, role } = req.user;
        const { name } = req.body;
        const user = await UserModel.findOne({ _id: userId, isDeleted: false });

        if (!user || user?.role !== 'superAdmin' || role !== user?.role) {
            response.useErrorResponse(res, "Unauthorized: Permission Denied", true, 401);
        }

        if (!name) {
            response.useErrorResponse(res, 'Invalid Request: Location name cannot be empty', true, 400);
            return;
        }

        const location = new Location({
            name: name.toLowerCase(),
        });

        await location.save();
        response.useSuccessResponse(res, 'Location Successfully Created', location, 201);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


const getAllLocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const locations = await Location.find({ isDeleted: false }).sort({ createdAt: -1 });;
        response.useSuccessResponse(res, 'Successfully Retrieved Locations', locations, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


const getLocationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            response.useErrorResponse(res, 'Location not found', true, 400);
            return;
        }
        response.useSuccessResponse(res, 'Location retrieved successfully', location, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const updateLocationById = async (req: any, res: Response): Promise<void> => {
    try {
        const { userId, role } = req.user;
        const user = await UserModel.findOne({ _id: userId, isDeleted: false });

        if (!user || user?.role !== 'superAdmin' || role !== user?.role) {
            response.useErrorResponse(res, "Unauthorized: Permission Denied", true, 401);
        }

        const location = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!location) {
            response.useErrorResponse(res, 'Location not found', true, 400);
            return;
        }
        response.useSuccessResponse(res, 'Location updated successfully', location, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const deleteLocationById = async (req: any, res: Response): Promise<void> => {
    try {
        const { userId, role } = req.user;
        const user = await UserModel.findOne({ _id: userId, isDeleted: false });
    
        if (!user || user?.role !== 'superAdmin' || role !== user?.role) {
            response.useErrorResponse(res, "Unauthorized: Permission Denied", true, 401);
        }
        const location = await Location.findById(req.params.id);
        location.isDeleted = true,
            await location.save();
        if (!location) {
            response.useErrorResponse(res, 'Location not found', true, 400);
            return;
        }
        response.useSuccessResponse(res, 'Location deleted successfully', {}, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

export { createLocation, getAllLocations, getLocationById, updateLocationById, deleteLocationById };
