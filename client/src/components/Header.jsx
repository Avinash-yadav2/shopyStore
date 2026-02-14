import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, ChevronDown, Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutApiCallMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutApiCallMutation();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2" onClick={() => setKeyword('')}>
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 tracking-tight">
                Shopy.
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl hidden md:block">
            <form onSubmit={submitHandler} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products, brands and more..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-slate-100 text-slate-900 border-none rounded-full py-3 pl-5 pr-12 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              />
              <button type="submit" className="absolute right-3 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/cart" className="text-slate-600 hover:text-indigo-600 transition-colors duration-300 flex items-center gap-2 font-medium relative">
              <ShoppingCart className="w-6 h-6" />
              <span className="hidden sm:inline">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -left-2 sm:-top-2 sm:-left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-slate-700 bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-all focus:outline-none font-bold"
                >
                  <User className="w-5 h-5 text-indigo-600" />
                  <span>{userInfo.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl py-2 border border-slate-100 z-50">
                    <Link to="/profile" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => setIsDropdownOpen(false)}>My Profile</Link>
                    {userInfo && userInfo.isAdmin && (
                      <>
                        <div className="border-t border-slate-100 my-1"></div>
                        <div className="px-4 py-1 text-xs font-bold text-slate-400 uppercase">Admin Panel</div>
                        <Link to="/admin/orderlist" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => setIsDropdownOpen(false)}>Manage Orders</Link>
                        <Link to="/admin/productlist" className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600" onClick={() => setIsDropdownOpen(false)}>Manage Products</Link>
                      </>
                    )}
                    <div className="border-t border-slate-100 my-1"></div>
                    <button onClick={logoutHandler} className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-indigo-700 shadow-md">Login</Link>
            )}
          </div>
        </div>

        <div className="md:hidden pb-4">
           <form onSubmit={submitHandler} className="relative flex items-center">
              <input type="text" placeholder="Search..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="w-full bg-slate-100 text-slate-900 border-none rounded-full py-3 pl-5 pr-12 outline-none" />
              <button type="submit" className="absolute right-3 p-2 bg-indigo-600 text-white rounded-full"><Search className="w-4 h-4" /></button>
            </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;