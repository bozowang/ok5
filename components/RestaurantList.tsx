import React from 'react';
import type { Restaurant } from '../types';
import RestaurantCard from './RestaurantCard';

/**
 * RestaurantList �ե� props �����C
 */
interface RestaurantListProps {
  /** �n��ܪ��\�U�C�� */
  restaurants: Restaurant[];
  /** ����\�U��Ĳ�o���^�I��� */
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

/**
 * ��ܩҦ��\�U�C���ե�C
 * @param {RestaurantListProps} props - �ե� props�C
 * @returns {React.ReactElement} RestaurantList �ե�C
 */
const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, onSelectRestaurant }) => {
  return (
    <section className="py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">����\�U</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {restaurants.map(restaurant => (
          <RestaurantCard 
            key={restaurant.id} 
            restaurant={restaurant} 
            onClick={() => onSelectRestaurant(restaurant)} 
          />
        ))}
      </div>
    </section>
  );
};

export default RestaurantList;
