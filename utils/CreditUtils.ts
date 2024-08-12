import Credits from "../model/Credits";
import { connectToDatabase } from "./mongoose";
import { CreditsType } from "@/data/types";

export const findAllCredits = async (): Promise<any> => {
    await connectToDatabase();
    const credits = await Credits.find({});
    return credits;
}

export const findCreditById = async (accountId: string): Promise<any> => {
    await connectToDatabase();

    try {
        const credit = await Credits.findOne({ accountId });
        return credit;
    } catch (err) {
        console.error('Error finding  credit:', err);
        return null;
    }
}

export async function saveCredit(data: CreditsType ): Promise<any> {
    await connectToDatabase();
    const { accountId, credit} = data;

    let existingProfile = await Credits.findOne({ accountId });

    if (existingProfile) {
        existingProfile.credit = credit
        return existingProfile.save();
    } else {
        const newCredit = new Credits({
            accountId: accountId,
            credit: credit
        });
        return newCredit.save();
    }
}