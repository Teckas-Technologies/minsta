import Giveaway from "../model/GiveAway";
import { connectToDatabase } from "./mongoose";
import { GiveawayType } from "@/data/types";

export const findAllGiveAways = async (): Promise<any> => {
    await connectToDatabase();
    const giveaways = await Giveaway.find({});
    return giveaways;
}

export const findGiveawayById = async (id: string): Promise<any> => {
    await connectToDatabase();
    try {
        const giveaway = await Giveaway.findOne({});
        return giveaway;
    } catch (err) {
        console.error('Error finding  giveaway:', err);
        return null;
    }
}

// Get all ended giveaways, ordered by the most recent end date first
export const findEndedGiveaways = async (): Promise<any> => {
    await connectToDatabase();
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const endedGiveaways = await Giveaway.find({ endDate: { $lt: currentDate } })
        .sort({ endDate: -1 }) // Sort by endDate in descending order
        .exec();
    return endedGiveaways;
};

export const findUpcomingGiveaways = async (): Promise<any> => {
    await connectToDatabase();

    const currentDate = new Date();
    // Set the time to the start of the day (00:00:00)
    currentDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1); // Move to the next day

    const upcomingGiveaways = await Giveaway.find({ startDate: { $gte: nextDay } })
        .sort({ startDate: 1 }) // Sort by startDate in ascending order
        .exec();

    return upcomingGiveaways;
};

export const findOngoingGiveaways = async (): Promise<any> => {
    await connectToDatabase();

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1); // Move to the next day

    const ongoingGiveaways = await Giveaway.find({
        startDate: { $lt: nextDay },  // Include today by using less than tomorrow
        endDate: { $gte: currentDate }
    })
        .sort({ endDate: 1 }) // Sort by endDate in ascending order
        .exec();

    return ongoingGiveaways;
};

export async function saveGiveaway(data: GiveawayType): Promise<any> {
    await connectToDatabase();
    const { title, description, startDate, endDate, token, totalPrizePool, winnerCount, paid } = data;

    let existingGiveaway = await Giveaway.findOne({ title });

    if (existingGiveaway) {
        existingGiveaway.title = title,
            existingGiveaway.description = description,
            existingGiveaway.totalPrizePool = totalPrizePool,
            existingGiveaway.token = token,
            existingGiveaway.startDate = startDate,
            existingGiveaway.endDate = endDate,
            existingGiveaway.winnerCount = winnerCount
        if (typeof paid !== 'undefined') {
            existingGiveaway.paid = paid;
        }
        return existingGiveaway.save();
    } else {
        const newGiveaway = new Giveaway({
            title,
            description,
            startDate,
            endDate,
            totalPrizePool,
            token,
            winnerCount,
            paid: paid ?? false,
        });
        return newGiveaway.save();
    }
}