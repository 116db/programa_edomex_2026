
import React from 'react';

interface ObservationSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const ObservationSection: React.FC<ObservationSectionProps> = ({ value, onChange }) => {
  const MAX_CHARS = 1000;

  return (
    <div>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-primary/80 text-xl">description</span>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary/80">Observation Details</h2>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Provide a detailed qualitative report of environmental conditions and anomalies detected.
        </p>
      </div>

      <div className="relative shrink-0 h-48">
        <div className="h-full relative rounded-xl overflow-hidden border border-primary/20 bg-primary/5 focus-within:border-primary transition-all duration-200 shadow-sm">
          <textarea 
            className="w-full h-full p-4 bg-transparent border-none focus:ring-0 text-base resize-none placeholder:text-slate-600 font-display text-slate-100"
            maxLength={MAX_CHARS}
            placeholder="Describe environmental findings..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
          ></textarea>
          <div className="absolute bottom-3 right-3 bg-background-dark/80 px-2 py-1 rounded-lg border border-primary/10 backdrop-blur-sm">
            <span className="text-[10px] font-medium text-primary tracking-widest uppercase">
              {value.length} <span className="text-slate-400">/ {MAX_CHARS}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservationSection;
