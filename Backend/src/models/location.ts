import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    name: {
        required: true,
        type: "string",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})

const Locations = mongoose.model('locations', locationSchema);

export default Locations;