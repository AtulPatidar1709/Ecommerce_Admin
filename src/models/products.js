import mongoose from 'mongoose';
import { type } from 'os';

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a Product Name'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a Description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a Price'],
    },
    imageIds: {
      type: [String], // Array of strings to store Cloudinary image IDs
      default: [], // Default is an empty array
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
    properties: { type: Object },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
