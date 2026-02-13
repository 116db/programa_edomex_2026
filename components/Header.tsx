import React from 'react';

interface HeaderProps {
  onReset?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <div className="flex items-center justify-center px-4 py-3 bg-[#6089B4]/50 border-b border-blue-800/30 sticky top-0 z-50 backdrop-blur-sm relative">


      <div className="flex flex-col items-center">
        <h1 className="text-lg font-bold text-white tracking-wide">PROGRAMA DE TRABAJO</h1>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs text-[18px] text-blue-200 hover:text-white underline mt-1"
          >
            Cargar programa nuevo
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;