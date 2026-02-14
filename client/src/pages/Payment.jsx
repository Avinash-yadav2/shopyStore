import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard } from 'lucide-react';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal'); // Default method

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6">
     
      <CheckoutSteps step1 step2 step3 />

      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
          <CreditCard className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-slate-900">Payment Method</h1>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-700">Select Method</h2>
            
            {/*  PayPal */}
            <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors bg-slate-50">
              <input
                type="radio"
                className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="ml-3 font-bold text-slate-900 text-lg">PayPal or Credit Card</span>
            </label>

            <label className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors bg-slate-50">
              <input
                type="radio"
                className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                id="Stripe"
                name="paymentMethod"
                value="Stripe"
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="ml-3 font-bold text-slate-900 text-lg">Stripe</span>
            </label>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg hover:-translate-y-1 duration-300"
            >
              Continue to Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;