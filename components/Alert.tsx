import React, { useEffect } from 'react';

/**
 * Alert �ե� props �����C
 */
interface AlertProps {
  /** �n��ܪ��T�� */
  message: string;
  /** ���ܪ������A�M�w�I���C��M�ϥ� */
  type: 'success' | 'error';
  /** �������ܮɪ��^�I��� */
  onClose: () => void;
}

/**
 * �@�ӥi���ƨϥΪ����ܰT���ե�A�|�b�X���۰ʮ����C
 * @param {AlertProps} props - �ե� props�C
 * @returns {React.ReactElement} Alert �ե�C
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
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200" aria-label="��������">
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
