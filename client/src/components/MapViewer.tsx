'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Fix Leaflet icon issue
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface Shop {
    _id: string;
    name: string;
    category: string;
    location: string;
    latitude?: number;
    longitude?: number;
    image?: string;
}

interface MapViewerProps {
    shops: Shop[];
}

export default function MapViewer({ shops }: MapViewerProps) {
    const router = useRouter();
    const defaultCenter: [number, number] = [-7.4279, 111.0188]; // Sragen Center

    return (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-lg border border-border z-0 relative">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {shops.map((shop) => (
                    shop.latitude && shop.longitude ? (
                        <Marker
                            key={shop._id}
                            position={[shop.latitude, shop.longitude]}
                        >
                            <Popup>
                                <div className="min-w-[150px] text-center">
                                    <h3 className="font-bold text-base mb-1">{shop.name}</h3>
                                    <p className="text-xs text-gray-600 mb-2">{shop.category}</p>
                                    <button
                                        onClick={() => router.push(`/toko/${shop._id}`)}
                                        className="text-white bg-[#8b5a2b] px-3 py-1 rounded text-xs hover:bg-[#a0522d] transition w-full"
                                    >
                                        Lihat Detail
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    ) : null
                ))}
            </MapContainer>
        </div>
    );
}
