'use client';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CldUploadWidget } from 'next-cloudinary';
import { AiFillDelete } from 'react-icons/ai'; // Import delete icon

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

  const router = useRouter();

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
        router.push('/products');
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

  // Handle deleting an image from Cloudinary and state
  const handleDeleteImage = async (publicId) => {
    try {
      const response = await axios.post('/api/cloudinaryDelete', { publicId });

      if (response.status === 200) {
        // Handle successful response
        setNewImageIds((prev) => prev.filter((id) => id !== publicId));
        toast.success('Image deleted successfully.');
      } else {
        toast.error('Failed to delete image.');
      }
    } catch (error) {
      toast.error('Failed to delete image.');
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
        <div className="w-[100px] h-[100px] border rounded-sm bg-transparent flex flex-col justify-center items-center cursor-pointer">
          <CldUploadWidget
            uploadPreset="ptqeubac"
            onSuccess={handleUploadSuccess} // Handle successful upload
          >
            {({ open }) => (
              <button
                type="button" // Ensure it doesn't trigger form submission
                onClick={() => open()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
              </button>
            )}
          </CldUploadWidget>
        </div>
        <div className="flex flex-row gap-3">
          {!newimageIds.length && <div>No Photos in this Product</div>}
          {newimageIds.map((id) => (
            <div key={id} className="relative px-4">
              <Image
                className="object-contain"
                src={`https://res.cloudinary.com/dryapqold/image/upload/${id}`}
                alt="Product"
                width={120}
                height={96}
              />
              {/* Delete Icon */}
              <button
                type="button"
                className="absolute top-0 right-0 p-1"
                onClick={() => handleDeleteImage(id)}
              >
                {/* <AiFillDelete className="text-red-500" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 text-red-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
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
