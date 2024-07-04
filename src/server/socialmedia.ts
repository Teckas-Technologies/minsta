import { NextResponse } from "next/server";
import { findAllSocialMedias, saveSocialMedia } from "../../utils/SocialMediasUtils";
import { SocialMedia } from "@/data/types";

const socialmedia = () => {
  return {
    socialmediahandler: {
      GET: async (request: Request, data: any) => {
        const socialMedias: SocialMedia[] = await findAllSocialMedias();
        return NextResponse.json(socialMedias, { status: 200 });
      },
      POST: async (request: Request) => {
        const body = await request.json();
        const socialMedia: SocialMedia = body;
        console.log("API SocialMedia :", socialMedia);
        const savedSocialMedia = await saveSocialMedia(socialMedia);
        return NextResponse.json(savedSocialMedia, { status: 200 });
      },
    },
  };
};

export const { socialmediahandler } = socialmedia();