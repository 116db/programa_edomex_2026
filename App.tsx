import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import AssetItem from './components/AssetItem';
import ExcelUploader from './components/ExcelUploader';
import ObservationsScreen from './components/ObservationsScreen';
import { DaySchedule, Emission } from './types';

const App: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>(() => {
    try {
      const saved = localStorage.getItem('scheduleData');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load from local storage", e);
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (scheduleData.length > 0) {
      localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    }
  }, [scheduleData]);

  const handleDataLoaded = (data: DaySchedule[]) => {
    setScheduleData(data);
    localStorage.setItem('scheduleData', JSON.stringify(data));
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de borrar los datos y cargar un nuevo archivo?")) {
      setScheduleData([]);
      localStorage.removeItem('scheduleData');
    }
  };

  const getDayDate = (day: number) => {
    const dates: Record<number, string> = {
      1: "Primer dia de trabajo",
      2: "Segundo dia de trabajo",
      3: "Tercer dia de trabajo",
      4: "Cuarto dia de trabajo",
      5: "Quinto dia de trabajo",
      6: "Sexto dia de trabajo",
      7: "Septimo dia de trabajo",
      8: "Octavo dia de trabajo"
    };
    return dates[day] || `Día ${day}`;
  };

  // Filter the data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return scheduleData;

    const lowerQuery = searchQuery.toLowerCase();

    return scheduleData.map(day => ({
      ...day,
      assets: day.assets.filter(asset =>
        asset.id.toLowerCase().includes(lowerQuery) ||
        asset.description.toLowerCase().includes(lowerQuery)
      )
    })).filter(day => day.assets.length > 0);
  }, [scheduleData, searchQuery]);

  // Handle checking/unchecking items
  const handleToggle = (id: string) => {
    setScheduleData(prevData => prevData.map(day => ({
      ...day,
      assets: day.assets.map(asset => {
        if (asset.id === id) {
          return { ...asset, completed: !asset.completed };
        }
        return asset;
      })
    })));
  };

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const handleOpenObservations = (id: string) => {
    setSelectedAssetId(id);
  };

  const handleSaveObservations = (assetId: string, observations: string, emissions: Emission[]) => {
    setScheduleData(prevData => prevData.map(day => ({
      ...day,
      assets: day.assets.map(asset => {
        if (asset.id === assetId) {
          return { ...asset, observations, emissions };
        }
        return asset;
      })
    })));
  };

  const selectedAsset = useMemo(() => {
    if (!selectedAssetId) return null;
    for (const day of scheduleData) {
      const asset = day.assets.find(a => a.id === selectedAssetId);
      if (asset) return asset;
    }
    return null;
  }, [scheduleData, selectedAssetId]);

  if (selectedAsset) {
    return (
      <ObservationsScreen
        asset={selectedAsset}
        onBack={() => setSelectedAssetId(null)}
        onSave={handleSaveObservations}
      />
    );
  }

  if (scheduleData.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <ExcelUploader onDataLoaded={handleDataLoaded} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <div className="relative">
        <Header onReset={handleReset} />
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="flex-1 pb-24 overflow-y-auto relative">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-blue-200">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-20">search_off</span>
            <p>No se encontraron resultados</p>
          </div>
        ) : (
          filteredData.map((dayGroup) => {
            const completedCount = dayGroup.assets.filter(a => a.completed).length;
            const totalCount = dayGroup.assets.length;

            return (
              <section key={dayGroup.day} className="mb-1">
                <div className="sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-y border-border px-4 py-2.5 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-200 text-sm">calendar_today</span>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                      DÍA {dayGroup.day} <span className="text-blue-200 font-normal">/ {getDayDate(dayGroup.day)}</span>
                    </h2>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border 
                    ${completedCount === totalCount
                      ? 'bg-secondary/10 text-secondary border-secondary/20'
                      : 'bg-primary/10 text-primary border-primary/20'}`}>
                    {completedCount} / {totalCount} COMPLETED
                  </div>
                </div>

                <div className="flex flex-col">
                  {dayGroup.assets.map((asset, index) => (
                    <AssetItem
                      key={asset.id}
                      asset={asset}
                      index={index}
                      globalIndex={index}
                      onToggle={handleToggle}
                      onOpenObservations={handleOpenObservations}
                    />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};

export default App;
