import { NextResponse } from "next/server";
import { findAllSocialMedias, saveSocialMedia } from "../../utils/SocialMediasUtils";
import { HidePost, SocialMedia } from "@/data/types";
import { findHidePostById, saveHidePost } from "../../utils/HidePostUtils";

const hidepost = () => {
  return {
    hideposthandler: {
      GET: async (request: Request, data: any) => {
        const url = new URL(request.url);
        const accountId = url.searchParams.get("accountId");
        console.log("Account Id >>",accountId)
        if (!accountId) {
          return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
        }
        const hiddenPost: HidePost = await findHidePostById(accountId.toString());
        return NextResponse.json(hiddenPost, { status: 200 });
      },
      POST: async (request: Request) => {
        const body = await request.json();
        const hidePost: HidePost & { unhide?: boolean } = body;
        console.log("API Hide Post :", hidePost);
        const savedHiddenPost = await saveHidePost(hidePost);
        return NextResponse.json(savedHiddenPost, { status: 200 });
      },
    },
  };
};

export const { hideposthandler } = hidepost();