import { NextResponse } from "next/server";
import { ProfileType } from "@/data/types";
import { findProfileById, findAllProfile, saveProfile, findProfilesJoinedLast30Days } from "../../utils/ProfileUtils";

const profile = () => {
  return {
    profilehandler: {
      GET: async (request: Request, data: any) => {
        const url = new URL(request.url);
        const accountId = url.searchParams.get("accountId");
        if (accountId) {
          const profile: ProfileType = await findProfileById(accountId.toString());
          return NextResponse.json(profile, { status: 200 });
        } else {
          const totalProfiles = await findAllProfile();
          const lastMonthProfiles = await findProfilesJoinedLast30Days();
          // const totalProfiles = profiles.length;
          return NextResponse.json({ totalProfiles, lastMonthProfiles }, { status: 200 });
        }
      },
      POST: async (request: Request) => {
        const body = await request.json();
        const profile: ProfileType = body;
        const savedProfile = await saveProfile(profile);
        return NextResponse.json(savedProfile, { status: 200 });
      },
    },
  };
};

export const { profilehandler } = profile();