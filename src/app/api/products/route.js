import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import Product from '@/models/products';

await dbConnect();

export async function POST(req) {
  const { title, description, price } = await req.json();

  const productDoc = await Product.create({
    title,
    description,
    price,
  });

  return NextResponse.json(
    {
      message: 'Product Created',
    },
    { status: 201 }
  );
}

export async function GET(req) {
  // Retrieve the ID from query parameters
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  let products;

  if (id) {
    products = await Product.findOne({ _id: id });
  } else {
    products = await Product.find({});
  }

  return NextResponse.json(
    {
      products,
      message: 'Products Retrieved',
    },
    { status: 200 }
  );
}

export async function PUT(req) {
  const { title, description, price, _id } = await req.json();

  const productDoc = await Product.updateOne(
    { _id },
    {
      title,
      description,
      price,
    }
  );

  return NextResponse.json(
    {
      success: true,
      message: 'Product Updated',
    },
    { status: 200 }
  );
}
