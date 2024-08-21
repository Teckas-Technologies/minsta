import mongoose, { Document, Model } from 'mongoose';

export interface Profile extends Document {
    accountId: string;
}

const profileSchema = new mongoose.Schema(
    {
        accountId: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const Profile: Model<Profile> = mongoose.models.Profile || mongoose.model<Profile>('Profile', profileSchema);

export default Profile;
