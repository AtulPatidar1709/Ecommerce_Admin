'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { withSwal } from 'react-sweetalert2';

const Page = ({ swal }) => {
  const [editedCategory, setEditedCategory] = useState('');
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

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
        properties: properties.map((p) => ({
          name: p.name,
          values: p.values.split(','),
        })),
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
      setProperties([]); // Reset properties
      fetchData();
    } catch (error) {
      toast.error('Failed to add Category');
    }
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id || ''); // Handle empty parent category
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(','),
      })) || []
    ); // Set properties if editing
  };

  const createProperties = () => {
    setProperties((prev) => [
      ...prev,
      {
        name: '',
        values: '',
      },
    ]);
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
        toast.error('An error occurred');
      });
  };

  const handlePropertyNameChange = (index, property, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };

  const handlePropertyValuesChange = (index, property, newValues) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };

  const removeProperty = (indexToRemove) => {
    setProperties((prev) => {
      return [...prev].filter((p, index) => {
        return index !== indexToRemove;
      });
    });
  };

  return (
    <div className="absolute p-4 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <form
        onSubmit={saveCategory}
        className="flex flex-col w-full max-w-xl gap-4"
      >
        <label htmlFor="product-name" className="font-medium">
          {editedCategory
            ? `Edit Category ${editedCategory.name}`
            : 'Category Name'}
        </label>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row md:flex-col gap-3 w-full">
            <input
              id="product-name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Category Name"
              className="input-field px-3 py-2 border border-gray-300 rounded-md flex-grow"
            />
            <select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              className="input-field px-3 py-2 border border-gray-300 rounded-md flex-grow"
            >
              <option value="">No Parent Category</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col mb-2 items-start gap-2">
            <label className="block">Properties</label>
            <button
              type="button"
              onClick={createProperties}
              className="btn-primary text-sm py-1 px-2"
            >
              Add New Property
            </button>
            {properties.length > 0 &&
              properties.map((property, index) => (
                <div key={index} className="flex gap-1">
                  <input
                    type="text"
                    placeholder="Property name"
                    value={property.name}
                    onChange={(e) =>
                      handlePropertyNameChange(index, property, e.target.value)
                    }
                    className="input-field px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Values, comma separated"
                    value={property.values}
                    onChange={(e) =>
                      handlePropertyValuesChange(
                        index,
                        property,
                        e.target.value
                      )
                    }
                    className="input-field px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      removeProperty(index);
                    }}
                    className="btn-primary px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
          <div className="flex flex-row">
            {editedCategory && (
              <button
                onClick={() => {
                  setEditedCategory(null);
                  setName('');
                  setParentCategory('');
                  setProperties([]);
                }}
                type="button"
                className="button-custom rounded-md"
              >
                Cancel
              </button>
            )}
            <button type="submit" className="button-custom rounded-md">
              Save
            </button>
          </div>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-6 w-full border-collapse">
          <thead>
            <tr className="border-b-2">
              <th className="text-left p-2">Category Name</th>
              <th className="text-left p-2">Parent Category</th>
              <th className="text-left p-2">Edit/Delete Category</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id} className="border-b">
                  <td className="p-2">{category.name}</td>
                  <td className="p-2">{category?.parent?.name}</td>
                  <td className="p-2 flex gap-4">
                    <button
                      onClick={() => editCategory(category)}
                      className="flex items-center text-blue-500 hover:text-blue-700 px-2 py-1 border border-blue-500 rounded-md"
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
                      className="flex items-center text-red-500 hover:text-red-700 px-2 py-1 border border-red-500 rounded-md"
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
      )}
    </div>
  );
};

export default withSwal(({ swal }, ref) => <Page swal={swal} />);
