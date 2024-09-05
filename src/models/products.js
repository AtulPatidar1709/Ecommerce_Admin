import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a Product Name"],
    },
    description: {
      type: String,
      required: [true, "Please provide a Description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a Price"],
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
