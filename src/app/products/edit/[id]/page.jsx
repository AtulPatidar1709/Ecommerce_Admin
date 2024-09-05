'use client';
import ProductForm from '@/app/components/ProductForm';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Page = () => {
  const [productDetails, setProductDetails] = useState(null); // Initialize as null
  const { id } = useParams();

  // Fetch product details on component mount
  useEffect(() => {
    const getProductsDetails = async () => {
      try {
        const res = await axios.get(`/api/products?id=${id}`);
        if (res.status === 200) {
          setProductDetails(res.data.products);
        } else {
          toast.error('Error in getting product details');
        }
      } catch (error) {
        toast.error('Error in getting product details');
        console.error('Error fetching product details:', error); // Log error for debugging
      }
    };

    if (id) {
      getProductsDetails();
    }
  }, [id]); // Only depend on id

  // Render product details or loading state
  return (
    <div>
      {/* <h1 className="flex font-bold text-2xl">Edit Product Info</h1> */}
      {productDetails && (
        <ProductForm Heading="Edit Product Details" {...productDetails} />
      )}
    </div>
  );
};

export default Page;
