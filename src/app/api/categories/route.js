import { dbConnect } from '@/lib/dbConnect';
import Category from '@/models/categories';
import { NextResponse } from 'next/server';
await dbConnect();

export async function POST(req) {
  const { name, parentCategory, properties } = await req.json();

  const categoryDoc = await Category.create({
    name,
    parent: parentCategory || undefined,
    properties,
  });

  return NextResponse.json(
    {
      categoryDoc,
      message: 'Category created sussessfully',
    },
    { status: 201 }
  );
}

export async function PUT(req) {
  const { name, parentCategory, properties, _id } = await req.json();

  const categoryDoc = await Category.updateOne(
    { _id },
    {
      name,
      parent: parentCategory || undefined,
      properties,
    }
  );

  return NextResponse.json(
    {
      categoryDoc,
      message: 'Category created sussessfully',
    },
    { status: 200 }
  );
}

export async function GET(req) {
  const categories = await Category.find({}).populate('parent');

  return NextResponse.json(
    {
      categories,
      message: 'Category fetch sussessfully',
    },
    { status: 200 }
  );
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const _id = searchParams.get('_id');

  await Category.deleteOne({ _id });

  return NextResponse.json(
    {
      message: 'Category deleted sussessfully',
    },
    { status: 200 }
  );
}
