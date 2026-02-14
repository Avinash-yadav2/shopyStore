import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 mb-10 flex-wrap">
      {/* Sign In */}
      <div className="flex items-center gap-2">
        {step1 ? (
          <Link to="/login" className="flex items-center gap-1 text-indigo-600 font-bold">
            <CheckCircle2 className="w-5 h-5" /> Sign In
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-slate-400 font-medium">Sign In</span>
        )}
      </div>

      <div className={`w-8 sm:w-16 h-1 rounded-full ${step2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>

      {/* Shipping */}
      <div className="flex items-center gap-2">
        {step2 ? (
          <Link to="/shipping" className="flex items-center gap-1 text-indigo-600 font-bold">
            <CheckCircle2 className="w-5 h-5" /> Shipping
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-slate-400 font-medium">Shipping</span>
        )}
      </div>

      <div className={`w-8 sm:w-16 h-1 rounded-full ${step3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>

      {/* Payment */}
      <div className="flex items-center gap-2">
        {step3 ? (
          <Link to="/payment" className="flex items-center gap-1 text-indigo-600 font-bold">
            <CheckCircle2 className="w-5 h-5" /> Payment
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-slate-400 font-medium">Payment</span>
        )}
      </div>

      <div className={`w-8 sm:w-16 h-1 rounded-full ${step4 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>

      {/* Place Order */}
      <div className="flex items-center gap-2">
        {step4 ? (
          <Link to="/placeorder" className="flex items-center gap-1 text-indigo-600 font-bold">
            <CheckCircle2 className="w-5 h-5" /> Place Order
          </Link>
        ) : (
          <span className="flex items-center gap-1 text-slate-400 font-medium">Place Order</span>
        )}
      </div>
    </div>
  );
};

export default CheckoutSteps;