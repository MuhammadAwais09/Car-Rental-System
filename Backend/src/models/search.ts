// searchHistory.model.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchHistory extends Document {
    user: string;
    query: string;
    createdAt: Date;
}

const searchHistorySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    query: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISearchHistory>('SearchHistory', searchHistorySchema);
