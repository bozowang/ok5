import React from 'react';

/**
 * Header 組件的 props 介面。
 */
interface HeaderProps {
  /** 購物車中的商品總數 */
  cartItemCount: number;
  /** 點擊購物車圖示時觸發的回呼函數 */
  onCartClick: () => void;
  /** 點擊 Logo 時觸發的回呼函數 */
  onLogoClick: () => void;
}

/**
 * 應用程式的頁首組件，包含 Logo 和購物車按鈕。
 * @param {HeaderProps} props - 組件的 props。
 * @returns {React.ReactElement} Header 組件。
 */
const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onLogoClick }) => {
  return (
    <header className="bg-gradient-to-r from-red-500 to-orange-400 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer" onClick={onLogoClick}>
          <i className="fas fa-utensils mr-2"></i> Gemini 美食外送
        </div>
        <button
          onClick={onCartClick}
          className="relative bg-white/20 hover:bg-white/30 transition-colors duration-300 px-4 py-2 rounded-full flex items-center space-x-2"
          aria-label={`查看購物車，目前有 ${cartItemCount} 件商品`}
        >
          <i className="fas fa-shopping-cart"></i>
          <span>購物車</span>
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center" aria-hidden="true">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
