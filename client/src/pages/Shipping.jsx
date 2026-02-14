import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin } from 'lucide-react';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    // Redux save 
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    
    navigate('/payment');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
      <CheckoutSteps step1 step2 />

      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
          <MapPin className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-slate-900">Shipping Address</h1>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Street Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, Apt 4B"
              className="w-full px-5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                className="w-full px-5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Postal Code</label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="10001"
                className="w-full px-5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
            <input
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
              className="w-full px-5 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg hover:-translate-y-1 duration-300 flex justify-center items-center gap-2"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shipping;