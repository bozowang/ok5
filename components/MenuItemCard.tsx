import React from 'react';
import type { MenuItem } from '../types';

/**
 * MenuItemCard 組件的 props 介面。
 */
interface MenuItemCardProps {
  /** 要顯示的菜單項目 */
  item: MenuItem;
  /** 將項目加入購物車時觸發的回呼函數 */
  onAddToCart: (item: MenuItem) => void;
}

/**
 * 顯示單一菜單項目的卡片組件。
 * @param {MenuItemCardProps} props - 組件的 props。
 * @returns {React.ReactElement} MenuItemCard 組件。
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
            aria-label={`將 ${item.name} 加入購物車`}
        >
            <i className="fas fa-plus mr-2"></i> 加入
        </button>
    </div>
);

export default MenuItemCard;
