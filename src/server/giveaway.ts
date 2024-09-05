import { NextResponse } from "next/server";
import { GiveawayType } from "@/data/types";
import { findAllGiveAways, findEndedGiveaways, findOngoingGiveaways, findUpcomingGiveaways, saveGiveaway } from "../../utils/Giveaway";

const giveaway = () => {
  return {
    giveawayhandler: {
      GET: async (request: Request) => {
        const url = new URL(request.url);
        const type = url.searchParams.get("type");

        let giveaways;

        try {
          switch (type) {
            case "ongoing":
              giveaways = await findOngoingGiveaways();
              break;
            case "ended":
              giveaways = await findEndedGiveaways();
              break;
            case "upcoming":
              giveaways = await findUpcomingGiveaways();
              break;
            default:
              giveaways = await findAllGiveAways();
              break;
          }
          return NextResponse.json(giveaways, { status: 200 });
        } catch (error) {
          console.error("Error fetching giveaways:", error);
          return NextResponse.json({ error: "Failed to fetch giveaways" }, { status: 500 });
        }
      },
      POST: async (request: Request) => {
        const body = await request.json();
        const giveawayData: GiveawayType = body;
        const savedGiveaway = await saveGiveaway(giveawayData);
        return NextResponse.json(savedGiveaway, { status: 200 });
      },
    },
  };
};

export const { giveawayhandler } = giveaway();