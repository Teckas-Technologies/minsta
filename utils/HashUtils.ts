import Hashes from "../model/Hashes";
import { connectToDatabase } from "./mongoose";
import { HashesType } from "@/data/types";

export const findAllHashes = async (): Promise<any> => {
    await connectToDatabase();
    const credits = await Hashes.find({});
    return credits;
}

export const findHashByhash = async (hash: string): Promise<any> => {
    await connectToDatabase();

    try {
        const hashRes = await Hashes.findOne({ hash });
        if(hashRes === null){
            return {hashRes, exist: false};
        }
        console.log("has", hashRes)
        return {hashRes, exist: true};
    } catch (err) {
        console.error('Error finding  hash:', err);
        return null;
    }
}

export async function saveHash(data: HashesType ): Promise<any> {
    await connectToDatabase();
    const { accountId, amount, hash} = data;

    let existingHash = await Hashes.findOne({ hash });

    if (existingHash) {
        return {existingHash, exist: true};
    } else {
        const newHash = new Hashes({
            accountId: accountId,
            amount: amount,
            hash: hash
        });
        return newHash.save();
    }
}