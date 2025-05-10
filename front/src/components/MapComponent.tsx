import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "../img/preto.png";

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

interface Foco extends Risco {
  dia_sem_chuva?: string;
  precipitacao?: number;
}
interface AreaQueimada extends Foco {}

// 🔥 Props do componente aceitam qualquer um dos três tipos
interface Props {
  dados: (Risco | Foco | AreaQueimada)[];
}

// 🔴 Função que retorna uma cor baseada no tipo de dado (risco, area queimada ou foco de calor)
const getColor = (item: Risco | AreaQueimada | Foco): string => {
  // Se tiver FRP, usa ele como prioridade
  if ("frp" in item && item.frp !== undefined) {
    const frp = item.frp;

    if (frp >= 50) return "#800026";   // Vermelho escuro
    if (frp >= 30) return "#BD0026";   // Vermelho forte
    if (frp >= 15) return "#FC4E2A";   // Laranja forte
    if (frp >= 2) return "#FD8D3C";    // Laranja médio
    return "#FEB24C";                  // Amarelo
  }

  // Se não tiver FRP, usa o risco_fogo
  const valor = item.risco_fogo;
  if (valor > 1000) return "#800026"; // Vermelho escuro
    if (valor > 500) return "#BD0026";  // Vermelho forte
    if (valor > 200) return "#E31A1C";  // Vermelho médio
    if (valor > 100) return "#FC4E2A";  // Laranja forte
    if (valor > 50) return "#FD8D3C";   // Laranja médio
    if (valor > 20) return "#FEB24C";   // Amarelo escuro
    if (valor > 0) return "#FED976";    // Amarelo claro
    return "#FFEDA0";                   // Amarelo pálido
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
      center={[-15.78, -47.92]} // Centro do mapa no Brasil
      zoom={4} // Zoom inicial
      style={{ height: "100%", width: "100%" }} // Estilo para ocupar a tela inteira
      maxBounds={brasilBounds} // Limita o movimento do mapa para o Brasil
      maxBoundsViscosity={1.0} // Evita que o mapa se mova além dos limites definidos
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {dados.map((item, idx) => (
        <Marker
          key={idx}
          position={[item.latitude, item.longitude]}
          // Usando divIcon para customizar os ícones com base na cor
          icon={L.divIcon({
            className: "custom-icon",
            html: `<div style="background-color: ${getColor(item)}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
          })}
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
                <strong>Dias sem chuva:</strong> {(item as Foco|AreaQueimada).dia_sem_chuva}<br />
                <strong>Precipitação:</strong> {(item as Foco|AreaQueimada).precipitacao}<br />
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
