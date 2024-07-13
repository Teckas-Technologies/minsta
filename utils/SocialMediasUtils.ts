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
    const { name, title, path, message, enabled } = data;

    let existingSocialMedia = await SocialMedias.findOne({ name });

    if (existingSocialMedia) {
        if ('name' in data) existingSocialMedia.name = data.name;
        if ('title' in data) existingSocialMedia.title = data.title;
        if ('path' in data) existingSocialMedia.path = data.path;
        if ('message' in data) existingSocialMedia.message = data.message;
        if ('enabled' in data) existingSocialMedia.enabled = data.enabled;
        
        return existingSocialMedia.save();
    } else {
        const newSocialMedia = new SocialMedias({
            name,
            title,
            path,
            message,
            enabled
        });
        return newSocialMedia.save();
    }
}