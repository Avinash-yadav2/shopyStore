import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { MapPin, CreditCard, Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useDeliverOrderMutation
} from '../slices/ordersApiSlice';

const Order = () => {
  const { id: orderId } = useParams();

  // RTK Query hooks
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  // Redux Auth State & PayPal State
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  // PayPal Button Handlers
  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: order.totalPrice },
        },
      ],
    }).then((orderId) => orderId);
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch(); 
        alert('Payment successful!');
      } catch (err) {
        alert(err?.data?.message || err.message);
      }
    });
  }

  function onError(err) {
    console.error(err);
    alert('Payment failed or cancelled.');
  }

  // Admin Deliver Handler
  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch(); 
      alert('Order Delivered Successfully');
    } catch (err) {
      alert(err?.data?.message || err.message);
    }
  };

  // Dummy Payment Handler (For Portfolio Testing)
  const dummyPayHandler = async () => {
    try {
      await payOrder({ 
        orderId, 
        details: { 
          id: 'TEST_TRANSACTION_123', 
          status: 'COMPLETED', 
          update_time: new Date().toISOString(), 
          payer: { email_address: userInfo.email } 
        } 
      });
      refetch();
      alert('Dummy Payment Successful!');
    } catch (err) {
      alert(err?.data?.message || err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 mt-8">
        {error?.data?.message || error.error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 border-l-4 border-indigo-500 pl-4 break-words">
        Order <span className="text-indigo-600 text-xl md:text-2xl block sm:inline mt-2 sm:mt-0">#{order._id}</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Column: Details Summary */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Shipping Info */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2 pb-4 border-b border-slate-100">
              <MapPin className="text-indigo-600 w-6 h-6" /> Shipping
            </h2>
            <p className="text-slate-700 text-lg mb-4">
              <span className="font-bold">Name: </span> {order.user.name} <br />
              <span className="font-bold">Email: </span> <a href={`mailto:${order.user.email}`} className="text-indigo-600 hover:underline">{order.user.email}</a> <br />
              <span className="font-bold">Address: </span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 font-bold">
                <CheckCircle2 className="w-5 h-5" /> Delivered on {order.deliveredAt.substring(0, 10)}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200 font-bold">
                <AlertCircle className="w-5 h-5" /> Not Delivered
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2 pb-4 border-b border-slate-100">
              <CreditCard className="text-indigo-600 w-6 h-6" /> Payment Method
            </h2>
            <p className="text-slate-700 text-lg mb-4">
              <span className="font-bold">Method: </span> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 font-bold">
                <CheckCircle2 className="w-5 h-5" /> Paid on {order.paidAt.substring(0, 10)}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200 font-bold">
                <AlertCircle className="w-5 h-5" /> Not Paid
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2 pb-4 border-b border-slate-100">
              <Package className="text-indigo-600 w-6 h-6" /> Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-lg bg-slate-50 p-1" />
                  <div className="flex-1 text-center sm:text-left">
                    <Link to={`/product/${item.product}`} className="font-bold text-slate-800 hover:text-indigo-600">{item.name}</Link>
                  </div>
                  <div className="font-bold text-slate-700 mt-2 sm:mt-0">
                    {item.qty} x ${item.price} = <span className="text-indigo-600">${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl sticky top-28">
            <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-slate-700">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-slate-300">
                <span>Items:</span> <span className="font-bold text-white">${order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Shipping:</span> <span className="font-bold text-white">${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Tax:</span> <span className="font-bold text-white">${order.taxPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-8 pb-4 border-t border-slate-700 pt-4">
              <span className="text-lg text-slate-300">Total:</span>
              <span className="text-3xl font-extrabold text-amber-400">${order.totalPrice.toFixed(2)}</span>
            </div>

           
            {!order.isPaid && (
              <div className="mt-4">
                {loadingPay && <div className="text-center text-indigo-400 mb-2">Processing Payment...</div>}
                {isPending ? (
                  <div className="flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div></div>
                ) : (
                  <div className="relative z-0">
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  </div>
                )}
                
               
                <button
                  type="button"
                  className="w-full mt-4 bg-amber-500 text-slate-900 font-bold text-lg py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-lg flex justify-center items-center gap-2"
                  onClick={dummyPayHandler}
                >
                  Test Pay (Bypass PayPal)
                </button>
              </div>
            )}
            
            {order.isPaid && (
              <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center font-bold flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8" />
                Payment Completed
              </div>
            )}

            
            {loadingDeliver && <div className="text-center text-indigo-400 mt-4">Updating Delivery Status...</div>}
            
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <div className="mt-6 border-t border-slate-700 pt-6">
                <button
                  type="button"
                  className="w-full bg-cyan-600 text-white font-bold text-lg py-3 rounded-xl hover:bg-cyan-500 transition-colors shadow-lg flex justify-center items-center gap-2"
                  onClick={deliverOrderHandler}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default Order;