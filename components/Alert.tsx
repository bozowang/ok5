import React, { useEffect } from 'react';

/**
 * Alert 組件的 props 介面。
 */
interface AlertProps {
  /** 要顯示的訊息 */
  message: string;
  /** 提示的類型，決定背景顏色和圖示 */
  type: 'success' | 'error';
  /** 關閉提示時的回呼函數 */
  onClose: () => void;
}

/**
 * 一個可重複使用的提示訊息組件，會在幾秒後自動消失。
 * @param {AlertProps} props - 組件的 props。
 * @returns {React.ReactElement} Alert 組件。
 */
const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';

  return (
    <div
      role="alert"
      className={`fixed top-5 right-5 z-50 flex items-center text-white px-6 py-4 rounded-lg shadow-xl animate-slideIn ${bgColor}`}
    >
      <i className={`fas ${icon} mr-3 text-xl`}></i>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200" aria-label="關閉提示">
        <i className="fas fa-times"></i>
      </button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Alert;
