
import React, { useState, useEffect } from 'react';
import { TechnicalAsset, Emission } from '../types';
import ObservationSection from './ObservationSection';
import EmissionCard from './EmissionCard';
import EmissionModal from './EmissionModal';

interface ObservationsScreenProps {
    asset: TechnicalAsset;
    onBack: () => void;
    onSave: (assetId: string, observations: string, emissions: Emission[]) => void;
}

const ObservationsScreen: React.FC<ObservationsScreenProps> = ({ asset, onBack, onSave }) => {
    const [observations, setObservations] = useState(asset.observations || '');
    const [emissions, setEmissions] = useState<Emission[]>(asset.emissions || []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmission, setEditingEmission] = useState<Emission | null>(null);

    // Update local state if asset changes 
    useEffect(() => {
        setObservations(asset.observations || '');
        setEmissions(asset.emissions || []);
    }, [asset]);

    const handleSaveEmission = (data: { source: string; concentration: number; massFlowRate: number }) => {
        if (editingEmission) {
            // Update existing
            setEmissions(prev => prev.map(e =>
                e.id === editingEmission.id
                    ? { ...e, ...data, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                    : e
            ));
        } else {
            // Create new
            const emission: Emission = {
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setEmissions(prev => [...prev, emission]);
        }
        setIsModalOpen(false);
        setEditingEmission(null);
    };

    const handleEditEmission = (emission: Emission) => {
        setEditingEmission(emission);
        setIsModalOpen(true);
    };

    const handleDeleteEmission = (id: string) => {
        setEmissions(prev => prev.filter(e => e.id !== id));
    };

    const handleFinalize = () => {
        onSave(asset.id, observations, emissions);
        onBack();
    };

    return (
        <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden">
            {/* Fixed Header */}
            <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-primary/10 px-4 py-3 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center text-primary transition-colors hover:opacity-70"
                >
                    <span className="material-symbols-outlined text-2xl">chevron_left</span>
                    <span className="text-lg">Inspections</span>
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold tracking-tight">Observations</h1>
                    <span className="text-xs text-blue-200 font-mono">{asset.id}</span>
                </div>
                <div className="w-10"></div>
            </header>

            <main className="flex-grow p-4 md:p-6 space-y-8 pb-32 overflow-y-auto custom-scrollbar max-w-3xl mx-auto w-full">
                {/* Observation Section */}
                <ObservationSection
                    value={observations}
                    onChange={setObservations}
                />

                {/* Emissions List Header */}
                <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">factory</span>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-200">Emissions</h2>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-semibold active:scale-95 transition-transform shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        <span>Emisiones</span>
                    </button>
                </div>

                {/* Emissions List Container */}
                <div className="bg-blue-900/20 rounded-xl p-2 border border-blue-800 space-y-2">
                    {emissions.length === 0 ? (
                        <div className="p-8 text-center text-blue-200 italic text-sm">
                            No emission data logged yet.
                        </div>
                    ) : (
                        emissions.map(emission => (
                            <EmissionCard
                                key={emission.id}
                                emission={emission}
                                onDelete={() => handleDeleteEmission(emission.id)}
                                onEdit={() => handleEditEmission(emission)}
                            />
                        ))
                    )}
                </div>
            </main>

            {/* Footer Actions */}
            <footer className="fixed bottom-0 left-0 w-full bg-background/95 backdrop-blur-md border-t border-white/5 p-6 space-y-3 z-30">
                <div className="max-w-md mx-auto w-full">
                    <button
                        onClick={handleFinalize}
                        className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="text-base uppercase tracking-wider">
                            Save Report
                        </span>
                        <span className="material-symbols-outlined">save</span>
                    </button>
                    <p className="text-center text-[10px] text-blue-300 uppercase tracking-[0.2em] font-medium mt-3">
                        Environmental Compliance Management
                    </p>
                </div>
            </footer>

            {/* Modal Backdrop & Modal */}
            {isModalOpen && (
                <EmissionModal
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingEmission(null);
                    }}
                    onSave={handleSaveEmission}
                    initialData={editingEmission || undefined}
                />
            )}
        </div>
    );
};

export default ObservationsScreen;
