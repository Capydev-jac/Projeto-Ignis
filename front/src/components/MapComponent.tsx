import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "../img/preto.png";

// Ícone personalizado
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [25, 26],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Tipagem dos dados recebidos
interface Risco {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
}

interface Props {
  dados: Risco[];
}
interface Foco {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  dia_sem_chuva: string;
  preciptação: string;
  frp: string;
}

interface Props {
  dados: Foco[];
}

// Definição dos limites do Brasil
const brasilBounds: L.LatLngBoundsExpression = [
  [-34.0, -74.0], // canto inferior esquerdo (Sul, Oeste)
  [5.3, -32.4],   // canto superior direito (Norte, Leste)
];

const MapComponent: React.FC<Props> = ({ dados }) => {
  return (
    <MapContainer
      center={[-15.78, -47.92]}    // Centro do Brasil
      zoom={4}
      style={{ height: "100%", width: "100%" }}
      maxBounds={brasilBounds}     // 🔥 Delimita para o Brasil
      maxBoundsViscosity={1.0}      // 🔥 Não deixa sair das bordas
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {dados.map((risco, idx) => (
        <Marker
          key={idx}
          position={[risco.latitude, risco.longitude]}
          icon={customIcon}
        >
          <Popup>
          <strong>Data:</strong> {new Date(risco.data).toLocaleDateString()}<br/>
           <strong>Estado:</strong> {risco.estado}<br />
            <strong>Bioma:</strong> {risco.bioma}<br />
            <strong>Risco de Fogo:</strong> {risco.risco_fogo}
          </Popup>
        </Marker>
      ))}

{dados.map((foco, idx) => (
        <Marker
          key={idx}
          position={[foco.latitude, foco.longitude]}
          icon={customIcon}
        >
          <Popup>
          <strong>Data:</strong> {new Date(foco.data).toLocaleDateString()}<br/>
           <strong>Estado:</strong> {foco.estado}<br />
            <strong>Bioma:</strong> {foco.bioma}<br />
            <strong>Risco de Fogo:</strong> {foco.risco_fogo}<br/> 
            <strong>Dias_sem_chuva:</strong> {foco.dia_sem_chuva}<br/> 
            <strong>Preciptação :</strong> {foco.preciptação}<br/> 
            <strong>FRP:</strong> {foco.frp}<br/> 



          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
};

export default MapComponent;
