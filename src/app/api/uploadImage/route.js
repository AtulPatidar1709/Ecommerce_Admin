import { appendFile } from 'fs';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false, // Disable body parsing by Next.js
  },
};

export async function POST(request) {
  try {
    // Parse form data from the request
    const formDataUser = await request.formData();
    const files = formDataUser.getAll('file');

    console.log(formDataUser);

    if (!files.length) {
      return NextResponse.json(
        {
          error: 'At least one file is required.',
        },
        {
          status: 400,
        }
      );
    }

    // consoleLog file details
    files.forEach((file, index) => {
      console.log(`File ${index + 1}:`, {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      });
    });

    return NextResponse.json(
      {
        formDataUser,
        message: 'Files uploaded successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json(
      {
        error: 'Error uploading files',
      },
      {
        status: 500,
      }
    );
  }
}
