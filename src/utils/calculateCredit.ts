import { constants } from "@/constants";

export const calculateCredit = (amount: number) => {
    const creditValue = Math.round((amount / constants.creditAmount) * 100) / 100;
    return Math.floor(creditValue);
};