import mongoose, { Schema, Document } from 'mongoose';

export interface Trash extends Document {
    fileName: string;
    createdAt: Date;
    updatedAt: Date;
}

const trash: Schema<Trash> = new Schema({
    fileName: {
        type: String,
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

const Trash = mongoose.model<Trash>('Trash', trash);
export default Trash;
