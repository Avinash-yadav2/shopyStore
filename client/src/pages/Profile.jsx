import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Package, XCircle, CheckCircle } from 'lucide-react';
import { setCredentials } from '../slices/authSlice';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
        dispatch(setCredentials(res));
        alert('Profile Updated Successfully');
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Update Profile Form (Takes 4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-28">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <User className="text-indigo-600 w-6 h-6" /> User Profile
            </h2>

            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingUpdateProfile}
                className="w-full mt-4 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg disabled:bg-slate-400"
              >
                {loadingUpdateProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order History Table (Takes 8 cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <Package className="text-indigo-600 w-6 h-6" /> My Orders
            </h2>

            {loadingOrders ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>
            ) : errorOrders ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl">{errorOrders?.data?.message || errorOrders.error}</div>
            ) : orders.length === 0 ? (
              <div className="bg-indigo-50 text-indigo-800 p-6 rounded-xl text-center font-bold border border-indigo-100">
                You haven't placed any orders yet. <Link to="/" className="text-indigo-600 underline ml-2">Start Shopping!</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <th className="p-4 font-bold rounded-tl-xl">ID</th>
                      <th className="p-4 font-bold">DATE</th>
                      <th className="p-4 font-bold">TOTAL</th>
                      <th className="p-4 font-bold text-center">PAID</th>
                      <th className="p-4 font-bold text-center">DELIVERED</th>
                      <th className="p-4 font-bold rounded-tr-xl"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-sm font-medium text-slate-600">{order._id.substring(0, 10)}...</td>
                        <td className="p-4 text-sm text-slate-600">{order.createdAt.substring(0, 10)}</td>
                        <td className="p-4 font-bold text-slate-800">${order.totalPrice.toFixed(2)}</td>
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
                          <Link to={`/order/${order._id}`} className="inline-block bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                            Details
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

      </div>
    </div>
  );
};

export default Profile;