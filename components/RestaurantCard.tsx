import React from 'react';
import type { Restaurant } from '../types';
import StarRating from './StarRating';

/**
 * RestaurantCard �ե� props �����C
 */
interface RestaurantCardProps {
  /** �n��ܪ��\�U��� */
  restaurant: Restaurant;
  /** �I���d����Ĳ�o���^�I��� */
  onClick: () => void;
}

/**
 * ��ܳ�@�\�U��T���d���ե�C
 * @param {RestaurantCardProps} props - �ե� props�C
 * @returns {React.ReactElement} RestaurantCard �ե�C
 */
const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="relative">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{restaurant.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{restaurant.category}</p>
        <div className="flex items-center mb-3">
          <StarRating rating={restaurant.rating} />
          <span className="text-gray-600 text-sm ml-2">{restaurant.rating.toFixed(1)} ({restaurant.reviews} �h����)</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-700 border-t pt-3 mt-3">
          <div className="flex items-center">
            <i className="fas fa-clock mr-2 text-gray-400" aria-hidden="true"></i>
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-dollar-sign mr-1 text-gray-400" aria-hidden="true"></i>
            <span>�C�� NT${restaurant.minOrder}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
