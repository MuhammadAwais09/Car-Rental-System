import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
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

const Brand = mongoose.model('brand', brandSchema);

export default Brand;