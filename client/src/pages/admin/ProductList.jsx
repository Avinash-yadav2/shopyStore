import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';

const ProductList = () => {
  
  const { data: products, isLoading, error, refetch } = useGetProductsQuery({ keyword: '', category: '' });

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new sample product?')) {
      try {
        await createProduct();
        refetch(); 
        alert('Sample Product Created Successfully!');
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        refetch(); 
        alert('Product Deleted Successfully!');
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-slate-100 gap-4">
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Package className="text-indigo-600 w-8 h-8" /> Manage Products
          </h2>
          <button
            className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg flex items-center gap-2 disabled:bg-slate-400"
            onClick={createProductHandler}
            disabled={loadingCreate}
          >
            <Plus className="w-5 h-5" />
            {loadingCreate ? 'Creating...' : 'Create Product'}
          </button>
        </div>

        {loadingDelete && <div className="text-center text-red-500 mb-4 font-bold">Deleting Product...</div>}

        {/* Loading / Error / Table Section */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold text-center border border-red-100">
            {error?.data?.message || error.error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white rounded-t-xl">
                  <th className="p-4 font-bold rounded-tl-xl">ID</th>
                  <th className="p-4 font-bold">NAME</th>
                  <th className="p-4 font-bold">PRICE</th>
                  <th className="p-4 font-bold">CATEGORY</th>
                  <th className="p-4 font-bold">BRAND</th>
                  <th className="p-4 font-bold rounded-tr-xl text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-400">{product._id.substring(0, 10)}...</td>
                    <td className="p-4 text-sm font-bold text-slate-800">{product.name}</td>
                    <td className="p-4 font-bold text-indigo-600">${product.price}</td>
                    
                    
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
                        {product.category}
                      </span>
                    </td>
                    
                    <td className="p-4 text-sm text-slate-600 font-medium">{product.brand}</td>
                    <td className="p-4 text-center flex justify-center gap-3">
                      
                      {/* Edit Button */}
                      <Link 
                        to={`/admin/product/${product._id}/edit`} 
                        className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors shadow-sm"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      
                      {/* Delete Button */}
                      <button 
                        onClick={() => deleteHandler(product._id)}
                        className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;