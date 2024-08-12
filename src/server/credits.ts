import { NextResponse } from "next/server";
import { CreditsType } from "@/data/types";
import { findCreditById, saveCredit } from "../../utils/CreditUtils";

const credits = () => {
  return {
    credithandler: {
      GET: async (request: Request, data: any) => {
        const url = new URL(request.url);
        const accountId = url.searchParams.get("accountId");
        if (!accountId) {
          return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
        }
        const credit: CreditsType = await findCreditById(accountId.toString());
        return NextResponse.json(credit, { status: 200 });
      },
      POST: async (request: Request) => {
        const body = await request.json();
        const credit: CreditsType = body;
        console.log("API >> ", credit)
        const savedCredit = await saveCredit(credit);
        console.log("API Saved >> ", savedCredit)
        return NextResponse.json(savedCredit, { status: 200 });
      },
    },
  };
};

export const { credithandler } = credits();