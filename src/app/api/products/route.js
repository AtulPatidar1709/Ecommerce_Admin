import { dbConnect } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import Product from '@/models/products';

// Ensure database connection
await dbConnect();

export async function POST(req) {
  const { title, description, price, imageIds } = await req.json();

  try {
    const productDoc = await Product.create({
      title,
      description,
      price,
      imageIds, // Add imageIds to the product
    });

    return NextResponse.json(
      {
        message: 'Product Created',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to create product', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  // Retrieve the ID from query parameters
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
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
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to retrieve products', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const { title, description, price, _id, imageIds } = await req.json();

  try {
    const productDoc = await Product.updateOne(
      { _id },
      {
        title,
        description,
        price,
        imageIds, // Add imageIds to the update
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Product Updated',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to update product', error: error.message },
      { status: 500 }
    );
  }
}

// Implementing DELETE method
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { message: 'Product ID is required' },
      { status: 400 }
    );
  }

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Product Deleted Successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Error deleting product', error: error.message },
      { status: 500 }
    );
  }
}
