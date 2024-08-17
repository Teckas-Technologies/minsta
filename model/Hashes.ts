import mongoose, { Document, Model } from 'mongoose';

export interface Hashes extends Document {
    accountId: string;
    amount: number;
    hash: string;
}

const hashesSchema = new mongoose.Schema(
    {
        accountId: {
            type: String,
            required: true,
        },
        amount: {
            type: String,
            required: true,
        },
        hash: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Hashes: Model<Hashes> = mongoose.models.Hashes || mongoose.model<Hashes>('Hashes', hashesSchema);

export default Hashes;