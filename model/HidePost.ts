import mongoose, { Document, Model } from 'mongoose';

export interface HidePost extends Document {
    accountId : string;
    hiddedTokenIds: HideTokenId[];
}

export interface HideTokenId {
    id: string;
}
  
const hiddenPostSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
    },
    hiddedTokenIds: [{
        id: {
            type: String
        }
    }]
}, { timestamps: true });

const HiddenPost: Model<HidePost> = mongoose.models.HiddenPost || mongoose.model<HidePost>('HiddenPost', hiddenPostSchema);

export default HiddenPost;