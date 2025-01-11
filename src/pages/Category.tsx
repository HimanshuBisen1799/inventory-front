<<<<<<< HEAD
=======
// import React, { useState, useEffect } from 'react';
// import { Plus, MoreVertical } from 'lucide-react';
// import {
//   getAllCategories,
//   createCategory,
//   updateCategory,
//   deleteCategory,
//   Category,
// } from '../services/Category.service';

// export default function Categories() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newCategory, setNewCategory] = useState<Category>({ name: '', description: '' });
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const data = await getAllCategories();
//         setCategories(data);
//       } catch (error) {
//         console.error('Failed to fetch categories:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Handle adding or editing category
//   const handleSaveCategory = async () => {
//     try {
//       if (editingCategory) {
//         await updateCategory(editingCategory._id!, newCategory);
//       } else {
//         await createCategory(newCategory);
//       }
//       const updatedCategories = await getAllCategories();
//       setCategories(updatedCategories);
//       setIsModalOpen(false);
//       setNewCategory({ name: '', description: '' });
//       setEditingCategory(null);
//     } catch (error) {
//       console.error('Failed to save category:', error);
//     }
//   };

//   // Handle deleting category
//   const handleDeleteCategory = async (id: string) => {
//     try {
//       await deleteCategory(id);
//       setCategories(categories.filter((category) => category._id !== id));
//     } catch (error) {
//       console.error('Failed to delete category:', error);
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
//         <button
//           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           onClick={() => setIsModalOpen(true)}
//         >
//           <Plus className="h-5 w-5 mr-2" />
//           Add Category
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <div className="bg-white rounded-lg shadow-sm">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   S No.
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {categories.map((category, index) => (
//                 <tr key={category._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{index + 1}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{category.name}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">{category.description}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-center ">
//                     <div className="relative inline-block text-right">
//                       <button
//                         className="text-gray-500 hover:text-gray-700 "
//                         onClick={() =>
//                           setActiveDropdown(activeDropdown === category._id ? null : category._id)
//                         }
//                       >
//                         <MoreVertical className="items-center h-5 w-5 " />
//                       </button>
//                       {activeDropdown === category._id && (
//                         <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
//                           <button
//                             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                             onClick={() => {
//                               setEditingCategory(category);
//                               setNewCategory(category);
//                               setIsModalOpen(true);
//                               setActiveDropdown(null); // Close dropdown
//                             }}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full text-left"
//                             onClick={() => {
//                               handleDeleteCategory(category._id!);
//                               setActiveDropdown(null); // Close dropdown
//                             }}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4">
//               {editingCategory ? 'Edit Category' : 'Add Category'}
//             </h2>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSaveCategory();
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   value={newCategory.name}
//                   onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Description</label>
//                 <textarea
//                   value={newCategory.description}
//                   onChange={(e) =>
//                     setNewCategory({ ...newCategory, description: e.target.value })
//                   }
//                   className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//                   required
//                 ></textarea>
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
//                   onClick={() => {
//                     setIsModalOpen(false);
//                     setNewCategory({ name: '', description: '' });
//                     setEditingCategory(null);
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




>>>>>>> 4e7e97cf129e21275323510bb3d311f25b4c22a2
import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { createCategory, getAllCategories, updateCategory, deleteCategory, Category } from '../services/Category.service';

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Category>({
    name: '',
    description: '',
    gstnumber: 0,
  });
  const [editing, setEditing] = useState<boolean>(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing && currentCategoryId) {
      await updateCategory(currentCategoryId, formData);
    } else {
      await createCategory(formData);
    }
    setFormData({
      name: '',
      description: '',
      gstnumber: '',
    });
    setEditing(false);
    fetchCategories();
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description,
      gstnumber: category.gstnumber,
    });
    setEditing(true);
    setCurrentCategoryId(category._id);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    fetchCategories();
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Category Management
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="GST % "
              variant="outlined"
              fullWidth
              name="gstnumber"
              value={formData.gstnumber}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          {editing ? 'Update Category' : 'Create Category'}
        </Button>
      </form>

<<<<<<< HEAD
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>GST Number</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.gstnumber}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(category)}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ marginLeft: 1 }}
                    onClick={() => handleDelete(category._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
=======
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category, index) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{index + 1}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap ">
                    <div className=" relative inline-block">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === category._id ? null : category._id)
                        }
                      >
                        <MoreVertical className="h-5 w-5 ml-5"  />
                      </button>
                      {activeDropdown === category._id && (
                        <div className="absolute right-0 mt-1 bg-white shadow-md rounded-md z-10 w-32">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setEditingCategory(category);
                              setNewCategory(category);
                              setIsModalOpen(true);
                              setActiveDropdown(null); // Close dropdown
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                            onClick={() => {
                              handleDeleteCategory(category._id!);
                              setActiveDropdown(null); // Close dropdown
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveCategory();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, description: e.target.value })
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewCategory({ name: '', description: '' });
                    setEditingCategory(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
>>>>>>> 4e7e97cf129e21275323510bb3d311f25b4c22a2
  );
};

export default CategoryPage;
