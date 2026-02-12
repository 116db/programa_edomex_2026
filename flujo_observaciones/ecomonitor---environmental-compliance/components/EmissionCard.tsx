
import React from 'react';
import { Emission } from '../types';

interface EmissionCardProps {
  emission: Emission;
  onDelete: () => void;
}

const EmissionCard: React.FC<EmissionCardProps> = ({ emission, onDelete }) => {
  return (
    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 flex justify-between items-center shadow-sm hover:border-slate-600 transition-colors group">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
          {emission.source}
        </span>
        <div className="flex gap-4 mt-1">
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500">Conc:</span>
            <span className="text-sm font-semibold text-slate-200">
              {emission.concentration.toLocaleString()} <span className="text-[10px] opacity-60">ppm</span>
            </span>
          </div>
          <div className="flex items-center gap-1 border-l border-slate-700 pl-4">
            <span className="text-xs text-slate-500">Rate:</span>
            <span className="text-sm font-semibold text-slate-200">
              {emission.massFlowRate.toLocaleString()} <span className="text-[10px] opacity-60">g/h</span>
            </span>
          </div>
        </div>
      </div>
      <button 
        onClick={onDelete}
        className="text-slate-500 hover:text-red-400 transition-colors p-1"
        aria-label="Delete Emission"
      >
        <span className="material-icons text-xl">delete_outline</span>
      </button>
    </div>
  );
};

export default EmissionCard;
