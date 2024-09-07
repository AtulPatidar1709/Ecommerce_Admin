import { dbConnect } from '@/lib/dbConnect';
import Category from '@/models/categories';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, parentCategory } = await req.json();

  await dbConnect();

  const categoryDoc = await Category.create({ name, parent: parentCategory });

  return NextResponse.json(
    {
      categoryDoc,
      message: 'Category created sussessfully',
    },
    { status: 201 }
  );
}

export async function PUT(req) {
  const { name, parentCategory, _id } = await req.json();

  await dbConnect();

  const categoryDoc = await Category.updateOne(
    { _id },
    { name, parent: parentCategory }
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
  await dbConnect();

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

  await dbConnect();

  await Category.deleteOne({ _id });

  return NextResponse.json(
    {
      message: 'Category deleted sussessfully',
    },
    { status: 200 }
  );
}
