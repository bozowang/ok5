import React from 'react';

/**
 * StarRating 組件的 props 介面。
 */
interface StarRatingProps {
  /** 要顯示的評分，範圍 0-5 */
  rating: number;
}

/**
 * 顯示星級評分的組件。
 * @param {StarRatingProps} props - 組件的 props。
 * @returns {React.ReactElement} StarRating 組件。
 */
const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <div className="flex items-center text-yellow-400" aria-label={`評分為 ${rating} 顆星（滿分 5 顆星）`}>
        {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
        {halfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
      </div>
    );
};

export default StarRating;
