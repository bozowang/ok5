import React from 'react';
import type { MenuItem } from '../types';

/**
 * MenuItemCard �ե� props �����C
 */
interface MenuItemCardProps {
  /** �n��ܪ���涵�� */
  item: MenuItem;
  /** �N���إ[�J�ʪ�����Ĳ�o���^�I��� */
  onAddToCart: (item: MenuItem) => void;
}

/**
 * ��ܳ�@��涵�ت��d���ե�C
 * @param {MenuItemCardProps} props - �ե� props�C
 * @returns {React.ReactElement} MenuItemCard �ե�C
 */
const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow duration-200">
        <div>
            <h4 className="font-semibold text-gray-800">{item.name}</h4>
            <p className="text-red-500 font-bold">NT$ {item.price}</p>
        </div>
        <button 
            onClick={() => onAddToCart(item)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 text-sm flex items-center"
            aria-label={`�N ${item.name} �[�J�ʪ���`}
        >
            <i className="fas fa-plus mr-2"></i> �[�J
        </button>
    </div>
);

export default MenuItemCard;
