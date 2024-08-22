import Profile from "../model/Profile";
import { connectToDatabase } from "./mongoose";
import { ProfileType } from "@/data/types";

export const findAllProfile = async (): Promise<any> => {
    await connectToDatabase();
    const profiles = await Profile.find({});
    return profiles;
}

export const findProfileById = async (accountId: string): Promise<any> => {
    await connectToDatabase();

    try {
        const profile = await Profile.findOne({ accountId });
        return profile;
    } catch (err) {
        console.error('Error finding  profile:', err);
        return null;
    }
}

export async function saveProfile(data: ProfileType ): Promise<any> {
    await connectToDatabase();
    const { accountId } = data;

    let existingProfile = await Profile.findOne({ accountId });

    if (existingProfile) {
        return;
    } else {
        const newProfile = new Profile({
            accountId
        });
        return newProfile.save();
    }
}