import mongoose, { Document, Model } from 'mongoose';

export interface Credits extends Document {
    accountId: string;
    credit: number;
}

const creditsSchema = new mongoose.Schema(
    {
        accountId: {
            type: String,
            required: true,
        },
        credit: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

const Credits: Model<Credits> = mongoose.models.Credits || mongoose.model<Credits>('Credits', creditsSchema);

export default Credits;