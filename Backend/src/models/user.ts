import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zipCode: String
});

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    firstName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    deviceToken: {
        type: String,
        default: null
    },
    profilePic: {
        type: String,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: addressSchema,
    tokenVersion: {
        type: String,
    },
    role: {
        type: String,
        enum: ['showroomOwner','superAdmin', 'admin', 'user'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: undefined || String || null,
    },
    verificationTokenTime: {
        type: undefined || Number || null,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
