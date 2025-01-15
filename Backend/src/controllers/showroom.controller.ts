import ShowRoom from '../models/showRoom';
import response from '../services/apiresponse';
import { errorHandler } from '../services/handleResponse';
import UserModel from '../models/user';
// import Trash from '../models/trash';
import mongoose from 'mongoose';
import { sendApprovalNotification } from './notifications';

const createShowRoom = async (req: any, res: any): Promise<void> => {
    try {
        const { showRoomName, location, showRoomPicture, phone } = req.body;
        const owner = req.user.userId;
        const alReadyhadShowroom = await ShowRoom.findOne({ owner: owner ,isDeleted:false});

        if ((!showRoomName || !showRoomPicture || !owner || !phone)&&!alReadyhadShowroom) {
            return response.useErrorResponse(res, 'Required fields are empty.', true, 400);
        }
        const user = await UserModel.findOne({ _id: owner, isDeleted: false });
        let showroom: any;
        let message: string;
        // await Trash.findOneAndDelete({ file: showRoomPicture });
        if (!alReadyhadShowroom) {
             showroom = new ShowRoom({
                showRoomName,
                location,
                owner,
                showRoomPicture,
                phone,
             });
            
            message = 'Showroom created successfully Wait for Approval';

            const admin = await UserModel.findOne({ role: 'superAdmin' }).sort({ createdAt: -1 });

            sendApprovalNotification(showroom._id, `New Showroom Creation: ${showRoomName}`, admin._id, "showroom", admin.deviceToken, "Approval Required",);

        } else {

            showroom = await ShowRoom.findByIdAndUpdate(alReadyhadShowroom._id, req.body, { new: true });
            const admin = await UserModel.findOne({ role: 'superAdmin' }).sort({ createdAt: -1 });

            message = 'Showroom Updated successfully Wait for Approval';
            showroom.status = 'pending';
            sendApprovalNotification(showroom._id, `Updated Showroom For Approval: ${showRoomName}`, admin._id, "showroom", admin.deviceToken, "Approval Required",);

        }
        await showroom.save();
        user.role = 'showroomOwner';
        await user.save();
        response.useSuccessResponse(res, message, showroom, 201);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

// const getAllShowRooms = async (req: any, res: any): Promise<void> => {
//     try {
//         const { page = 1, pageSize = 10 } = req.query;
//         const skip = (page - 1) * pageSize;

//         let showrooms: any;
//         if (req.token) {
//             const { userId } = req.user
//             showrooms = await ShowRoom.find({ owner: { $ne: userId }, isDeleted: false })
//                 .skip(skip)
//                 .limit(pageSize)
//         } else {

//             showrooms = await ShowRoom.find()
//                 .skip(skip)
//                 .limit(pageSize)
//         }
//         response.useSuccessResponse(res, 'Showrooms retrieved successfully', showrooms, 200);
//     } catch (error) {
//         console.error(error);
//         errorHandler(res, error);
//     }
// };


// const getAllShowRooms = async (req: any, res: any): Promise<void> => {
//     try {
//         const { page = 1, pageSize = 10 } = req.query;
//         const skip = (parseInt(page.toString()) - 1) * parseInt(pageSize.toString())

//         let matchQuery: any = { isDeleted: false,status: 'approved' };

//         if (req.user) {
//             const { userId } = req.user;
//             matchQuery.owner = { $ne:new mongoose.Types.ObjectId(userId) };
//         }

//         const showrooms = await ShowRoom.aggregate([
//             {
//                 $match: matchQuery,
//             },
//             {
//                 $skip: skip,
//             },
//             {
//                 $limit: parseInt(pageSize.toString()),
//             },
//             {
//                 $lookup: {
//                     from: 'cars', 
//                     localField: '_id',
//                     foreignField: 'showroomId',
//                     as: 'cars',
//                 },
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     showRoomName: 1,
//                     location: 1,
//                     owner: 1,
//                     phone: 1,
//                     status: 1,
//                     showRoomPicture: 1,
//                     createdAt:1,
//                     carCount: { $size: '$cars' },
//                 },
//             },
//         ]);
//         const count = await ShowRoom.countDocuments(matchQuery);
//         const data = {
//             data: showrooms,
//             totalCount: count
//         }
//         response.useSuccessResponse(res, 'Showrooms retrieved successfully', data, 200);
//     } catch (error) {
//         console.error(error);
//         errorHandler(res, error);
//     }
// };

// const getAllShowRooms = async (req: any, res: any): Promise<void> => {
//     try {
//         const { page = 1, pageSize = 10, status } = req.query;
//         const skip = (parseInt(page.toString()) - 1) * parseInt(pageSize.toString())
//         let matchQuery: any = { isDeleted: false };

//         if (req.user) {
//             const { role, userId } = req.user;
//             if (role === 'superAdmin') {
//                 if (status === 'all') {
                    
//                 } else if(status){
//                     matchQuery.status = status;
//                 }
//             } else {
//                 matchQuery.status = 'approved';
//                 matchQuery.owner = { $ne: new mongoose.Types.ObjectId(userId) };
//             }
//         } else {
//             matchQuery.status = 'approved';
//         }

//         const showrooms = await ShowRoom.aggregate([
//             {
//                 $match: matchQuery,
//             },
//             {
//                 $skip: skip,
//             },
//             {
//                 $limit: parseInt(pageSize.toString()),
//             },
//             {
//                 $lookup: {
//                     from: 'cars',
//                     localField: '_id',
//                     foreignField: 'showroomId',
//                     as: 'cars',
//                 },
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     showRoomName: 1,
//                     location: 1,
//                     owner: 1,
//                     phone: 1,
//                     status: 1,
//                     showRoomPicture: 1,
//                     createdAt: 1,
//                     carCount: { $size: '$cars' },
//                 },
//             },
//         ]);

//         const count = await ShowRoom.countDocuments(matchQuery);
//         const data = {
//             data: showrooms,
//             totalCount: count
//         };

//         response.useSuccessResponse(res, 'Showrooms retrieved successfully', data, 200);
//     } catch (error) {
//         console.error(error);
//         errorHandler(res, error);
//     }
// };

const getAllShowRooms = async (req: any, res: any): Promise<void> => {
    try {
        const { page = 1, pageSize = 10, status } = req.query;
        const skip = (parseInt(page.toString()) - 1) * parseInt(pageSize.toString());
        let matchQuery: any = { isDeleted: false };

        if (req.user) {
            const { role, userId } = req.user;
            if (role === 'superAdmin') {
                if (status === 'all') {

                } else if (status) {
                    matchQuery.status = status;
                }
            } else {
                matchQuery.status = 'approved';
                matchQuery.owner = { $ne: new mongoose.Types.ObjectId(userId) };
            }
        } else {
            matchQuery.status = 'approved';
        }

        const showrooms = await ShowRoom.aggregate([
            {
                $match: matchQuery,
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: skip,
            },
            {
                $limit: parseInt(pageSize.toString()),
            },
            {
                $lookup: {
                    from: 'cars',
                    let: { showroomId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $and: [{ $eq: ['$showroomId', '$$showroomId'] }, { $eq: ['$status', 'approved'] }] }
                            }
                        }
                    ],
                    as: 'approvedCars'
                }
            },
            {
                $project: {
                    _id: 1,
                    showRoomName: 1,
                    location: 1,
                    owner: 1,
                    phone: 1,
                    status: 1,
                    showRoomPicture: 1,
                    createdAt: 1,
                    carCount: { $size: '$approvedCars' }
                }
            }
        ]);

        const count = await ShowRoom.countDocuments(matchQuery);
        const data = {
            data: showrooms,
            totalCount: count
        };

        response.useSuccessResponse(res, 'Showrooms retrieved successfully', data, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


const getShowRoomById = async (req: any, res: any): Promise<void> => {
    try {
        const showroom = await ShowRoom.findOne({ _id: req.params.id, isDeleted: false });
        if (!showroom) {
            return response.useErrorResponse(res, 'Showroom not found.', true, 400);
        }
        response.useSuccessResponse(res, 'Showroom retrieved successfully', showroom, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const getShowRoomByOwnerId = async (req: any, res: any): Promise<void> => {
    try {
        const showroom = await ShowRoom.findOne({ owner: req.user.userId, isDeleted: false });
        if (!showroom) {
            return response.useErrorResponse(res, 'Showroom not found', true, 400);
        }
        response.useSuccessResponse(res, 'Showroom retrieved successfully', showroom, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const updateShowRoomById = async (req: any, res: any): Promise<void> => {
    try {
        const showroom = await ShowRoom.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!showroom) {
            return response.useErrorResponse(res, 'Showroom not found.', true, 400);
        }
        response.useSuccessResponse(res, 'Showroom updated successfully', showroom, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const deleteShowRoomById = async (req: any, res: any): Promise<void> => {
    try {
        const showroom = await ShowRoom.findOne({_id:req.params.id,isDeleted:false, status: 'approved' });
        if (!showroom) {
            return response.useErrorResponse(res, 'Showroom not found Or You request of Approval is pending please check', true, 400);
        }
        const showroomOwner = await UserModel.findOne({ _id: showroom.owner, isDeleted: false, })
        showroomOwner.role = 'user';
        showroom.isDeleted = true;
        await showroomOwner.save();
        await showroom.save();
        response.useSuccessResponse(res, 'Showroom deleted successfully', {}, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


const approvalofShowRoom = async (req: any, res: any): Promise<void> => {
    try {
        const { userId } = req.user;
        const {status,showroomId} = req.body;
        const showroom = await ShowRoom.findById(showroomId);
        const user = await UserModel.findOne({ _id: userId, isDeleted: false });
        const reciever = await UserModel.findOne({ _id: showroom.owner, isDeleted: false })
        if (!user||user?.role !== 'superAdmin') {
            response.useErrorResponse(res, "Unauthorized: Permission Denied", true, 401);
        }
        if (!showroom) {
            return response.useErrorResponse(res, 'Showroom not found', true, 400);
        }
        
        showroom.status = status;
        
        await showroom.save();
        sendApprovalNotification(showroom._id, `Approval Required: ${status === 'approved' ? 'Your Showroom reservation has been approved.' : 'Your ShowRoom reservation has been declined.'}`,reciever._id,"showroom", reciever.deviceToken, "Approval Status");

        response.useSuccessResponse(res, `Showroom ${status} successfully`, showroom, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

export { createShowRoom, getAllShowRooms, getShowRoomById, updateShowRoomById, deleteShowRoomById, getShowRoomByOwnerId, approvalofShowRoom };
