import { Request, Response } from 'express';
import BookingModel from '../models/bookings';
import response from '../services/apiresponse';
import { errorHandler } from '../services/handleResponse';
import UserModel from '../models/user';
import FavoriteModel from '../models/favorite';
import showRoomModel from '../models/showRoom';
import { sendApprovalNotification } from './notifications';
// import Trash from '../models/trash';

interface Booking {
    TotalCost: Number;
    UserCnic: String;
    UserCnicPicBack: String;
    UserCnicPicFront: String;
    GranteeCnic: String;
    GranteeName: String;
    GranteeCnicPicFront: String;
    GranteeCnicPicBack: String;
    GranteeNameCnic: String;
    status: String;
    user: String;
    Car: String;
    showRoom: String;
}

/*================================= add the Booking  =================================*/

// const createBooking = async (req: any, res: Response): Promise<void> => {
//     try {
//         const { TotalCost, UserCnic, UserCnicPicFront, UserCnicPicBack, GranteeCnic, GranteeName, GranteeCnicPicFront, GranteeCnicPicBack, GranteePhoneNumber, status, Car, showRoom } = req.body;
//         const userId = req.user?.userId;
//         req.body.user = userId;

//         if (!TotalCost || !UserCnic || !UserCnicPicFront || !UserCnicPicBack || !GranteeCnic || !GranteeName || !GranteeCnicPicFront || !GranteeCnicPicBack || !GranteePhoneNumber || !status || !userId || !Car || !showRoom) {
//             response.useErrorResponse(res, 'Required fields are missing', true, 400);
//             return;
//         }

//         // await Trash.findOneAndDelete({ file: UserCnicPic });
//         // await Trash.findOneAndDelete({ file: GranteeNameCnicPic });
//         const existingBooking = await BookingModel.findOne({ user: userId, Car, $and: [{ status: { $ne: 'completed' } }] });

//         if (existingBooking) {
//             response.useErrorResponse(res, 'You have already booked this car, and the previous booking is not completed.', true, 400);
//             return;
//         }

//         const newBooking: any = await BookingModel.create<Booking>(req.body);
//         const _showRoom = await showRoomModel.findById(showRoom);
        

//         response.useSuccessResponse(res, 'Booking created successfully. Please wait for approval.', newBooking, 201);
//     } catch (error) {
//         console.error(error);
//         errorHandler(res, error);
//     }
// };

const createBooking = async (req: any, res: Response): Promise<void> => {
    try {
        const { TotalCost, UserCnic, UserCnicPicFront, UserCnicPicBack, GranteeCnic, GranteeName, GranteeCnicPicFront, GranteeCnicPicBack, GranteePhoneNumber, status, Car, showRoom } = req.body;
        const userId = req.user?.userId;
        req.body.user = userId;

        if (!TotalCost || !UserCnic || !UserCnicPicFront || !UserCnicPicBack || !GranteeCnic || !GranteeName || !GranteeCnicPicFront || !GranteeCnicPicBack || !GranteePhoneNumber || !status || !userId || !Car || !showRoom) {
            response.useErrorResponse(res, 'Required fields are missing', true, 400);
            return;
        }

        const existingBooking = await BookingModel.findOne({ user: userId, Car, status: { $nin: ['completed', 'rejected','cancelled'] } });

        if (existingBooking) {
            response.useErrorResponse(res, 'You have already booked this car, and the previous booking is not cancelled,completed or rejected.', true, 400);
            return;
        }

        const carBookingStatus = await BookingModel.findOne({user: userId, Car});

        if (carBookingStatus && carBookingStatus.status === 'pending') {
            response.useErrorResponse(res, 'This car is already booked and the booking is pending. You cannot rebook at the moment.', true, 400);
            return;
        }

        const newBooking: any = await BookingModel.create<Booking>(req.body);
        const _showRoom: any = await showRoomModel.findById(showRoom).populate('owner');
        

        sendApprovalNotification(newBooking._id, `New Notification about Booking.`, _showRoom?.owner,'booking',_showRoom.owner?.deviceToken, "Booking Notification", );
        response.useSuccessResponse(res, 'Booking created successfully. Please wait for approval.', newBooking, 201);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};



/*================================= get booking by filters =================================*/


const getAllBookings = async (req: any, res: Response): Promise<void> => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const skip = (parseInt(page.toString()) - 1) * parseInt(pageSize.toString());

        if (!req.query.showRoom) {
            const userId = req.user?.userId;
            req.query.user = userId;
        }

        const filter: any = {};

        if (!(req.query.status === '') && req.query?.status) {
            filter.status = req.query?.status;
        }

        if (req.query.showRoom && req.query.showRoom.toLowerCase() !== 'null') {
            filter.showRoom = req.query.showRoom;
        } else {
            filter.user = req.user.userId;
        }

        const bookings = await BookingModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(pageSize.toString()))
            .populate('Car')
            ;

        const count = await BookingModel
            .countDocuments(filter)
            ;


        // Assuming you have information about user's favorites
        const userId = req.user.userId;
        const favorites = await FavoriteModel.find({ user: userId }).sort({ createdAt: -1 });;

        // Populate isFavorite property for each booking's Car
        const bookingsWithFavorites = bookings.map((booking: any) => {
            const isFavorite = favorites.some((fav: any) => fav.car.toString() === booking.Car._id.toString());
            return { ...booking.toObject(), Car: { ...booking.Car.toObject(), isFavorite } };
        });
        const data = {
            data: bookingsWithFavorites,
            totalCount: count
        }
        response.useSuccessResponse(res, 'Retrieved bookings successfully', data, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


const getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
        const booking = await BookingModel.findById(req.params.id)
            .populate({
                path: 'user',
                select: 'firstName lastName email phoneNumber profilePic role'
            })
            .populate('Car');

        if (!booking) {
            response.useErrorResponse(res, 'Booking not found', true, 400);
            return;
        }

        response.useSuccessResponse(res, 'Retrieved booking details successfully', booking, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};


/*================================= update the booking details =================================*/

const updateBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
        // await Trash.findOneAndDelete({ file: req.body.UserCnicPic });
        // await Trash.findOneAndDelete({ file: req.body.GranteeNameCnicPic });
        const updatedBooking = await BookingModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) {
            response.useErrorResponse(res, 'Booking not found', true, 400);
            return;
        }
        response.useSuccessResponse(res, 'Booking updated successfully', updatedBooking, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

/*================================= change the bookings status =================================*/

const UpdateStatusOfBooking = async (req: any, res: Response): Promise<void> => {
    try {
        const { status, booking } = req.body;
        if (!status || !booking) {
            response.useErrorResponse(res, 'Bad Request: Required fields are missing', true, 400);
            return;
        }

        const Booking = await BookingModel.findById(booking);
        if (!Booking) {
            response.useErrorResponse(res, 'Not Found: Booking not found', true, 400);
            return;
        }

        if (req.user.role === 'showroomOwner' && (status == 'accepted' || status == 'rejected' || status == 'completed')) {
            Booking.status = status;
            const user = await UserModel.findOne({ _id: Booking.user, isDeleted: false });
            sendApprovalNotification(Booking._id, `Your booking is ${status}`, user._id,'booking',user.deviceToken,"Booking Status",);
        } else if ((req.user.role === 'user' || req.user.userId === Booking.user.toString()) && status === 'cancelled') {
            Booking.status = status;
        } else {
           
        return    response.useErrorResponse(res, 'Unauthorized: Permission Denied', { unauthorized: true }, 400);
        }

        const updatedBooking = await Booking.save();
        response.useSuccessResponse(res, `Booking ${status} successfully`, updatedBooking, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

export { createBooking, getAllBookings, getBookingById, updateBookingById, UpdateStatusOfBooking };
