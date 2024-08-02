import { NextResponse } from "next/server";
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

const upload = () => {
  return {
    uploadhandler: {
      GET: async (request: Request, data: any) => {
        
        // return NextResponse.json(blockUser, { status: 200 });
      },
      POST: async (request: Request) => {
        const body = await request.json();
        const { image } = body;

        const results = await cloudinary.uploader.upload(image);
        return NextResponse.json(results, { status: 200 });
      },
    },
  };
};

export const { uploadhandler } = upload();