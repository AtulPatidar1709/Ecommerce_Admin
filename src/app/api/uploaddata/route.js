import { NextResponse } from 'next/server';
import multiparty from 'multiparty';

export async function POST(req) {
  const form = new multiparty.Form();

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return resolve(
          NextResponse.json({ error: 'Error parsing form' }, { status: 500 })
        );
      }

      if (files && files.length > 0) {
        console.log('Files uploaded:', files.file);
      } else {
        console.log('No files uploaded.');
      }
      resolve(NextResponse.json({ message: 'Files uploaded successfully' }));
    });
  });
}

export const config = {
  api: { bodyParser: false },
};
