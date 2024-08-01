import mongoose, { Document, Model } from 'mongoose';

export interface Profile extends Document {
    accountId: string;
    name: string;
    profileImage?: string;
    backgroundImage?: string;
    about?: string;
    tags?: string[];
    linkTree?: {
        twitter?: string;
        github?: string;
        telegram?: string;
        website?: string;
    };
}

const profileSchema = new mongoose.Schema(
    {
        accountId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
        },
        backgroundImage: {
            type: String,
        },
        about: {
            type: String,
        },
        tags: {
            type: [String],
        },
        linkTree: {
            twitter: {
                type: String,
            },
            github: {
                type: String,
            },
            telegram: {
                type: String,
            },
            website: {
                type: String,
            },
        },
    },
    { timestamps: true }
);

const Profile: Model<Profile> = mongoose.models.Profile || mongoose.model<Profile>('Profile', profileSchema);

export default Profile;
