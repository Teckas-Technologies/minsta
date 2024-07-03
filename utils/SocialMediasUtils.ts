import SocialMedias from "../model/SocialMedia";
import { connectToDatabase } from "./mongoose";
import { SocialMedia } from "@/data/types";


export const findAllSocialMedias = async (): Promise<any> => {
    await connectToDatabase();
    const modules = await SocialMedias.find({});
    return modules;
}

export async function saveSocialMedia(data: SocialMedia): Promise<any> {
    await connectToDatabase();
    const { name, title } = data;

    let existingSocialMedia = await SocialMedias.findOne({ name });

    if (existingSocialMedia) {
        
        return existingSocialMedia.save();
    } else {
        const newSocialMedia = new SocialMedias({
            title,
        });
        return newSocialMedia.save();
    }
}