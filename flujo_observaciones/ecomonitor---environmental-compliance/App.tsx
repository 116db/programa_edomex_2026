
import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Emission, ReportState } from './types';
import ObservationSection from './components/ObservationSection';
import EmissionCard from './components/EmissionCard';
import EmissionModal from './components/EmissionModal';

const App: React.FC = () => {
  const [report, setReport] = useState<ReportState>({
    observations: '',
    emissions: [
      { id: '1', source: 'POINT SOURCE A-01', concentration: 450, massFlowRate: 12.4, timestamp: '12:45 PM' },
      { id: '2', source: 'FUGITIVE VENT B-12', concentration: 1205, massFlowRate: 84.2, timestamp: '12:45 PM' },
      { id: '3', source: 'COMPRESSOR SEAL C-04', concentration: 12, massFlowRate: 0.5, timestamp: '12:45 PM' },
    ],
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleAddEmission = (newEmission: Omit<Emission, 'id' | 'timestamp'>) => {
    const emission: Emission = {
      ...newEmission,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setReport(prev => ({ ...prev, emissions: [...prev.emissions, emission] }));
    setIsModalOpen(false);
  };

  const handleDeleteEmission = (id: string) => {
    setReport(prev => ({
      ...prev,
      emissions: prev.emissions.filter(e => e.id !== id)
    }));
  };

  const handleFinalize = async () => {
    setIsFinalizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this environmental compliance report:
      Observations: ${report.observations}
      Emissions: ${JSON.stringify(report.emissions)}
      Provide a brief summary and potential compliance risks. Keep it professional and concise.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiAnalysis(response.text || 'Report finalized successfully.');
    } catch (error) {
      console.error("AI Analysis failed", error);
      setAiAnalysis("Report finalized. (AI analysis unavailable)");
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Fixed Header */}
      <header className="sticky top-0 z-40 bg-background-dark/80 backdrop-blur-md border-b border-primary/10 px-4 py-3 flex items-center justify-between">
        <button className="flex items-center text-primary transition-colors hover:opacity-70">
          <span className="material-icons text-2xl">chevron_left</span>
          <span className="text-lg">Inspections</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">Observations</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-grow p-5 space-y-8 pb-32 overflow-y-auto custom-scrollbar">
        {/* Observation Section */}
        <ObservationSection 
          value={report.observations} 
          onChange={(val) => setReport(prev => ({ ...prev, observations: val }))} 
        />

        {/* Emissions List Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">factory</span>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Emissions</h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-semibold active:scale-95 transition-transform shadow-lg shadow-primary/20"
          >
            <span className="material-icons text-sm">add</span>
            <span>Emisiones</span>
          </button>
        </div>

        {/* Emissions List Container */}
        <div className="bg-slate-800/30 rounded-xl p-2 border border-slate-800 space-y-2">
          {report.emissions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic text-sm">
              No emission data logged yet.
            </div>
          ) : (
            report.emissions.map(emission => (
              <EmissionCard 
                key={emission.id} 
                emission={emission} 
                onDelete={() => handleDeleteEmission(emission.id)} 
              />
            ))
          )}
        </div>

        {/* AI Analysis Result */}
        {aiAnalysis && (
          <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons text-primary text-sm">psychology</span>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">AI Summary</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{aiAnalysis}</p>
            <button 
              onClick={() => setAiAnalysis(null)} 
              className="mt-2 text-xs text-slate-500 hover:text-slate-300 underline"
            >
              Clear Analysis
            </button>
          </div>
        )}
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-background-dark/95 backdrop-blur-md border-t border-white/5 p-6 space-y-3">
        <button 
          onClick={handleFinalize}
          disabled={isFinalizing}
          className={`w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 ${isFinalizing ? 'opacity-50 cursor-wait' : ''}`}
        >
          <span className="text-base uppercase tracking-wider">
            {isFinalizing ? 'Processing Report...' : 'Finalize Report'}
          </span>
          <span className="material-symbols-outlined">{isFinalizing ? 'sync' : 'task_alt'}</span>
        </button>
        <p className="text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">
          Environmental Compliance Management
        </p>
      </footer>

      {/* Modal Backdrop & Modal */}
      {isModalOpen && (
        <EmissionModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleAddEmission}
        />
      )}
    </div>
  );
};

export default App;
