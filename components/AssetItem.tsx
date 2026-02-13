import React, { useState, useMemo } from 'react';
import { TechnicalAsset } from '../types';
import MapModal from './MapModal';
import { parseDMS } from '../utils/coordinates';

interface AssetItemProps {
  asset: TechnicalAsset;
  index: number;
  onToggle: (id: string) => void;
  globalIndex: number;
  onOpenObservations: (id: string) => void;
}

const AssetItem: React.FC<AssetItemProps> = ({ asset, onToggle, globalIndex, onOpenObservations }) => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const coordinates = useMemo(() => parseDMS(asset.coordinates), [asset.coordinates]);
  const hasValidCoordinates = coordinates !== null;

  const tagLabel = useMemo(() => {
    if (asset.id.includes('ESM')) return 'ESM';
    const parts = asset.id.split('-');
    return parts[parts.length - 1] || asset.classType;
  }, [asset.id, asset.classType]);

  return (
    <>
      <div
        className={`group flex items-start gap-4 px-4 py-4 border-b border-border bg-background transition-all duration-200 
        ${asset.completed ? 'bg-opacity-50' : 'hover:bg-surface'}`}
      >
        {/* Checkbox Area */}
        <div className="pt-1 flex-shrink-0">
          <label className="relative flex items-center justify-center cursor-pointer group p-1">
            <input
              type="checkbox"
              checked={asset.completed}
              onChange={() => onToggle(asset.id)}
              className="peer sr-only"
            />

            <div className={`w-5 h-5 border-2 rounded-sm transition-all duration-200 ease-out
              ${asset.completed
                ? 'bg-primary border-primary'
                : 'border-slate-500 hover:border-primary'
              }`}>
            </div>
            <span className={`material-symbols-outlined absolute text-white text-sm pointer-events-none transform transition-transform duration-200
              ${asset.completed ? 'scale-100' : 'scale-0'}`}>
              check
            </span>
          </label>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className={`text-base font-mono font-bold ${asset.completed ? 'text-blue-300' : 'text-primary'}`}>
              {String(globalIndex + 1).padStart(2, '0')}
            </span>
            <h3 className={`text-base font-bold font-mono tracking-tight truncate transition-colors duration-200
              ${asset.completed ? 'text-blue-300 line-through decoration-blue-400' : 'text-white'}`}>
              {asset.id}
            </h3>
          </div>
          <p className={`text-xs leading-relaxed transition-colors duration-200 line-clamp-2
            ${asset.completed ? 'text-blue-200' : 'text-blue-100'}`}>
            {asset.description}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-1.5 py-0.5 rounded bg-blue-900/50 text-[10px] font-medium text-blue-100 border border-blue-700">
              {tagLabel}
            </span>
            {/* Coordinate preview if valid */}
            {hasValidCoordinates && (
              <span className="text-[10px] text-blue-200 font-mono hidden sm:inline">
                {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
              </span>
            )}
          </div>
        </div>

        {/* Action Area */}
        <div className="flex-shrink-0 self-center flex gap-1 items-center">

          {/* Observaciones */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenObservations(asset.id);
            }}
            className="text-secondary font-bold px-2 py-1 rounded hover:bg-secondary/10 transition-colors uppercase tracking-wider hidden sm:block text-xs"
          >
            Observaciones
          </button>




          {/* External Google Maps Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(asset.coordinates)}`;
              window.open(url, '_blank');
            }}
            className={`p-2 rounded-full transition-colors 
            ${asset.completed
                ? 'text-slate-700 cursor-not-allowed'
                : 'text-blue-200 hover:text-white hover:bg-blue-800'}`}
            title="Cómo llegar (Google Maps)"
          >
            <span className="material-symbols-outlined text-[24px]">directions</span>
          </button>
        </div>
      </div>

      {hasValidCoordinates && (
        <MapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          coordinates={coordinates}
          title={asset.description}
        />
      )}
    </>
  );
};

export default AssetItem;