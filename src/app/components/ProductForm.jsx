'use client';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CldUploadWidget } from 'next-cloudinary';

const ProductForm = ({
  title: existingTitle = '',
  description: existingDescription = '',
  price: existingPrice = '',
  _id,
  Heading,
  imageIds, // Use default empty array if no images prop is provided
}) => {
  // Initialize state with props
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [newimageIds, setNewImageIds] = useState(imageIds || []); // State to hold image IDs from Cloudinary
  const [uploading, setUploading] = useState(false); // State for loading indicator during image upload

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

    const data = { title, description, price, imageIds: newimageIds };

    try {
      let res;
      if (_id) {
        // Update Product
        res = await axios.put('/api/products', { ...data, _id });
      } else {
        // Create Product
        res = await axios.post('/api/products', data);
      }

      if (res) {
        toast.success('Product Saved Successfully');
        setDescription('');
        setTitle('');
        setPrice('');
        setNewImageIds([]); // Clear images after saving
        route.push('/products');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  // Handle successful upload
  const handleUploadSuccess = (result) => {
    if (result?.info?.public_id) {
      setNewImageIds((prev) => [...prev, result.info.public_id]); // Update state with new image ID
      toast.success('Image uploaded successfully.');
    } else {
      toast.error('Error uploading image.');
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
            placeholder="Product Name"
          />
        </div>
        <div>
          <CldUploadWidget
            uploadPreset="ptqeubac"
            onSuccess={handleUploadSuccess} // Handle successful upload
          >
            {({ open }) => (
              <button
                type="button" // Ensure it doesn't trigger form submission
                onClick={() => open()}
              >
                Upload an Image
              </button>
            )}
          </CldUploadWidget>
        </div>
        <div className="flex flex-row gap-3">
          {!newimageIds.length && <div>No Photos in this Product</div>}
          {newimageIds.map((id) => (
            <Image
              className="object-contain"
              key={id}
              src={`https://res.cloudinary.com/dryapqold/image/upload/${id}`}
              alt="Product"
              width={120}
              height={96}
            />
          ))}
          {uploading && <div>Uploading...</div>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="product-description">Product Description</label>
          <textarea
            id="product-description"
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
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
            placeholder="Product Price"
          />
        </div>
        <button type="submit">Save Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
