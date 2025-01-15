import mongoose from "mongoose"

const showRoomSchema = new mongoose.Schema({
    showRoomName: {
        required: true,
        type: String,
    },
    location: {
        required: true,
        type: String,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    phone: {
        type: String,
        required: true
    },
    showRoomPicture: {
        required: true,
        type: String
    },
    status: {
        type: String,
        enum: ["approved", "rejected", "pending"],
        default: "pending",
    },
    // rentType: {
    //     type: String,
    //     enum: ['withDriver', 'withoutDriver', 'both'],
    //     default: 'withoutDriver',
    // },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const ShowRoom = mongoose.model('ShowRoom', showRoomSchema);

export default ShowRoom;
