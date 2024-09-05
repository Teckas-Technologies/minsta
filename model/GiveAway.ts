import mongoose, { Document, Model } from 'mongoose';

export interface Giveaway extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  totalPrizePool: number;
  token: string;
  winnerCount: number;
//   prizePerWinner: number; 
}

const giveawaySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrizePool: {
      type: Number,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    winnerCount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Adding a virtual field to calculate prize per winner
// giveawaySchema.virtual('prizePerWinner').get(function (this: Giveaway) {
//   return this.totalPrizePool / this.winnerCount;
// });

const Giveaway: Model<Giveaway> = mongoose.models.Giveaway || mongoose.model<Giveaway>('Giveaway', giveawaySchema);

export default Giveaway;
