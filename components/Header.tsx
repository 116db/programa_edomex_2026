import React from 'react';

interface HeaderProps {
  onReset?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border sticky top-0 z-50">
      <button className="text-white hover:text-gray-300 transition-colors p-1">
        <span className="material-symbols-outlined text-[28px]">arrow_back_ios_new</span>
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-lg font-bold text-white tracking-wide">Programa EDOMEX 2026</h1>
        {onReset && (
          <button
            onClick={onReset}
            className="text-[10px] text-slate-400 hover:text-white underline mt-1"
          >
            Cargar Nuevo
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => window.open('https://www.google.com/maps', '_blank')}
          className="text-primary hover:text-primary-dark transition-colors p-1"
          aria-label="Open Google Maps"
        >
          <span className="material-symbols-outlined text-[28px]">map</span>
        </button>

      </div>
    </div>
  );
};

export default Header;