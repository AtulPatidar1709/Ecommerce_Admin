"use client";
import axios from "axios";
import { useState } from "react";

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const createProduct = async (e) => {
    e.preventDefault();
    const data = { title, description, price };
    console.log(data);
    const res = await axios.post("api/products", data);
  };

  return (
    <div className="w-full min-h-screen flex items-start justify-start">
      <form onSubmit={createProduct} className="flex flex-col gap-4">
        <h1 className="flex font-bold text-2xl">New Product</h1>
        <div className="flex flex-col">
          <label htmlFor="">Product Name</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            className=""
            placeholder="Product Name"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Product Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            className=""
            placeholder="Product Description"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Product Price</label>
          <input
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className=""
            placeholder="Product Price"
          />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default Page;
