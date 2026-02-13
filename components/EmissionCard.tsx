
import React from 'react';
import { Emission } from '../types';

interface EmissionCardProps {
    emission: Emission;
    onDelete: () => void;
    onEdit: () => void;
}

const EmissionCard: React.FC<EmissionCardProps> = ({ emission, onDelete, onEdit }) => {
    return (
        <div className="bg-blue-900/40 p-3 rounded-lg border border-blue-700/50 flex justify-between items-center shadow-sm hover:border-blue-500 transition-colors group">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                    {emission.source}
                </span>
                <div className="flex gap-4 mt-1">
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-blue-300">Conc:</span>
                        <span className="text-sm font-semibold text-white">
                            {emission.concentration.toLocaleString()} <span className="text-[10px] opacity-60">ppm</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-1 border-l border-blue-700 pl-4">
                        <span className="text-xs text-blue-300">Rate:</span>
                        <span className="text-sm font-semibold text-white">
                            {emission.massFlowRate.toLocaleString()} <span className="text-[10px] opacity-60">g/h</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={onEdit}
                    className="text-blue-300 hover:text-primary transition-colors p-1"
                    aria-label="Edit Emission"
                >
                    <span className="material-symbols-outlined text-xl">edit</span>
                </button>
                <button
                    onClick={onDelete}
                    className="text-blue-300 hover:text-red-400 transition-colors p-1"
                    aria-label="Delete Emission"
                >
                    <span className="material-symbols-outlined text-xl">delete</span>
                </button>
            </div>
        </div>
    );
};

export default EmissionCard;
