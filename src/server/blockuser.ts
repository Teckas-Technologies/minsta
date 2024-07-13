import { NextResponse } from "next/server";
import { BlockUserType, HidePost } from "@/data/types";
import { findHidePostById, saveHidePost } from "../../utils/HidePostUtils";
import { findBlockedUserById, saveBlockUser } from "../../utils/BlockUserUtils";

const blockuser = () => {
  return {
    blockuserhandler: {
      GET: async (request: Request, data: any) => {
        const url = new URL(request.url);
        const accountId = url.searchParams.get("accountId");
        if (!accountId) {
          return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
        }
        const blockUser: BlockUserType = await findBlockedUserById(accountId.toString());
        return NextResponse.json(blockUser, { status: 200 });
      },
      POST: async (request: Request) => {
        const body = await request.json();
        const blockUser: BlockUserType & { unblock?: boolean } = body;
        const savedBlockUser = await saveBlockUser(blockUser);
        return NextResponse.json(savedBlockUser, { status: 200 });
      },
    },
  };
};

export const { blockuserhandler } = blockuser();