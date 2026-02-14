import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Clock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = (e) => {
    e.preventDefault(); 
    dispatch(addToCart({ ...product, qty: 1 }));
    navigate('/cart');
  };

  const discountPercent = product._id ? (product._id.charCodeAt(0) % 35) + 10 : 15; 
  const originalPrice = (product.price * (1 + discountPercent / 100)).toFixed(2);

  const imageUrl = product.image && product.image.startsWith('/uploads')
    ? `${import.meta.env.VITE_API_URL}${product.image}`
    : product.image;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group flex flex-col h-full relative">
      
      <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-extrabold px-2 py-1 rounded-md z-10 shadow-sm">
        🔥hot deal
      </div>

      <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-slate-50 pt-6 pb-4">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-contain transform group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        
        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-2">
          <Clock className="w-3 h-3" /> 15 - 20 Mins
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-slate-800 font-bold text-base line-clamp-2 hover:text-indigo-600 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-slate-500 text-xs font-medium mb-3">{product.brand}</p>

        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-xs font-bold text-amber-600 border border-amber-100">
            {product.rating} <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-slate-400 text-xs">({product.numReviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-xs line-through block">${originalPrice}</span>
            <span className="text-xl font-extrabold text-slate-900">${product.price}</span>
          </div>

          <button 
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            className={`flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-all ${
              product.countInStock > 0 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-110' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Product;