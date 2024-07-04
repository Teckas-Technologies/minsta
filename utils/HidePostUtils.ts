import HiddenPost from "../model/HidePost";
import SocialMedias from "../model/SocialMedia";
import { connectToDatabase } from "./mongoose";
import { HidePost, SocialMedia } from "@/data/types";


export const findAllHidePost = async (): Promise<any> => {
    await connectToDatabase();
    const hiddenPost = await HiddenPost.find({});
    return hiddenPost;
}

export const findHidePostById = async (accountId: string): Promise<any> => {
    await connectToDatabase();

    try {
        const hiddenPost = await HiddenPost.findOne({ accountId });
        return hiddenPost;
    } catch (err) {
        console.error('Error finding hidden post:', err);
        return null;
    }
}

export async function saveHidePost(data: HidePost): Promise<any> {
    await connectToDatabase();
    const { accountId, hiddedTokenIds } = data;

    let existingHiddenPostUser = await HiddenPost.findOne({ accountId });

    if (existingHiddenPostUser) {
        existingHiddenPostUser.hiddedTokenIds.push(...data.hiddedTokenIds)
        
        return existingHiddenPostUser.save();
    } else {
        const newHiddenPostUser = new HiddenPost({
            accountId,
            hiddedTokenIds
        });
        return newHiddenPostUser.save();
    }
}