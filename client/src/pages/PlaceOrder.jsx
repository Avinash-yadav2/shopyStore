import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, MapPin, CreditCard, Package } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      // Backend ko API call
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      
      dispatch(clearCartItems());
      
      navigate(`/order/${res._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        <div className="lg:col-span-8 space-y-8">
          
          {/* Shipping Summary */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2 pb-4 border-b border-slate-100">
              <MapPin className="text-indigo-600 w-6 h-6" /> Shipping Info
            </h2>
            <p className="text-slate-700 text-lg">
              <span className="font-bold">Address: </span>
              {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
              {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
            </p>
          </div>

          {/* Payment Summary */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2 pb-4 border-b border-slate-100">
              <CreditCard className="text-indigo-600 w-6 h-6" /> Payment Method
            </h2>
            <p className="text-slate-700 text-lg">
              <span className="font-bold">Method: </span>
              {cart.paymentMethod}
            </p>
          </div>

          {/* Cart Items Summary */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2 pb-4 border-b border-slate-100">
              <Package className="text-indigo-600 w-6 h-6" /> Order Items
            </h2>
            {cart.cartItems.length === 0 ? (
              <p className="text-red-500 font-bold">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-lg bg-slate-50 p-1" />
                    <div className="flex-1">
                      <Link to={`/product/${item.product}`} className="font-bold text-slate-800 hover:text-indigo-600 line-clamp-1">
                        {item.name}
                      </Link>
                    </div>
                    <div className="font-bold text-slate-700">
                      {item.qty} x ${item.price} = <span className="text-indigo-600">${(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl sticky top-28">
            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-700">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-slate-300">
                <span>Items:</span>
                <span className="font-bold text-white">${cart.itemsPrice}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Shipping:</span>
                <span className="font-bold text-white">${cart.shippingPrice}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Tax:</span>
                <span className="font-bold text-white">${cart.taxPrice}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8 pb-4 border-t border-slate-700 pt-4">
              <span className="text-lg text-slate-300">Total:</span>
              <span className="text-3xl font-extrabold text-amber-400">
                ${cart.totalPrice}
              </span>
            </div>

            {/* Error Message Space */}
            {error && (
              <div className="mb-4 bg-red-500/10 text-red-500 p-3 rounded-xl border border-red-500/20 text-sm font-bold text-center">
                {error?.data?.message || error.error}
              </div>
            )}

            <button
              type="button"
             disabled={cart.cartItems.length === 0 || isLoading}              onClick={placeOrderHandler}
              className="w-full bg-indigo-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> Place Order
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceOrder;