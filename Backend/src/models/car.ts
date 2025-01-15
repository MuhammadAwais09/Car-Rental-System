import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    feature: {
        type: String,
        enum: ['manual', 'auto'],
        default: 'manual'
    },
    model: {
        type: String,
        required: true,
    },
    fuelType: {
        type: String,
        enum: ['petrol', 'diesel', 'cng', 'electric'],
        default: 'petrol'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand',
    },
    location: {
        type: String,
        required: true,
    },
    mileage: {
        type: Number,
        required: true,
    },
    realPrice: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
    },
    driverType: {
        type: String,
        enum: ['withDriver', 'withoutDriver',],
        default: 'withoutDriver'

    },
    description: {
        type: String,
        required: true,
    },
    pictures: [{
        type: String,
    }],

    status: {
        type: String,
        enum: ["approved", "rejected", "pending"],
        default: "pending",
    },
    showroomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Showroom',
    },
    showroomOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    UpdatedAt: {
        type: Date,
        default: Date.now,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
});

const Car = mongoose.model('Car', carSchema);

export default Car;
