import React from 'react';

/**
 * Spinner 組件的 props 介面。
 */
interface SpinnerProps {
  /** 要顯示的載入訊息 */
  message?: string;
}

/**
 * 一個可重複使用的載入指示器組件。
 * @param {SpinnerProps} props - 組件的 props。
 * @returns {React.ReactElement} Spinner 組件。
 */
const Spinner: React.FC<SpinnerProps> = ({ message = "載入中..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
};

export default Spinner;
