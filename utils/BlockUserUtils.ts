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

export async function saveBlockUser(data: BlockUserType & { unblock?: boolean }): Promise<any> {
    await connectToDatabase();
    const { accountId, blockedUsers, unblock } = data;

    try {
        let existingBlockUser = await BlockUser.findOne({ accountId });

        if (existingBlockUser) {
            if(unblock){
                existingBlockUser.blockedUsers = existingBlockUser?.blockedUsers.filter(
                    userId => !blockedUsers.some(blockeduser => blockeduser?.blockedUserId === userId?.blockedUserId)
                );
            } else {
                blockedUsers.forEach(user => {
                    if (!existingBlockUser?.blockedUsers.includes(user)) {
                        existingBlockUser?.blockedUsers.push(user);
                    }
                });
            }
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