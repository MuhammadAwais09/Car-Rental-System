import { Request, Response } from 'express';
import Brand from '../models/brand';
import response from '../services/apiresponse';
import { errorHandler } from '../services/handleResponse';
import UserModel from '../models/user';



const createBrand = async (req: any, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        const { userId, role } = req.user;
        const user = await UserModel.findOne({ _id: userId, isDeleted: false })
        if (!user || user?.role !== 'superAdmin' || role !== user?.role) {
            response.useErrorResponse(res, "Unauthorized: Permission Denied", true, 401);
        }
        if (!name) {
            response.useErrorResponse(res, 'Invalid Request: Brand name cannot be empty', true, 400);
            return;
        }

        const brand = new Brand({
            name: name.toLowerCase(),
        });

        await brand.save();
        response.useSuccessResponse(res, 'Brand Successfully Created', brand, 201);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


const getAllBrands = async (req: Request, res: Response): Promise<void> => {
    try {
        const brands = await Brand.find({ isDeleted: false }).sort({ createdAt: -1 });;
        response.useSuccessResponse(res, 'Successfully Retrieved Brands', brands, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


const getBrandById = async (req: Request, res: Response): Promise<void> => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) {
            response.useErrorResponse(res, 'Brand not found', true, 400);
            return;
        }
        response.useSuccessResponse(res, 'Brand retrieved successfully', brand, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const updateBrandById = async (req: any, res: Response): Promise<void> => {
    try {
        const { userId, role } = req.user;
        const user = await UserModel.findOne({ _id: userId, isDeleted: false })
        if (!user || user?.role !== 'superAdmin' || role !== user?.role) {
            response.useErrorResponse(res, "Unauthorized: Permission Denied", true, 401);
        }
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!brand) {
            response.useErrorResponse(res, 'Brand not found', true, 400);
            return;
        }
        response.useSuccessResponse(res, 'Brand updated successfully', brand, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const deleteBrandById = async (req: any, res: Response): Promise<void> => {
    try {

        const { userId, role } = req.user;
        const user = await UserModel.findOne({ _id: userId, isDeleted: false });

        if (!user || user?.role !== 'superAdmin' || role !== user?.role) {
            response.useErrorResponse(res, "Unauthorized: Permission Denied", true, 401);
        }

        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            response.useErrorResponse(res, 'Brand not found', true, 400);
            return;
        }

        brand.isDeleted = true;
        await brand.save();
        
        response.useSuccessResponse(res, 'Brand deleted successfully', {}, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

export { createBrand, getAllBrands, getBrandById, updateBrandById, deleteBrandById };
