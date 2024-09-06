import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary'; // Import the configured Cloudinary instance

export async function POST(req) {
  const { publicId } = await req.json(); // Retrieve the publicId from the request body

  console.log('Received publicId:', publicId);

  if (!publicId) {
    return NextResponse.json(
      { error: 'Public ID is required.' },
      { status: 400 }
    );
  }

  try {
    // Use Cloudinary SDK to delete the image
    const response = await cloudinary.uploader.destroy(publicId, {
      invalidate: true, // Optional: Forces the invalidation of the cached image
    });

    // Check the result of the deletion operation
    if (response.result === 'ok') {
      return NextResponse.json(
        { message: 'Image deleted successfully.' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error deleting image:', error.message);
    return NextResponse.json(
      { error: 'Failed to delete image.' },
      { status: 500 }
    );
  }
}
