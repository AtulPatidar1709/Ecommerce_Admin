'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Page = () => {
  const [products, setProducts] = useState([]); // Initialize as an empty array

  // Function to fetch products
  const getProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      if (res.status === 200) {
        setProducts(res.data.products);
      } else {
        toast.error('Error in getting products');
      }
    } catch (error) {
      toast.error('Error in getting products');
      console.error('Error fetching products:', error); // Log error for debugging
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex justify-end">
        <Link
          className="bg-gray-200 font-semibold rounded-lg py-2 px-3 hover:bg-gray-300 transition-colors"
          href={'/products/new'}
        >
          Add new Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 p-2 text-left text-sm font-semibold text-gray-600">
                Product Name
              </th>
              <th className="border border-gray-200 p-2 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(products) &&
              products.map((product) => (
                <tr key={product._id}>
                  <td className="border border-gray-200 p-2 text-sm">
                    {product.title}
                  </td>
                  <td className="flex flex-col sm:flex-row gap-4 p-2 text-sm">
                    <Link
                      className="flex items-center text-blue-500 hover:text-blue-700"
                      href={`/products/edit/${product._id}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Edit
                    </Link>
                    <Link
                      className="flex items-center text-red-500 hover:text-red-700"
                      href={`/products/delete/${product._id}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 mr-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
