import React from 'react';

/**
 * Spinner �ե� props �����C
 */
interface SpinnerProps {
  /** �n��ܪ����J�T�� */
  message?: string;
}

/**
 * �@�ӥi���ƨϥΪ����J���ܾ��ե�C
 * @param {SpinnerProps} props - �ե� props�C
 * @returns {React.ReactElement} Spinner �ե�C
 */
const Spinner: React.FC<SpinnerProps> = ({ message = "���J��..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mb-4"></div>
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
};

export default Spinner;
