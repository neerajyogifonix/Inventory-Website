import { useState, useCallback, memo, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';
import { addProduct, updateProduct, deleteProduct, updateProductStock } from '../store/slices/productSlice';
import type { AppDispatch } from '../store/store';
import type { Product } from '../store/slices/productSlice';
import { debounce } from '../utils/debounce';
import { useFetchProducts } from '../hooks/useFetchProducts';

const ProductRow = memo(({ product, index, onEdit, onDelete, onStockUpdate }: any) => (
  <tr className={`table-row-enter ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition`}>
    <td className="px-4 py-3">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-12 w-12 object-cover rounded-md"
      />
    </td>
    <td className="px-4 py-3 text-sm font-medium text-gray-900 max-w-xs truncate">
      {product.title}
    </td>
    <td className="px-4 py-3 text-sm text-gray-600 capitalize">
      {product.category}
    </td>
    <td className="px-4 py-3 text-sm text-gray-600 capitalize">
      {product.brand || 'N/A'}
    </td>
    <td className="px-4 py-3 text-sm font-semibold text-green-600">
      ${product.price.toFixed(2)}
    </td>
    <td className="px-4 py-3 text-sm">
      <input
        type="number"
        min="0"
        defaultValue={product.stock || 0}
        onChange={(e) => onStockUpdate(product.id, parseInt(e.target.value))}
        className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </td>
    <td className="px-4 py-3 text-sm flex gap-2">
      <button
        onClick={() => onEdit(product)}
        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(product.id)}
        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
      >
        Delete
      </button>
    </td>
  </tr>
));

function Inventory() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, error } = useFetchProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    price: 0,
    category: '',
    thumbnail: '',
    brand: '',
    stock: 0,
  });

  
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const debouncedStockUpdate = useCallback(
    debounce((id: number, newStock: number) => {
      dispatch(updateProductStock({ id, stock: Math.max(0, newStock) }));
    }, 500),
    [dispatch]
  );

  const categories = useMemo(() => ['all', ...new Set(items.map(p => p.category))], [items]);

  const filteredProducts = useMemo(() => items.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  }), [items, searchTerm, filterCategory]);

 
  const handleAddProduct = useCallback(() => {
    if (formData.title && formData.price && formData.category) {
      const newProduct: Product = {
        id: Math.max(...items.map(p => p.id), 0) + 1,
        title: formData.title,
        price: formData.price,
        category: formData.category,
        thumbnail: formData.thumbnail || 'https://via.placeholder.com/150',
        brand: formData.brand || 'N/A',
        stock: formData.stock || 0,
      };
      dispatch(addProduct(newProduct));
      resetForm();
      setShowAddModal(false);
    } else {
      alert('Please fill in all required fields');
    }
  }, [formData, items, dispatch]);

  
  const handleEditProduct = useCallback(() => {
    if (editingProduct && formData.title && formData.price && formData.category) {
      const updatedProduct: Product = {
        ...editingProduct,
        title: formData.title,
        price: formData.price,
        category: formData.category,
        thumbnail: formData.thumbnail || editingProduct.thumbnail,
        brand: formData.brand || editingProduct.brand,
        stock: formData.stock || editingProduct.stock,
      };
      dispatch(updateProduct(updatedProduct));
      resetForm();
      setShowEditModal(false);
    }
  }, [editingProduct, formData, dispatch]);

  
  const handleDeleteProduct = useCallback((id: number) => {
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      buttons: {
        cancel: {
          text: 'Cancel',
          value: false,
          visible: true,
        },
        confirm: {
          text: 'Yes, delete it!',
          value: true,
          visible: true,
        },
      },
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteProduct(id));
        swal({
          title: 'Deleted!',
          text: 'Product has been deleted successfully.',
          icon: 'success',
          timer: 2000,
        });
      }
    });
  }, [dispatch]);

 
  const openEditModal = useCallback((product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      thumbnail: product.thumbnail,
      brand: product.brand,
      stock: product.stock,
    });
    setShowEditModal(true);
  }, []);

 
  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      price: 0,
      category: '',
      thumbnail: '',
      brand: '',
      stock: 0,
    });
    setEditingProduct(null);
  }, []);

  return (
    <div id="inventory" className="px-4 md:px-10 mb-12">
      
      <div className="flex items-center justify-between gap-3 cursor-pointer p-2 rounded-md flex-wrap">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h1 className="text-2xl font-bold tracking-wide flex-shrink-0">Inventory</h1>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Product
        </button>
      </div>

     
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex-1">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

   
      {status === 'loading' && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading products...</span>
        </div>
      )}

     
      {status === 'failed' && error && (
        <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p>Error loading products: {error}</p>
        </div>
      )}

 
      {status !== 'loading' && (
        <div className="mt-6 overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Thumbnail</th>
                <th className="px-4 py-3 text-left font-semibold">Title</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Brand</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Stock</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    index={index}
                    onEdit={openEditModal}
                    onDelete={handleDeleteProduct}
                    onStockUpdate={debouncedStockUpdate}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

     
      {status === 'succeeded' && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {items.length} products
        </div>
      )}


      
      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Product name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Electronics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  value={formData.thumbnail || ''}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Image URL"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

   
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Product name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Electronics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL</label>
                <input
                  type="text"
                  value={formData.thumbnail || ''}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Image URL"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  resetForm();
                  setShowEditModal(false);
                }}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProduct}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Inventory);