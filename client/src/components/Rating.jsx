import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text }) => {
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-amber-500">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index}>
            {value >= index ? (
              <Star className="w-4 h-4 fill-current" />
            ) : value >= index - 0.5 ? (
              <StarHalf className="w-4 h-4 fill-current" />
            ) : (
              <Star className="w-4 h-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
      {text && <span className="text-xs text-slate-500 ml-1 font-medium">{text}</span>}
    </div>
  );
};

export default Rating;