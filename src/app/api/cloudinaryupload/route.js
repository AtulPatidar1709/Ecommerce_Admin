import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        upload_preset: uploadPreset,
      },
      apiSecret
    );

    return NextResponse.json({
      signature,
      apiKey,
      timestamp,
    });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    return NextResponse.json(
      { error: 'Error generating signature' },
      { status: 500 }
    );
  }
}
