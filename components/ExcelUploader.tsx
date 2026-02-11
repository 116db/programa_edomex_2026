import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { DaySchedule, TechnicalAsset } from '../types';

interface ExcelUploaderProps {
    onDataLoaded: (data: DaySchedule[]) => void;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({ onDataLoaded }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

                if (jsonData.length < 2) {
                    throw new Error("El archivo parece estar vacío o no tiene el formato correcto.");
                }

                const headers = jsonData[0] as string[];
                const rows = jsonData.slice(1);

                // Helper to find column index by keyword
                const findCol = (keywords: string[]) =>
                    headers.findIndex(h => keywords.some(k => h?.toString().toLowerCase().includes(k.toLowerCase())));

                // EDOMEX Specific Mapping based on file analysis
                // Headers: ["RUTA ", "Inspecciones", "Residencia...", "Ubicación Técnica", "Denominación de Usuario", ...]
                const idxDay = findCol(['ruta', 'dia']); // Col 0
                const idxId = findCol(['ubicación', 'ubicacion', 'técnica', 'tecnica']); // Col 3
                const idxDesc = findCol(['denominación', 'denominacion', 'usuario', 'descripcion']); // Col 4
                const idxCoord = findCol(['coordenadas', 'latitud', 'gps']); // Col 8

                if (idxId === -1 || idxDesc === -1) {
                    throw new Error("No se encontraron las columnas 'Ubicación Técnica' o 'Denominación de Usuario'.");
                }

                let currentDay = 1;

                const parsedAssetsWithDay: { day: number; asset: TechnicalAsset }[] = rows.map((row, index) => {
                    // Skip rows that are actually repeated headers
                    if (row[idxId] === 'Ubicación Técnica' || row[idxId] === 'Ubicacion Tecnica') return null;

                    // Skip empty rows (require at least ID or Desc)
                    if (!row[idxId] && !row[idxDesc]) return null;

                    let coords = idxCoord !== -1 ? row[idxCoord] : '';
                    if (typeof coords === 'string') {
                        coords = coords.replace(/["\n\r]/g, "").trim();
                    }

                    // Fill-down logic for Day
                    if (idxDay !== -1) {
                        const dayVal = row[idxDay];
                        if (typeof dayVal === 'number') {
                            currentDay = dayVal;
                        } else if (typeof dayVal === 'string' && dayVal.trim() !== '') {
                            // Try to parse "Dia 1", "01", etc.
                            const match = dayVal.match(/\d+/);
                            if (match) currentDay = parseInt(match[0], 10);
                        }
                        // If null/empty, keep currentDay (fill down)
                    }

                    return {
                        day: currentDay,
                        asset: {
                            id: row[idxId]?.toString() || `ITEM-${index}`,
                            description: row[idxDesc]?.toString() || 'Sin descripción',
                            classType: 'GEN',
                            coordinates: coords?.toString() || '',
                            completed: false
                        }
                    };
                }).filter(a => a !== null) as { day: number; asset: TechnicalAsset }[];

                // Group by Day
                const groups: Record<number, TechnicalAsset[]> = {};
                parsedAssetsWithDay.forEach(item => {
                    if (!groups[item.day]) groups[item.day] = [];
                    groups[item.day].push(item.asset);
                });

                const schedule: DaySchedule[] = Object.keys(groups).map(dayStr => ({
                    day: parseInt(dayStr, 10),
                    assets: groups[parseInt(dayStr, 10)]
                })).sort((a, b) => a.day - b.day);
                onDataLoaded(schedule);

            } catch (err: any) {
                console.error(err);
                setError(err.message || "Error al procesar el archivo.");
            } finally {
                setLoading(false);
            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-surface rounded-xl border border-border shadow-lg m-4">
            <span className="material-symbols-outlined text-6xl text-primary mb-4">upload_file</span>
            <h2 className="text-xl font-bold text-white mb-2">Cargar Programa de Trabajo</h2>
            <p className="text-slate-400 mb-6 text-sm">Sube el archivo Excel (.xlsx) con la ruta de EDOMEX.</p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <label className={`
        flex items-center gap-2 px-6 py-3 rounded-full font-medium cursor-pointer transition-all
        ${loading ? 'bg-slate-700 text-slate-400' : 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20'}
      `}>
                {loading ? (
                    <>Processing...</>
                ) : (
                    <>
                        <span className="material-symbols-outlined">folder_open</span>
                        Seleccionar Excel
                    </>
                )}
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={loading}
                />
            </label>
        </div>
    );
};

export default ExcelUploader;
