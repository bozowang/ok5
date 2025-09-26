import React from 'react';

/**
 * StarRating �ե� props �����C
 */
interface StarRatingProps {
  /** �n��ܪ������A�d�� 0-5 */
  rating: number;
}

/**
 * ��ܬP�ŵ������ե�C
 * @param {StarRatingProps} props - �ե� props�C
 * @returns {React.ReactElement} StarRating �ե�C
 */
const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <div className="flex items-center text-yellow-400" aria-label={`������ ${rating} ���P�]���� 5 ���P�^`}>
        {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star"></i>)}
        {halfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star"></i>)}
      </div>
    );
};

export default StarRating;
