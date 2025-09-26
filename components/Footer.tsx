import React from 'react';

/**
 * 應用程式的頁尾組件。
 * @returns {React.ReactElement} Footer 組件。
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-6 mt-12">
      <p>© {new Date().getFullYear()} Gemini 美食外送. 版權所有.</p>
    </footer>
  );
};

export default Footer;
