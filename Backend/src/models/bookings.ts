import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    PickupDate: {
        type: Date,
    },
    ReturnDate: {
        type: Date,
    },
    TotalCost: {
        type: Number,
        required: true
    },
    UserCnic: {
        type: String,
        required: true
    },
    UserCnicPicFront: {
        type: String,
        required: true
    },
    UserCnicPicBack: {
        type: String,
        required: true
    },
    GranteeCnic: {
        type: String,
        required: true
    },
    GranteeName: {
        type: String,
        required: true
    },
    GranteePhoneNumber: { 
        type: String,
        required: true
    },
    GranteeCnicPicFront: {
        type: String,
        required: true
    },
    GranteeCnicPicBack: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["accepted", "rejected", "completed", "cancelled", "pending"],
        default: "pending",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        required: true
    },
    showRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShowRoom',
        default: null,
        required: false
    },

    Car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        default: null,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking 