import React from 'react';
import type { CartItem } from '../types';
import { SHIPPING_FEE } from '../constants';

/**
 * CartView �ե� props �����C
 */
interface CartViewProps {
  /** �ʪ����������ئC�� */
  cart: CartItem[];
  /** ��s�ӫ~�ƶq���^�I��� */
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  /** �����ӫ~���^�I��� */
  onRemoveItem: (itemId: string) => void;
  /** �e�����b���^�I��� */
  onCheckout: () => void;
  /** ��^�W�@�����^�I��� */
  onBack: () => void;
}

/**
 * ����ʪ������e�����ϲե�C
 * @param {CartViewProps} props - �ե� props�C
 * @returns {React.ReactElement} CartView �ե�C
 */
const CartView: React.FC<CartViewProps> = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout, onBack }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal > 0 ? subtotal + SHIPPING_FEE : 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg my-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">�z���ʪ���</h2>
        <button onClick={onBack} className="text-gray-600 hover:text-red-500 flex items-center">
          <i className="fas fa-shopping-bag mr-2"></i>�~���ʪ�
        </button>
      </div>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <i className="fas fa-shopping-cart text-5xl mb-4 text-gray-300"></i>
          <p className="text-lg">�z���ʪ����O�Ū��C</p>
          <button onClick={onBack} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            �}�l�I�\
          </button>
        </div>
      ) : (
        <div>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-3 border rounded-lg">
                <div className="flex-grow mb-2 sm:mb-0 text-center sm:text-left">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">NT$ {item.price}</p>
                </div>
                <div className="flex items-center space-x-2 my-2 sm:my-0">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300">-</button>
                  <span className="w-10 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300">+</button>
                </div>
                <div className="flex items-center">
                  <p className="w-24 text-right font-bold mr-4">NT$ {item.price * item.quantity}</p>
                  <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700" aria-label={`�q�ʪ������� ${item.name}`}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2 text-gray-600">
              <span>�p�p�G</span>
              <span>NT$ {subtotal}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>�~�e�O�G</span>
              <span>NT$ {SHIPPING_FEE}</span>
            </div>
            <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
              <span>�`�p�G</span>
              <span>NT$ {total}</span>
            </div>
            <button
              onClick={onCheckout}
              disabled={cart.length === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg mt-6 transition-colors duration-300 disabled:bg-gray-400"
            >
              �e�����b
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;
