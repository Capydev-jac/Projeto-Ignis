import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapaContainer } from '../styles/MapaStyle'; // 🔥 Padrão centralizado

// Coordenadas para limitar o mapa ao Brasil
const brasilBounds: L.LatLngBoundsExpression = [
  [-33.8689, -73.9855],
  [5.2718, -34.7931],
];

const MapaVazio: React.FC = () => {
  return (
    <MapaContainer>
      <MapContainer
        center={[-15.78, -47.92]}
        zoom={4}
        maxBounds={brasilBounds}
        maxBoundsViscosity={1.0}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
      </MapContainer>
    </MapaContainer>
  );
};

export default MapaVazio;
