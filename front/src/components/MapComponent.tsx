import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"; // Importa o React Leaflet
import "leaflet/dist/leaflet.css"; // Importa o CSS do Leaflet
import L from "leaflet"; // Importa o Leaflet puro
import markerIcon from "../img/preto.png"; // Ícone personalizado que você colocou no projeto

// 🔥 Criação do ícone customizado
const customIcon = new L.Icon({
  iconUrl: markerIcon,        // Caminho do ícone
  iconSize: [25, 26],          // Tamanho do ícone
  iconAnchor: [12, 41],        // Ponto de ancoragem (para o ícone alinhar certinho)
  popupAnchor: [1, -34],       // Ponto onde o popup vai abrir em relação ao ícone
});

// 🔥 Tipos dos dados recebidos
interface Risco {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
}

// 🔥 "Foco" herda de "Risco", mas adiciona mais informações
interface Foco extends Risco {
  dia_sem_chuva?: string;      // Campo opcional
  preciptação?: string;        // Campo opcional
  frp?: string;                // Campo opcional
}

// 🔥 Nova classe filha de Foco
interface are_queimada extends Foco {
}

// 🔥 Props do componente aceitam Risco, FocoAreaQueimada ou FocoDetalhado
interface Props {
  dados: (Risco | are_queimada | Foco)[]; // Inclui a nova classe filha


}

// 🔥 Definindo os limites do mapa para o Brasil
const brasilBounds: L.LatLngBoundsExpression = [
  [-34.0, -74.0], // canto inferior esquerdo (latitude, longitude)
  [5.3, -32.4],   // canto superior direito
];

// 🔥 Componente principal do Mapa
const MapComponent: React.FC<Props> = ({ dados }) => {
  return (
    <MapContainer
      center={[-15.78, -47.92]} // Centro do Brasil
      zoom={4}                  // Zoom inicial
      style={{ height: "100%", width: "100%" }} // Estilo do mapa ocupando toda área
      maxBounds={brasilBounds}  // Restringe o mapa aos limites do Brasil
      maxBoundsViscosity={1.0}  // Impede que o usuário arraste para fora
    >
      {/* 🔥 Camada de mapa do OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* 🔥 Loop sobre todos os dados para criar markers */}
      {dados.map((item, idx) => (
        <Marker
          key={idx}                                    // Chave única para cada marker
          position={[item.latitude, item.longitude]}  // Posição do marker
          icon={customIcon}                            // Ícone personalizado
        >
          <Popup>
            {/* 🔥 Mostra informações básicas */}
            <strong>Data:</strong> {new Date(item.data).toLocaleDateString()}<br />
            <strong>Estado:</strong> {item.estado}<br />
            <strong>Bioma:</strong> {item.bioma}<br />
            <strong>Risco de Fogo:</strong> {item.risco_fogo}<br />

            {/* 🔥 Se o objeto tiver campos extras, mostra também */}
            {('dia_sem_chuva' in item) && (
              <>
                <strong>Dias sem chuva:</strong> {item.dia_sem_chuva}<br />
                <strong>Preciptação:</strong> {item.preciptação}<br />
                <strong>FRP:</strong> {item.frp}<br />
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

// 🔥 Exporta o componente para ser usado em outras partes do projeto
export default MapComponent;
