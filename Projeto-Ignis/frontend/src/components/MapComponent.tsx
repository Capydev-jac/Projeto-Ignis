import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { BaseDado } from '../entities/BaseDado';
import { MapaContainer } from '../styles/MapaStyle';

interface MapComponentProps {
  tipo: '' | 'risco' | 'foco_calor' | 'area_queimada';
  dados: BaseDado[];
}

const getColor = (item: BaseDado): string => {
  const valor = item.frp ?? item.risco_fogo;
  if (valor >= 1000) return '#800026';
  if (valor >= 500) return '#BD0026';
  if (valor >= 200) return '#E31A1C';
  if (valor >= 100) return '#FC4E2A';
  if (valor >= 50) return '#FD8D3C';
  if (valor >= 20) return '#FEB24C';
  if (valor > 0) return '#FED976';
  return '#FFEDA0';
};

const brasilBounds: L.LatLngBoundsExpression = [
  [-34.0, -74.0],
  [5.3, -32.4],
];

const MapComponent: React.FC<MapComponentProps> = ({ tipo, dados }) => {
  const markers = useMemo(() =>
    dados.map((item, idx) => (
      <Marker
        key={idx}
        position={[item.latitude, item.longitude]}
        icon={L.divIcon({
          className: 'custom-icon',
          html: `<div style="background-color: ${getColor(item)}; width: 20px; height: 20px; border-radius: 50%;"></div>`
        })}
      >
        <Popup>
          <strong>Data:</strong> {new Date(item.data).toLocaleDateString()}<br />
          <strong>Estado:</strong> {item.estado}<br />
          <strong>Bioma:</strong> {item.bioma}<br />
          <strong>Risco de Fogo:</strong> {item.risco_fogo}<br />
          {item.frp !== undefined && <><strong>FRP:</strong> {item.frp}<br /></>}
          {item.dia_sem_chuva && (
            <>
              <strong>Dias sem chuva:</strong> {item.dia_sem_chuva}<br />
              <strong>Precipitação:</strong> {item.precipitacao}<br />
            </>
          )}
        </Popup>
      </Marker>
    )), [dados]);

  return (
    <MapaContainer>
      <MapContainer
        center={[-15.78, -47.92]}
        zoom={4}
        maxBounds={brasilBounds}
        maxBoundsViscosity={1.0}
        style={{ width: '100%', height: '100%' }} // ⬅️ deixa aqui só pra garantir ocupação do container
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <MarkerClusterGroup
          iconCreateFunction={(cluster: any) => {
            const count = cluster.getChildCount();
            let color = "#FEB24C";
            if (count >= 100) color = "#800026";
            else if (count >= 50) color = "#BD0026";
            else if (count >= 20) color = "#FC4E2A";
            else if (count >= 10) color = "#FD8D3C";

            return L.divIcon({
              html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${count}</div>`,
              className: 'marker-cluster-custom',
              iconSize: L.point(40, 40, true)
            });
          }}
        >
          {markers}
        </MarkerClusterGroup>
      </MapContainer>
    </MapaContainer>
  );
};

export default MapComponent;
