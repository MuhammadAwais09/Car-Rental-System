import { Request, Response } from 'express';
import ApprovalNotification from '../models/notification';
import pushNotifications from '../services/notification';
import { errorHandler } from '../services/handleResponse';
import response from '../services/apiresponse';
// import Car from '../models/car';
// import BookingModel from '../models/bookings';
// import ShowroomModel from '../models/showRoom';

/* ================================= Create the Notification for Showroom Approval ================================= */

const createApprovalNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, message, type, reciever } = req.body;
        const newNotification = new ApprovalNotification({ [type]: id, message, type, reciever });
        await newNotification.save();

        response.useSuccessResponse(res, `${type}approval notification saved successfully`, newNotification, 200);
    } catch (error) {
        console.error('Error creating notification:', error);
        errorHandler(res, error);
    }
};

/* ================================= Create the Notification for Showroom Approval and Send Push Notification ================================= */



const sendApprovalNotification = async (id: any, message: any,reciever:any,type: any, deviceToken: any, title: String = "Showroom Approval Notification") => {
    try {

        const newNotification = new ApprovalNotification({ [type]: id, message, type, reciever});
        // const showroom = await ShowroomModel.findOne({ _id: id, isDeleted: false });
        // if () {
        // const owner = await UserModel.findOne({ _id: showroom.owner, isDeleted: false });
        if (deviceToken) {
            pushNotifications(deviceToken, title, message);
        }
        // }
        return await newNotification.save();
    } catch (error) {
        console.error('Error creating showroom approval notification:', error);
        return error;
    }
};

/* ================================= Get the Showroom Approval Notifications ================================= */

// const getApprovalNotifications = async (req:any, res:any) => {
//     try {
//         const { page = 1, pageSize = 10, type = 'showroom', isRead } = req.query;
//         const skip = (parseInt(page.toString()) - 1) * parseInt(pageSize.toString());

//         let populateModel:any;
//         if (type === 'car') {
//             populateModel = Car;
//         } else if (type === 'booking') {
//             populateModel = BookingModel;
//         } else  {
//             populateModel = ShowroomModel;
//         }

//         const notifications = await ApprovalNotification.find(isRead)
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(parseInt(pageSize.toString()))
//             .populate({
//                 path: type === 'showroom' ? 'showroom' : 'car',
//                 model: populateModel,
//             })
//             .exec();

//         const count = await ApprovalNotification.countDocuments(isRead);

//         const data = {
//             data: notifications,
//             totalCount: count,
//         };

//         response.useSuccessResponse(res, `Retrieving ${type} notifications successfully`, data, 200);
//     } catch (error) {
//         console.error(`Error retrieving  notifications:`, error);
//         errorHandler(res, error);
//     }
// };

const getApprovalNotifications = async (req: any, res: any) => {
    try {
        const { page = 1, pageSize = 10, isRead } = req.query;
        const skip = (parseInt(page.toString()) - 1) * parseInt(pageSize.toString());
        let notifications: any;
        // if (req.user.role !== "admin" || req.user.role !== "superAdmin") {
            notifications = await ApprovalNotification.find({reciever:req.user.userId, isRead })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(pageSize.toString()))
                .exec();
        // } else {
            
        //     notifications = await ApprovalNotification.find({ isRead })
        //     .sort({ createdAt: -1 })
        //     .skip(skip)
        //     .limit(parseInt(pageSize.toString()))
        //     .exec();
        // }

        await Promise.all(
            notifications.map(async (notification:any) => {
                if (notification.type === 'car' && notification.car) {
                    await notification.populate('car');
                } else if (notification.type === 'booking' && notification.booking) {
                    await notification.populate({
                        path: 'booking',
                        populate: { path: 'Car' }
                    })
                } else if (notification.type === 'showroom' && notification.showroom) {
                    await notification.populate('showroom');
                }
            })
        );

        const count = await ApprovalNotification.countDocuments({ reciever: req.user.userId, isRead });

        const data = {
            data: notifications,
            totalCount: count,
        };

        response.useSuccessResponse(res, 'Retrieving notifications successfully', data, 200);
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        errorHandler(res, error);
    }
};


const readSingleNotifications = async (req: any, res: any) => {
    try {
        const { notificationId } = req.body;
        const { userId } = req.user;
        if (!notificationId) {
            return response.useErrorResponse(res, "please provide a notification id", true, 400);
        }
        const notification = await ApprovalNotification.findOne({ _id: notificationId, reciever: userId });

        if (notification) {
            notification.isRead = true;
            const readedNotification = await notification.save();

            return response.useSuccessResponse(res, "Notification is readed successfully", readedNotification, 200);
        }
        return response.useErrorResponse(res, "Notification not found", true, 400);
    } catch (error) {
        console.error(error.message);
        errorHandler(res, error);
    }
};

/* ================================= Read All the Notification Against the specific user ================================= */

const readAllNotifications = async (req: any, res: any) => {
    try {
        const { userId } = req?.user;
       
        const notifications = await ApprovalNotification.updateMany({ reciever: userId }, { isRead: true });

        return response.useSuccessResponse(res, "All notifications marked as read", notifications, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

export {
    createApprovalNotification,
    sendApprovalNotification,
    getApprovalNotifications,
    readAllNotifications,
    readSingleNotifications
};
