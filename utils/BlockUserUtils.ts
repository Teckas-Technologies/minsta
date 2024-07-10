import BlockUser from "../model/BlockUser";
import { connectToDatabase } from "./mongoose";
import { BlockUserType } from "@/data/types";


export const findAllBlockedUser = async (): Promise<any> => {
    await connectToDatabase();
    const blockedUsers = await BlockUser.find({});
    return blockedUsers;
}

export const findBlockedUserById = async (accountId: string): Promise<any> => {
    await connectToDatabase();

    try {
        const blockedUser = await BlockUser.findOne({ accountId });
        return blockedUser;
    } catch (err) {
        console.error('Error finding blocked user:', err);
        return null;
    }
}

export async function saveBlockUser(data: BlockUserType): Promise<any> {
    await connectToDatabase();
    const { accountId, blockedUsers } = data;

    try{
        let existingBlockUser = await BlockUser.findOne({ accountId });

        if (existingBlockUser) {
            existingBlockUser.blockedUsers = blockedUsers;
            return existingBlockUser.save();
        } else {
            const newBlockUser = new BlockUser({
                accountId,
                blockedUsers
            });
            return newBlockUser.save();
        }
    } catch (err) {
        console.error('Error saving block user:', err);
        return null;
    }
}