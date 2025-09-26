import React from 'react';
import type { ConfirmedOrder } from '../types';

/**
 * ConfirmationView �ե� props �����C
 */
interface ConfirmationViewProps {
  /** �w�T�{���q���� */
  order: ConfirmedOrder;
  /** �إ߷s�q��ɪ��^�I��� */
  onNewOrder: () => void;
}

/**
 * ��ܭq��T�{�T�������ϲե�C
 * @param {ConfirmationViewProps} props - �ե� props�C
 * @returns {React.ReactElement} ConfirmationView �ե�C
 */
const ConfirmationView: React.FC<ConfirmationViewProps> = ({ order, onNewOrder }) => {
  return (
    <div className="bg-white rounded-lg p-8 shadow-lg my-8 text-center">
      <div className="text-6xl text-green-500 mb-4">
        <i className="fas fa-check-circle"></i>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">�q�洣�榨�\�I</h2>
      <p className="text-gray-600 mb-6">�P�±z���q�ʡA�������b���W�I</p>
      
      <div className="text-left bg-gray-50 p-6 rounded-lg border w-full max-w-md mx-auto space-y-3">
        <p><strong>�q��s���G</strong> <span className="font-mono text-red-500">{order.orderNumber}</span></p>
        <p><strong>�w�p�e�F�ɶ��G</strong> <span className="font-semibold">{order.estimatedDeliveryTime}</span></p>
        <p><strong>�U�ȩm�W�G</strong> {order.customerName}</p>
        <p><strong>�~�e�ܡG</strong> {order.deliveryAddress}</p>
        <p><strong>�`���B�G</strong> <span className="font-bold">NT$ {order.total}</span></p>
      </div>

      <button
        onClick={onNewOrder}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg mt-8 transition-colors duration-300"
      >
        �إ߷s�q��
      </button>
    </div>
  );
};

export default ConfirmationView;
