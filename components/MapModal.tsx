import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet marker icon missing
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    coordinates: [number, number]; // [lat, lng]
    title: string;
}

// Helper to center map when coordinates change
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 15);
    }, [center, map]);
    return null;
};

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, coordinates, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col items-center">
                {/* Header */}
                <div className="w-full px-4 py-3 flex justify-between items-center bg-surface border-b border-border">
                    <h3 className="font-bold text-white truncate pr-4">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* Map Container */}
                <div className="w-full h-[400px] relative">
                    <MapContainer
                        center={coordinates}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={coordinates}>
                            <Popup>
                                {title}
                            </Popup>
                        </Marker>
                        <MapUpdater center={coordinates} />
                    </MapContainer>
                </div>

                {/* Footer actions */}
                <div className="w-full p-4 bg-surface border-t border-border flex justify-end gap-2">
                    <button
                        onClick={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates[0]},${coordinates[1]}`;
                            window.open(url, '_blank');
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-colors border border-slate-700"
                    >
                        <span className="material-symbols-outlined text-[18px]">directions</span>
                        Google Maps
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapModal;
