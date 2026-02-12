
import React, { useState } from 'react';

interface EmissionModalProps {
    onClose: () => void;
    onSave: (data: { source: string; concentration: number; massFlowRate: number }) => void;
    initialData?: { source: string; concentration: number; massFlowRate: number };
}

const EmissionModal: React.FC<EmissionModalProps> = ({ onClose, onSave, initialData }) => {
    const [source, setSource] = useState(initialData?.source || 'New Point Source');
    const [concentration, setConcentration] = useState(initialData?.concentration?.toString() || '');
    const [massFlowRate, setMassFlowRate] = useState(initialData?.massFlowRate?.toString() || '');

    const handleSave = () => {
        if (!concentration || !massFlowRate) return;
        onSave({
            source,
            concentration: parseFloat(concentration),
            massFlowRate: parseFloat(massFlowRate),
        });
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a242d] w-full max-w-sm rounded-xl shadow-2xl overflow-hidden border border-white/5 animate-in fade-in zoom-in duration-300">

                {/* Modal Header */}
                <div className="p-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-xl">add_chart</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-white">
                            {initialData ? 'Edit Emission Data' : 'Add Emission Data'}
                        </h2>
                    </div>
                    <p className="text-sm text-slate-400">Log new environmental sensor measurements.</p>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">
                    {/* Source Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reference Source</label>
                        <input
                            className="w-full bg-black/20 border-2 border-white/10 rounded-lg px-4 py-2 text-sm font-medium focus:border-primary focus:ring-0 transition-all outline-none text-slate-100 placeholder:text-slate-600"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            placeholder="e.g. POINT SOURCE A-01"
                        />
                    </div>

                    {/* Concentration Field */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Concentration</label>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">Required</span>
                        </div>
                        <div className="relative group">
                            <input
                                className="w-full bg-black/20 border-2 border-white/10 rounded-lg px-4 py-4 text-2xl font-bold focus:border-primary focus:ring-0 transition-all outline-none text-slate-100 placeholder:text-slate-600"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={concentration}
                                onChange={(e) => setConcentration(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                ppm
                            </div>
                        </div>
                    </div>

                    {/* Mass Flow Rate Field */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mass Flow Rate</label>
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">Required</span>
                        </div>
                        <div className="relative group">
                            <input
                                className="w-full bg-black/20 border-2 border-white/10 rounded-lg px-4 py-4 text-2xl font-bold focus:border-primary focus:ring-0 transition-all outline-none text-slate-100 placeholder:text-slate-600"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={massFlowRate}
                                onChange={(e) => setMassFlowRate(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                                g/h
                            </div>
                        </div>
                    </div>

                    {/* Info Hint */}
                    <div className="bg-primary/5 rounded-lg p-3 flex gap-3 items-start">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Data will be timestamped automatically to current session: <span className="font-bold text-white">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="p-6 bg-black/20 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 px-4 rounded-lg font-bold text-slate-300 border border-white/10 hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!concentration || !massFlowRate}
                        className="flex-[1.5] py-3.5 px-4 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                    >
                        <span>Save Record</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmissionModal;
