import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="px-4 py-3 bg-background border-b border-border sticky top-[57px] z-40">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-slate-500 text-[20px] group-focus-within:text-primary transition-colors">
            search
          </span>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-10 pr-10 py-2.5 bg-surface border border-transparent rounded-lg 
                   text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-primary/50 focus:bg-[#1e2c3b] transition-all"
          placeholder="Buscar UT"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-white text-slate-500 transition-colors">

        </div>
      </div>
    </div>
  );
};

export default SearchBar;