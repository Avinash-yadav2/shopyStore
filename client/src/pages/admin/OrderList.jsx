import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { CheckCircle, XCircle, LayoutDashboard } from 'lucide-react';

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3 pb-4 border-b border-slate-100">
          <LayoutDashboard className="text-indigo-600 w-8 h-8" /> All Orders (Admin)
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl">
            {error?.data?.message || error.error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white rounded-t-xl">
                  <th className="p-4 font-bold rounded-tl-xl">ID</th>
                  <th className="p-4 font-bold">USER</th>
                  <th className="p-4 font-bold">DATE</th>
                  <th className="p-4 font-bold">TOTAL</th>
                  <th className="p-4 font-bold text-center">PAID</th>
                  <th className="p-4 font-bold text-center">DELIVERED</th>
                  <th className="p-4 font-bold rounded-tr-xl">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-slate-600">{order._id.substring(0, 10)}...</td>
                    {/* User name safety check */}
                    <td className="p-4 text-sm font-bold text-slate-800">{order.user ? order.user.name : 'Deleted User'}</td>
                    <td className="p-4 text-sm text-slate-600">{order.createdAt.substring(0, 10)}</td>
                    <td className="p-4 font-bold text-indigo-600">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      {order.isPaid ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {order.isDelivered ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-right">
                      
                      <Link 
                        to={`/order/${order._id}`} 
                        className="inline-block bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Manage
                      </Link>
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

export default OrderList;