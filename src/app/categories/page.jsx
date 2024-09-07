'use client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { withSwal } from 'react-sweetalert2';

const Page = ({ swal }) => {
  const [editedCategory, setEditedCategory] = useState('');
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get('/api/categories');
      if (res && res.data.categories) {
        setCategories(res.data.categories);
      } else {
        toast.error('Failed to fetch data from database');
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveCategory = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name,
        parentCategory: parentCategory || undefined, // Ensure no empty parentCategory is sent
      };

      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put('/api/categories', data);
      } else {
        await axios.post('/api/categories', data);
      }

      toast.success('Category Saved Successfully');
      setName('');
      setParentCategory(''); // Reset to an empty string
      setEditedCategory(''); // Reset the edited category
      fetchData();
    } catch (error) {
      toast.error('Failed to add Category');
    }
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id || ''); // Handle empty parent category
  };

  const deleteCategory = (category) => {
    swal
      .fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        reverseButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#d55',
        confirmButtonText: 'Yes, Delete',
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          // Call the delete API here or any further action
          const { _id } = category;
          await axios
            .delete(`/api/categories?_id=` + _id)
            .then(() => {
              toast.success('Category deleted successfully');
              fetchData();
            })
            .catch((error) => {
              toast.error('Failed to delete category');
            });
        }
      })
      .catch((error) => {
        // when promise rejected...
        toast.error('An error occurred');
      });
  };

  return (
    <>
      <h1>Categories</h1>
      <form onSubmit={saveCategory} className="flex flex-col pt-4 w-1/3">
        <label htmlFor="product-name">
          {editedCategory
            ? `Edit Category ${editedCategory.name}`
            : 'Category Name'}
        </label>
        <div className="flex flex-row gap-4">
          <input
            className="mb-0"
            id="product-name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Category Name"
          />
          <select
            className="mb-0"
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No Parent Category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
          <button type="submit" className="btn-primary px-4">
            Save
          </button>
        </div>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category</td>
            <td>Edit/Delete Category</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td className="flex gap-4 p-2">
                  <button
                    onClick={() => editCategory(category)}
                    className="flex items-center text-blue-500 hover:text-blue-700"
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
                  </button>
                  <button
                    className="flex items-center text-red-500 hover:text-red-700"
                    onClick={() => deleteCategory(category)}
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
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default withSwal(({ swal }, ref) => <Page swal={swal} />);
