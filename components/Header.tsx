import React from 'react';

/**
 * Header �ե� props �����C
 */
interface HeaderProps {
  /** �ʪ��������ӫ~�`�� */
  cartItemCount: number;
  /** �I���ʪ����ϥܮ�Ĳ�o���^�I��� */
  onCartClick: () => void;
  /** �I�� Logo ��Ĳ�o���^�I��� */
  onLogoClick: () => void;
}

/**
 * ���ε{���������ե�A�]�t Logo �M�ʪ������s�C
 * @param {HeaderProps} props - �ե� props�C
 * @returns {React.ReactElement} Header �ե�C
 */
const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick, onLogoClick }) => {
  return (
    <header className="bg-gradient-to-r from-red-500 to-orange-400 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer" onClick={onLogoClick}>
          <i className="fas fa-utensils mr-2"></i> Gemini �����~�e
        </div>
        <button
          onClick={onCartClick}
          className="relative bg-white/20 hover:bg-white/30 transition-colors duration-300 px-4 py-2 rounded-full flex items-center space-x-2"
          aria-label={`�d���ʪ����A�ثe�� ${cartItemCount} ��ӫ~`}
        >
          <i className="fas fa-shopping-cart"></i>
          <span>�ʪ���</span>
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
