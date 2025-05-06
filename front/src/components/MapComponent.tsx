import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "../img/preto.png";

// 🔥 Ícone customizado
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [25, 26],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// 🔥 Tipos base
interface Risco {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  frp?: number; // opcional para todos
}

interface AreaQueimada extends Risco {}

interface Foco extends AreaQueimada {
  dia_sem_chuva?: string;
  precipitacao?: number;
}

// 🔥 Props do componente aceitam qualquer um dos três tipos
interface Props {
  dados: (Risco | Foco | AreaQueimada)[];
}

// 🔥 Limites do mapa do Brasil
const brasilBounds: L.LatLngBoundsExpression = [
  [-34.0, -74.0],
  [5.3, -32.4],
];

// 🔥 Componente principal
const MapComponent: React.FC<Props> = ({ dados }) => {
  return (
    <MapContainer
      center={[-15.78, -47.92]}
      zoom={4}
      style={{ height: "100%", width: "100%" }}
      maxBounds={brasilBounds}
      maxBoundsViscosity={1.0}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {dados.map((item, idx) => (
        <Marker
          key={idx}
          position={[item.latitude, item.longitude]}
          icon={customIcon}
        >
          <Popup>
            <strong>Data:</strong> {new Date(item.data).toLocaleDateString()}<br />
            <strong>Estado:</strong> {item.estado}<br />
            <strong>Bioma:</strong> {item.bioma}<br />
            <strong>Risco de Fogo:</strong> {item.risco_fogo}<br />
            {item.frp !== undefined && (
              <>
                <strong>FRP:</strong> {item.frp}<br />
              </>
            )}
            {"dia_sem_chuva" in item && (
              <>
                <strong>Dias sem chuva:</strong> {(item as Foco).dia_sem_chuva}<br />
                <strong>Precipitação:</strong> {(item as Foco).precipitacao}<br />
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
