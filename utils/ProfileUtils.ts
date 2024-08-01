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
    const { accountId, name, profileImage, backgroundImage, about, tags, linkTree } = data;

    let existingProfile = await Profile.findOne({ accountId });

    if (existingProfile) {
        if (name) existingProfile.name = name;
        if (profileImage) existingProfile.profileImage = profileImage;
        if (backgroundImage) existingProfile.backgroundImage = backgroundImage;
        if (about) existingProfile.about = about;
        if (tags) existingProfile.tags = tags;

        if (!existingProfile.linkTree) {
            existingProfile.linkTree = {};
        }
        if (linkTree) {
            if (linkTree.github) existingProfile.linkTree.github = linkTree.github;
            if (linkTree.twitter) existingProfile.linkTree.twitter = linkTree.twitter;
            if (linkTree.telegram) existingProfile.linkTree.telegram = linkTree.telegram;
            if (linkTree.website) existingProfile.linkTree.website = linkTree.website;
        }

        return existingProfile.save();
    } else {
        const newProfile = new Profile({
            accountId,
            name,
            profileImage,
            backgroundImage,
            about,
            tags,
            linkTree
        });
        return newProfile.save();
    }
}