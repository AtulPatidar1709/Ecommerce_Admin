'use client';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CldUploadWidget } from 'next-cloudinary';
import { AiFillDelete } from 'react-icons/ai'; // Import delete icon
import Loader from './Loader/page';
import { ReactSortable } from 'react-sortablejs';

const ProductForm = ({
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  _id,
  Heading,
  imageIds,
  category: existingCategory, // Use default empty array if no images prop is provided
}) => {
  // Initialize state with props
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [category, setCategory] = useState(existingCategory || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [newimageIds, setNewImageIds] = useState(imageIds || []); // State to hold image IDs from Cloudinary
  const [uploading, setUploading] = useState(false); // State for loading indicator during image upload
  const [categories, setCategories] = useState([]);

  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      if (res.data.categories) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      toast.error('Error in finding data');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!title || !description || !price) {
      return toast.error('Please fill in all fields.');
    }

    if (price < 0) {
      return toast.error('Please enter a valid price.');
    }

    const data = { title, description, price, imageIds: newimageIds, category };

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

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);

    while (catInfo?.parent?.id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <div className="w-full p-4 flex flex-col items-center justify-center">
      <h1 className="font-bold text-2xl mb-4 text-center">{Heading}</h1>
      <form
        onSubmit={saveProduct}
        className="w-full max-w-2xl flex flex-col gap-4"
      >
        <div className="flex flex-col">
          <label htmlFor="product-name" className="font-semibold mb-2">
            Product Name
          </label>
          <input
            id="product-name"
            onChange={(e) => setTitle(e.target.value)}
            value={title || ''}
            type="text"
            placeholder="Product Name"
            className="border p-2 rounded-md w-full"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="category" className="font-semibold mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded-md w-full"
          >
            <option value="">Uncategorized</option>
            {categories.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
          {propertiesToFill.length > 0 &&
            propertiesToFill.map((p) => <div key={p._id}>{p.name}</div>)}
        </div>
        <div className="w-full border rounded-md bg-transparent flex flex-col justify-center items-center cursor-pointer mb-4">
          <CldUploadWidget
            uploadPreset="ptqeubac"
            onSuccess={handleUploadSuccess} // Handle successful upload
          >
            {({ open }) => (
              <button
                type="button" // Ensure it doesn't trigger form submission
                onClick={() => open()}
                className="p-4 text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
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
        <div className="flex flex-wrap gap-4 mb-4">
          {!newimageIds.length && <div>No Photos in this Product</div>}
          {newimageIds.map((id) => (
            <div key={id} className="relative">
              <Image
                className="object-cover rounded-md"
                src={`https://res.cloudinary.com/dryapqold/image/upload/${id}`}
                alt="Product"
                width={120}
                height={120}
              />
              {/* Delete Icon */}
              <button
                type="button"
                className="absolute top-0 right-0 p-1 bg-white rounded-full"
                onClick={() => handleDeleteImage(id)}
              >
                <AiFillDelete className="text-red-500 w-6 h-6" />
              </button>
            </div>
          ))}
          {uploading && (
            <div>
              <Loader />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="product-description" className="font-semibold mb-2">
            Product Description
          </label>
          <textarea
            id="product-description"
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
            className="border p-2 rounded-md w-full"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="product-price" className="font-semibold mb-2">
            Product Price
          </label>
          <input
            id="product-price"
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            value={price || ''}
            placeholder="Product Price"
            className="border p-2 rounded-md w-full"
          />
        </div>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 w-full">
          Save Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
