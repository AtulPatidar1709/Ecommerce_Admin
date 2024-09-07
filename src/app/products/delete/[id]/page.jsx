'use client';
import Loader from '@/app/components/Loader/page';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Page = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  const goBack = () => {
    router.push('/products');
  };

  const deleteProduct = async () => {
    if (!id) return;

    try {
      // Delete images from Cloudinary first
      if (product?.imageIds?.length > 0) {
        await Promise.all(
          product.imageIds.map(async (publicId) => {
            await axios.post('/api/cloudinaryDelete', { publicId });
          })
        );
      }

      // Delete product from database
      const res = await axios.delete(`/api/products?id=${id}`);
      if (res.status === 200) {
        toast.success('Product deleted successfully');
        router.push('/products');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Something went wrong while deleting the product');
      console.error('Error deleting product:', error); // Log error for debugging
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get('/api/products?id=' + id);
        if (res.status === 200) {
          setProduct(res.data.products);
        }
      } catch (error) {
        toast.error('Something went wrong while fetching the product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProduct();
    }
  }, [id]);

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="border rounded-lg shadow relative max-w-sm p-6 text-center">
        <svg
          className="w-20 h-20 text-red-600 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
          Are you sure you want to delete{' '}
          {product.title ? product.title : 'this item'}?
        </h3>
        <button
          onClick={deleteProduct}
          className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
        >
          Yes, sure
        </button>
        <button
          onClick={goBack}
          className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
        >
          No, cancel
        </button>
      </div>
    </div>
  );
};

export default Page;
