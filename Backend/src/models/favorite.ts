import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
    user: mongoose.Types.ObjectId;
    car: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const favoriteSchema: Schema<IFavorite> = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
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

const Favorite = mongoose.model<IFavorite>('favorite', favoriteSchema);
export default Favorite;
