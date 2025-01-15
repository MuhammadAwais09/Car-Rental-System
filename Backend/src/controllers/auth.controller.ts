
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import { otpSender } from '../services/OTPsender';
import generateOTP from '../services/otpGenerater';
import response from '../services/apiresponse';
import { errorHandler } from '../services/handleResponse';
// import Trash from '../models/trash';
require('dotenv').config()


const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, role, phoneNumber } = req.body;
        if (!firstName || !lastName || !email || !password) {
            response.useErrorResponse(res, 'Registration failed. Please provide all required information.', true, 400);

            return
        }
        if (role === 'superAdmin'||role === 'admin') { 
            return response.useErrorResponse(res, "Unauthorized: Permission Denied you can't take this role without permission", { unauthorized: true }, 400);

        }
        const existingUser = await UserModel.findOne({ email,isDeleted:false });
        if (existingUser) {

            response.useErrorResponse(res, 'Email already taken. Try another.', true, 400);
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const otp = generateOTP(6);
        const newUser = new UserModel({
            firstName,
            lastName,
            phoneNumber,
            email,
            password: hashedPassword,
            verificationToken: otp,
            verificationTokenTime: Date.now(),
            role: role || 'user'
        });

        await newUser.save();
        await otpSender(
            newUser.email,
            otp,
            'Email verification'
        );

        const data = {
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            id: newUser._id,
            role: newUser.role
        }
        response.useSuccessResponse(res, 'Registration successful. Check your email for verification.', data, 201);
        return
    } catch (error) {
        console.error(error);
        errorHandler(res, error)
    }
};

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        let { token } = req.body;
        if (!token) {
            response.useErrorResponse(res, 'Token missing in request.', true, 400);
            return;
        }

        const user = await UserModel.findOne({ verificationToken: token,isDeleted:false });

        if (!user) {
            response.useErrorResponse(res, 'Invalid verification token.', true, 400);
            return;
        }
        const currentDate = new Date();
        const currentTime = currentDate.getTime();
        const validOtpTIME = user.verificationTokenTime + (120 * 1000)
        if ((validOtpTIME >= currentTime)) {
            const tokenVersion = generateOTP(15)
            user.tokenVersion = tokenVersion;
            token = jwt.sign({ userId: user._id, tokenVersion: tokenVersion, role: user.role }, process.env.SECRET || '123-abc-456-cdef-987-dfg');

            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenTime = undefined;
            await user.save();
            const userdata = {
                email: user.email,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user._id,
                role: user.role

            }
            const data = {
                token: token,
                user: userdata
            }

            return response.useSuccessResponse(res, 'Email verified successfully.', data, 200);
        }
        response.useErrorResponse(res, 'Expired verification token.', true, 400);

    } catch (error) {
        console.error(error);
        errorHandler(res, error)
    }
};

const verifyForReset = async (req: any, res: Response): Promise<void> => {
    try {
        const { token } = req.body;
        if (!token) {
            response.useErrorResponse(res, 'Token missing in request body.', true, 400);
            return;
        }
        const user = await UserModel.findOne({ verificationToken: token, isDeleted: false });

        if (!user) {
            response.useErrorResponse(res, 'Invalid verification token.', true, 400);
            return;
        }
        const currentDate = new Date();
        const currentTime = currentDate.getTime();
        const validOtpTIME = user.verificationTokenTime + (120 * 1000)
        if ((validOtpTIME >= currentTime)) {
            const OTP = crypto.randomBytes(20).toString('hex');
            user.isVerified = true;
            user.verificationToken = OTP;
            await user.save();
            const data = {
                token: OTP
            }
                return response.useSuccessResponse(res, 'Email verified successfully.', data, 200);
            }

            response.useErrorResponse(res, 'Invalid verification token.', true, 400);


    } catch (error) {
        console.error(error);
        errorHandler(res, error)
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email,isDeleted:false });

        if (!user) {
            response.useErrorResponse(res, 'User not found.', true, 400);
            return;
        }
        if (!user.isVerified) {
            const data = { message: 'Token not verified', isVerified: false };
            response.useErrorResponse(res, 'You are not verified.', data, 400);
            return;
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            response.useErrorResponse(res, 'Invalid email or password.', true, 400);
            return;
        }

        const tokenVersion = generateOTP(15)

        const token = jwt.sign({ userId: user._id, tokenVersion: tokenVersion, role: user.role }, process.env.SECRET || '123-abc-456-cdef-987-dfg');
        let isShowRoom = false

        user.tokenVersion = tokenVersion;
        await user.save();
        if (user.role === 'showroomOwner') {
            isShowRoom = true;
        }
        const data = {
            token: token,
            isShowRoom: isShowRoom,
            role: user.role,
            deviceToken: user.deviceToken || null,
        }
        return response.useSuccessResponse(res, 'Login successful.', data, 200);
    } catch (error) {
        console.error(error);
        errorHandler(res, error)
    }
};


const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email,isDeleted: false});

        if (user) {
            const otp = generateOTP(6);

            user.verificationToken = otp;
            user.verificationTokenTime = Date.now();
            await user.save();

            const subject = 'Forgot your password';
            await otpSender(user.email, otp, subject);

            return response.useSuccessResponse(res, 'Password reset initiated.', { email }, 200);
        }

        const data = { message: 'User not found.', isUser: false };
        return response.useErrorResponse(res, 'User not found', data, 400);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, subject = 'Your OTP to verify' } = req.body;
        if (!email) {
            response.useErrorResponse(res, 'Resend OTP failed', true, 400);

        }
        const user = await UserModel.findOne({ email,isDeleted:false });

        if (user) {
            const otp = generateOTP(6);
            user.verificationToken = otp;
            user.verificationTokenTime = Date.now();
            await user.save();

            await otpSender(user.email, otp, subject);

            return response.useSuccessResponse(res, 'OTP resent successfully.', { email }, 200);
        }

        const data = { message: 'User not found.', isUser: false };
        return response.useErrorResponse(res, 'Error', data, 400);
    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const viewProfile = async (req: any, res: Response): Promise<void> => {
    try {
        const { userId } = req.user;
        const user = await UserModel.findOne({ _id: userId, isDeleted: false });

        if (user) {
            user.verificationToken = undefined;
            await user.save();

            const data = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                profilePic: user.profilePic || undefined,
                address: user.address || undefined,
                id: user._id,
                role: user.role,
                deviceToken: user.deviceToken
            };

            return response.useSuccessResponse(res, 'Profile retrieved successfully.', data, 200);
        }

        return response.useErrorResponse(res, 'User not found.', true, 400);

    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, newPassword } = req.body;

        if (token) {
            const user = await UserModel.findOne({ verificationToken: token, isDeleted: false });
            if (user) {
                const encryptedPassword = await bcrypt.hash(newPassword, 10);
                user.password = encryptedPassword;

                user.verificationToken = undefined;
                await user.save();

                return response.useSuccessResponse(res, 'Password changed successfully.', {}, 200);
            }

            return response.useErrorResponse(res, 'Invalid or expired OTP.', true, 400);
        } else {
            return response.useErrorResponse(res, 'Token not entered or invalid.', true, 400);
        }

    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const profileManager = async (req: any, res: any) => {
    try {
        const { userId } = req.user;
        const { address, profilePic, firstName, lastName } = req.body;
        const user = await UserModel.findOne({_id:userId, isDeleted: false});

        if (user) {
            user.firstName = firstName || user.firstName;
            user.profilePic = profilePic || user.profilePic || undefined;
            user.lastName = lastName || user.lastName;
            user.address = address || user.address || undefined;

            const updatedUser = await user.save();
            const data = {
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                phoneNumber: updatedUser.phoneNumber,
                profilePic: user.profilePic || undefined,
                address: user.address || undefined,
                id: updatedUser._id,
                role: updatedUser.role
            };

            return response.useSuccessResponse(res, 'Profile updated successfully.', data, 200);
        }

        return response.useErrorResponse(res, 'User not found.', true, 400);

    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
};

const allowNotification = async (req: any, res: any) => {
    try {
        const { userId } = req.user;
        const { deviceToken } = req.body;

        if (!deviceToken)
        {
            return response.useErrorResponse(res, 'Token missing.', true, 400);
        }

        const user = await UserModel.findOne({ _id: userId, isDeleted: false });
        user.deviceToken = deviceToken;
        await user.save();

        return response.useSuccessResponse(res, 'Notification allowed successfully.', user, 200);

    } catch (error) {
        console.error(error);
        errorHandler(res, error);
    }
}



export { register, verifyEmail, login, forgotPassword, resetPassword, verifyForReset, viewProfile, resendOtp, profileManager, allowNotification };
