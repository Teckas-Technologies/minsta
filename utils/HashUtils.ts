import Hashes from "../model/Hashes";
import { connectToDatabase } from "./mongoose";
import { HashesType } from "@/data/types";

export const findAllHashes = async (): Promise<any> => {
    await connectToDatabase();
    const credits = await Hashes.find({});
    return credits;
}

export const getTotalAmountCollected = async (): Promise<{ totalLast30Days: number; totalLifetime: number }> => {
    await connectToDatabase();

    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

    const result = await Hashes.aggregate([
        {
            $facet: {
                totalLast30Days: [
                    { $match: { createdAt: { $gte: date30DaysAgo } } }, 
                    {
                        $group: {
                            _id: null,
                            total: { $sum: { $toDouble: "$amount" } }, 
                        },
                    },
                ],
                totalLifetime: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: { $toDouble: "$amount" } }, 
                        },
                    },
                ],
            },
        },
    ]);

    const totalLast30Days = result[0].totalLast30Days.length > 0 ? result[0].totalLast30Days[0].total : 0;
    const totalLifetime = result[0].totalLifetime.length > 0 ? result[0].totalLifetime[0].total : 0;

    return { totalLast30Days, totalLifetime };
};


export const findHashByhash = async (hash: string): Promise<any> => {
    await connectToDatabase();

    try {
        const hashRes = await Hashes.findOne({ hash });
        if (hashRes === null) {
            return { hashRes, exist: false };
        }
        console.log("has", hashRes)
        return { hashRes, exist: true };
    } catch (err) {
        console.error('Error finding  hash:', err);
        return null;
    }
}

export async function saveHash(data: HashesType): Promise<any> {
    await connectToDatabase();
    const { accountId, amount, hash } = data;

    let existingHash = await Hashes.findOne({ hash });

    if (existingHash) {
        return { existingHash, exist: true };
    } else {
        const newHash = new Hashes({
            accountId: accountId,
            amount: amount,
            hash: hash
        });
        return newHash.save();
    }
}