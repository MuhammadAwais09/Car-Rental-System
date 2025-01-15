import mongoose, { Schema, Document } from 'mongoose';

interface ApprovalNotification extends Document {
    showroom: mongoose.Schema.Types.ObjectId;
    message: string;
    isRead: boolean;
    createdAt: Date;
    car: mongoose.Schema.Types.ObjectId;
    type: string;
}
//: Schema<ApprovalNotification>
const ApprovalNotificationSchema = new Schema({
    showroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShowRoom',
        // required: true,
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        // required: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        // required: true,
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required:true
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["car", "booking", "showroom"],
        default: "car",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ApprovalNotification = mongoose.model('ApprovalNotification', ApprovalNotificationSchema);

export default ApprovalNotification;
