import { NextResponse } from "next/server";
import { HashesType } from "@/data/types";
import { findHashByhash, saveHash } from "../../utils/HashUtils";

const hashes = () => {
  return {
    hasheshandler: {
      GET: async (request: Request, data: any) => {
        const url = new URL(request.url);
        const hash = url.searchParams.get("hash");
        if (!hash) {
          return NextResponse.json({ error: "Hash is required" }, { status: 400 });
        }
        const hashes = await findHashByhash(hash.toString());
        return NextResponse.json(hashes, { status: 200 });
      },
      POST: async (request: Request) => {
        const body = await request.json();
        const hashDetail: HashesType = body;
        console.log("API >> ", hashDetail)
        const savedHash = await saveHash(hashDetail);
        console.log("API Saved >> ", savedHash)
        return NextResponse.json(savedHash, { status: 200 });
      },
    },
  };
};

export const { hasheshandler } = hashes();