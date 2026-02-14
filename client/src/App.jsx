import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Shipping from './pages/Shipping';
import Payment from './pages/Payment';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import OrderList from './pages/admin/OrderList';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        
        {/* Main content area */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            {/*routes (Cart, Login)*/}
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

           {/* Private Routes Yahan Aayenge */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/order/:id" element={<Order />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="" element={<AdminRoute />}>
              <Route path="/admin/orderlist" element={<OrderList />} />
              <Route path="/admin/productlist" element={<ProductList />} />
              <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
            </Route>
              
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;