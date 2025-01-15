import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import response from '../services/apiresponse';

const normalizeEmail = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.email) {
        req.body.email = req.body.email.toLowerCase();
        req.body.email = req.body.email.replace(/\+.*@/, "@");
    }
    next();
};
const containsNoNumber = (value: string) => {
    return !/\d/.test(value); 
};

const validateUserRegistration = [
    body('firstName').notEmpty().withMessage('First name is required').custom(containsNoNumber).withMessage('First name must not contain numbers'),
    body('lastName').notEmpty().withMessage('Last name is required').custom(containsNoNumber).withMessage('Last name must not contain numbers'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response.useErrorResponse(res, 'Invalid input, please try again with valid details', errors.array(), 400);

        }
        next();
    }
];

export {
    normalizeEmail,
    validateUserRegistration
};
