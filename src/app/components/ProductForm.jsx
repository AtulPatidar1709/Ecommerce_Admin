'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const ProductForm = ({
  title: existingTitle = '',
  description: existingDescription = '',
  price: existingPrice = '',
  _id,
  Heading,
  images,
}) => {
  // Initialize state with props
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');

  const route = useRouter();

  const saveProduct = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!title || !description || !price) {
      return toast.error('Please fill in all fields.');
    }

    if (price < 0) {
      return toast.error('Please enter a positive price.');
    }
    const data = { title, description, price };

    try {
      let res;
      if (_id) {
        //Update Product
        res = await axios.put('/api/products', { ...data, _id });
      } else {
        res = await axios.post('/api/products', data);
      }

      if (res) {
        toast.success('Product Saved Successfully');
        setDescription('');
        setTitle('');
        setPrice('');
        route.push('/products');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const uploadImages = async (ev) => {
    const files = ev?.target?.files;
    try {
      if (files?.length > 0) {
        const data = new FormData();
        for (const file of files) {
          data.append('file', file);
        }
        const res = await axios.post('/api/uploaddata', data);
        if (res.data) {
          toast.success('Uploaded Successfully.');
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error in Upload Images');
    }
  };

  return (
    <div className="w-full absolute flex flex-col items-start justify-start">
      <h1 className="font-bold text-2xl">{Heading}</h1>
      <form onSubmit={saveProduct} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            onChange={(e) => setTitle(e.target.value)}
            value={title || ''}
            type="text"
            className=""
            placeholder="Product Name"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="product-photos">Product Photos</label>
          <div className="flex relative flex-row gap-1">
            <label className="w-24 h-24 cursor-pointer border text-center flex flex-col items-center justify-center text-sm gap-1 bg-gray-200 text-gray-500 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
              <input
                onChange={uploadImages}
                className="hidden"
                type="file"
                multiple
                name="productPhotos"
              />
            </label>
          </div>
          <div>{!images?.length && <div>No Photos in this Product</div>}</div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="product-description">Product Description</label>
          <textarea
            id="product-description"
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
            className=""
            placeholder="Product Description"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="product-price">Product Price</label>
          <input
            id="product-price"
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            value={price || ''}
            className=""
            placeholder="Product Price"
          />
        </div>
        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
