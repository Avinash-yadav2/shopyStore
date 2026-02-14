import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Package, ArrowLeft, Upload, Save } from 'lucide-react';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

// Predefined Categories
const CATEGORY_OPTIONS = ['Electronics', 'Fashion', 'Grocery', 'Beauty', 'Sports', 'Toys'];

const ProductEdit = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      
      setName(product.name || '');
      setPrice(product.price || 0);
      setImage(product.image || '');
      setBrand(product.brand || '');
      setCategory(product.category || '');
      setCountInStock(product.countInStock || 0);
      setDescription(product.description || '');
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId, name, price, image, brand, category, countInStock, description,
      }).unwrap();
      alert('Product Updated Successfully');
      navigate('/admin/productlist');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImage(res.image);
      alert(res.message);
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

 
  const displayCategories = [...new Set([...CATEGORY_OPTIONS, category])].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <Link to="/admin/productlist" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5" /> Go Back
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3 pb-4 border-b border-slate-100">
          <Package className="text-indigo-600 w-8 h-8" /> Edit Product
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold">{error?.data?.message || error.error}</div>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
                <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                <input type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Brand</label>
                <input type="text" placeholder="Enter brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer" 
                  required
                >
                  <option value="" disabled>Select a Category</option>
                  {displayCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Count In Stock</label>
                <input type="number" placeholder="Enter stock" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Product Image</label>
                <input type="text" placeholder="Enter image URL" value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mb-2 bg-slate-50" readOnly />
                <div className="relative">
                  <input type="file" onChange={uploadFileHandler} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-3 rounded-xl hover:bg-indigo-100 transition-colors cursor-pointer">
                    <Upload className="w-5 h-5" />
                    <span className="font-bold">{loadingUpload ? 'Uploading...' : 'Choose File'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea rows="4" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" required></textarea>
            </div>

            <button type="submit" disabled={loadingUpdate} className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg flex justify-center items-center gap-2 disabled:bg-slate-400">
              <Save className="w-5 h-5" />
              {loadingUpdate ? 'Updating...' : 'Update Product'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEdit;