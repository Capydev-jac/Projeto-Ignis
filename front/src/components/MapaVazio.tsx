import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

// Coordenadas para limitar o mapa ao Brasil
const brasilBounds: L.LatLngBoundsExpression = [
  [-33.8689, -73.9855], // canto inferior esquerdo (Sul, Oeste)
  [5.2718, -34.7931],   // canto superior direito (Norte, Leste)
];

const MapaVazio: React.FC = () => {
  return (
    <MapaContainer>
      <MapContainer
        center={[-15.78, -47.92]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        maxBounds={brasilBounds}    // ✅ Delimitando ao Brasil
        maxBoundsViscosity={1.0}     // ✅ Não permite arrastar para fora
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </MapaContainer>
  );
};

export default MapaVazio;

const MapaContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
`;
