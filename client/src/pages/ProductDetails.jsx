import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';

const ProductDetails = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  
  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      alert('Review Submitted Successfully!');
      setRating(0);
      setComment('');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const imageUrl = product?.image && product.image.startsWith('/uploads')
    ? `${import.meta.env.VITE_API_URL}${product.image}`
    : product?.image;

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl mt-8">
        {error?.data?.message || error.error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 font-bold transition-colors">
        <ArrowLeft className="w-5 h-5" /> Go Back
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-1 flex justify-center items-start">
          <img src={imageUrl} alt={product.name} className="w-full max-w-sm object-contain rounded-2xl shadow-md border border-slate-50" />
        </div>

        <div className="lg:col-span-1 space-y-4">
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-2 text-amber-500 font-bold bg-amber-50 inline-block px-3 py-1 rounded-full border border-amber-100">
            <Star className="w-5 h-5 fill-current" /> {product.rating} / 5 ({product.numReviews} Reviews)
          </div>

          <p className="text-slate-600 text-lg leading-relaxed">{product.description}</p>
          <div className="text-sm text-slate-500">Brand: <span className="font-bold">{product.brand}</span> | Category: <span className="font-bold">{product.category}</span></div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl sticky top-28">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
              <span className="text-lg text-slate-300">Price</span>
              <span className="text-3xl font-extrabold text-amber-400">${product.price}</span>
            </div>
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
              <span className="text-lg text-slate-300">Status</span>
              <span className={`font-bold ${product.countInStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-slate-300">Qty</span>
                <select 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 outline-none focus:border-indigo-500"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full bg-indigo-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" /> Add To Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
          Customer Reviews
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            {product.reviews.length === 0 && (
              <div className="bg-indigo-50 text-indigo-800 p-4 rounded-xl font-medium border border-indigo-100">
                No reviews yet. Be the first to review this product!
              </div>
            )}
            
            <div className="space-y-6 mt-4">
              {product.reviews.map((review) => (
                <div key={review._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-slate-900 text-lg">{review.name}</strong>
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200">
                      <span className="text-amber-500 font-bold">{review.rating}</span>
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs mb-3">{review.createdAt.substring(0, 10)}</p>
                  <p className="text-slate-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Write a Customer Review</h3>
            
            {loadingProductReview && <div className="text-indigo-600 font-bold mb-4">Submitting review...</div>}
            
            {userInfo ? (
              <form onSubmit={submitReviewHandler} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                  <select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    required
                  >
                    <option value="">Select a rating...</option>
                    <option value="1">1 - Poor 😟</option>
                    <option value="2">2 - Fair 😐</option>
                    <option value="3">3 - Good 🙂</option>
                    <option value="4">4 - Very Good 😄</option>
                    <option value="5">5 - Excellent 🤩</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Comment</label>
                  <textarea 
                    rows="4" 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    required
                  ></textarea>
                </div>

                <button 
                  disabled={loadingProductReview} 
                  type="submit"
                  className="w-full bg-slate-900 text-white font-bold py-4 text-lg rounded-xl hover:bg-indigo-600 transition-colors shadow-lg disabled:bg-slate-400 flex justify-center items-center gap-2"
                >
                  <Star className="w-5 h-5" /> Submit Review
                </button>
              </form>
            ) : (
              <div className="bg-amber-50 text-amber-800 p-6 rounded-xl border border-amber-200 text-center">
                Please <Link to="/login" className="font-bold underline text-amber-900">Sign In</Link> to write a review.
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;