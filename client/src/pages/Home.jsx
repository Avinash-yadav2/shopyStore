import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import { Flame, ArrowRight, Sparkles, TrendingUp, SearchX } from 'lucide-react';

const Home = () => {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const keyword = sp.get('keyword') || '';

  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    if (keyword) {
      setActiveCategory('');
    }
  }, [keyword]);

  const { data: products, isLoading, error } = useGetProductsQuery({ 
    keyword, 
    category: activeCategory === 'All' ? '' : activeCategory 
  });

  
  const categoriesList = ['All', 'Electronics', 'Fashion', 'Grocery', 'Beauty', 'Sports', 'Toys'];
  
  const categoryIcons = {
    'All': '🛍️', 'Electronics': '💻', 'Fashion': '👕', 'Grocery': '🍎', 'Beauty': '✨', 'Sports': '⚽', 'Toys': '🧸'
  };

  return (
    <div className="w-full">
      
      {/* CATEGORY SLIDER */}
      <div className="bg-white py-4 px-4 sm:px-6 mb-6 shadow-sm sticky top-[80px] z-40">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 max-w-7xl mx-auto">
          {categoriesList.map((cat, index) => (
            <button 
              key={index} 
              onClick={() => setActiveCategory(cat)}
              className={`flex flex-col items-center min-w-[80px] gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                (activeCategory === cat || (activeCategory === '' && cat === 'All' && !keyword)) 
                ? 'bg-indigo-600 text-white shadow-md transform -translate-y-1' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div className="text-2xl">{categoryIcons[cat] || '📦'}</div>
              <span className="text-xs font-bold">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* BANNERS */}
        {!keyword && activeCategory === '' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div 
              onClick={() => setActiveCategory('Electronics')} 
              className="cursor-pointer bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Mega Sale</span>
                <h2 className="text-3xl font-extrabold mb-2">Smart TVs & Tech</h2>
                <p className="text-indigo-200 mb-6">Up to 40% OFF on Top Brands</p>
                <span className="inline-flex items-center gap-2 font-bold text-sm bg-white/10 px-4 py-2 rounded-full">Shop Tech <ArrowRight className="w-4 h-4" /></span>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
                 <TrendingUp className="w-64 h-64" />
              </div>
            </div>

            <div 
              onClick={() => setActiveCategory('Grocery')}
              className="cursor-pointer bg-gradient-to-r from-emerald-50 to-teal-100 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-200 relative overflow-hidden"
            >
              <div className="relative z-10">
                 <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Fresh Daily</span>
                 <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Daily Grocery</h2>
                 <p className="text-slate-700 mb-6">Delivered in 20 Minutes</p>
                 <span className="inline-flex items-center gap-2 font-bold text-sm bg-slate-900 text-white px-4 py-2 rounded-full">Explore Groceries <ArrowRight className="w-4 h-4" /></span>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 transform -translate-x-4 -translate-y-4">
                 <Sparkles className="w-40 h-40 text-emerald-500" />
              </div>
            </div>
          </div>
        )}

        {/* HEADER TEXT */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            {keyword ? `Search Results for "${keyword}"` : activeCategory ? `${activeCategory} Products` : <><Flame className="text-orange-500 w-8 h-8" /> Featured Deals</>}
          </h2>
        </div>

        {/* LOADING & PRODUCTS */}
        {isLoading ? (
          <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div></div>
        ) : error ? (
          <div className="text-center text-red-500 mt-10 font-bold bg-red-50 p-6 rounded-2xl border border-red-100">{error?.data?.message || error.error}</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10 text-slate-500 p-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <SearchX className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
            <p className="text-slate-500 text-center max-w-md">We couldn't find anything matching your criteria. Try adjusting your category or searching for something else.</p>
            <button onClick={() => { setActiveCategory(''); window.location.href='/'; }} className="mt-6 bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-indigo-100 transition-colors">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mb-12">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;