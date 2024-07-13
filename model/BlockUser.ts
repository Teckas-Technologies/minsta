import mongoose, { Document, Model } from 'mongoose';

export interface BlockUser extends Document {
    accountId : string;
    blockedUsers: BlockedUser[];
}

export interface BlockedUser {
    blockedUserId: string;
}
  
const blockUserSchema = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
    },
    blockedUsers: [{
        blockedUserId: {
            type: String,
            required: true,
        }
    }]
}, { timestamps: true });

const BlockUser: Model<BlockUser> = mongoose.models.BlockUser || mongoose.model<BlockUser>('BlockUser', blockUserSchema);

export default BlockUser;