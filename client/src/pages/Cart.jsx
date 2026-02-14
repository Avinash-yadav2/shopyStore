import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag } from 'lucide-react';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="py-4">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 border-l-4 border-indigo-500 pl-4 flex items-center gap-3">
        <ShoppingBag className="w-8 h-8 text-indigo-500" /> Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-indigo-50 p-8 rounded-2xl text-center border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-900 mb-4">Your cart is empty</h2>
          <Link to="/" className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 transition-colors hover:shadow-lg hover:-translate-y-1">
            Go Back & Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Image & Title */}
                <div className="flex items-center gap-4 w-full sm:w-2/5 mb-4 sm:mb-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded-lg bg-slate-50 p-2" />
                  <Link to={`/product/${item._id}`} className="text-lg font-bold text-slate-800 hover:text-indigo-600 line-clamp-2">
                    {item.name}
                  </Link>
                </div>

                {/* Price */}
                <div className="text-xl font-extrabold text-slate-900 w-full sm:w-1/5 text-center sm:text-left mb-4 sm:mb-0">
                  ${item.price}
                </div>

                {/* Quantity Dropdown */}
                <div className="w-full sm:w-1/5 mb-4 sm:mb-0 flex justify-center sm:justify-start">
                  <select 
                    value={item.qty} 
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-bold outline-none cursor-pointer"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delete Button */}
                <div className="w-full sm:w-auto flex justify-end">
                  <button 
                    onClick={() => removeFromCartHandler(item._id)}
                    className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-colors duration-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          
          <div className="lg:col-span-4">
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl sticky top-28 border border-slate-800">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-700">Order Summary</h2>
              
              <div className="flex justify-between items-center mb-4 text-slate-300">
                <span className="text-lg">Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
              </div>
              
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-700">
                <span className="text-slate-400">Total Price</span>
                <span className="text-3xl font-extrabold text-amber-400">
                  ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                </span>
              </div>

              <button 
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-colors shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center gap-2"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;