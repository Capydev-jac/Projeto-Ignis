/// <reference types="leaflet.markercluster" />

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

const getColor = (valor: number): string => {
  if (valor >= 0.9) return '#800026';
  if (valor >= 0.7) return '#BD0026';
  if (valor >= 0.5) return '#FC4E2A';
  if (valor >= 0.3) return '#FD8D3C';
  if (valor >= 0.1) return '#FEB24C';
  return '#FFEDA0';
};

const brasilBounds: L.LatLngBoundsExpression = [
  [-34.0, -74.0],
  [5.3, -32.4],
];

const MapComponent: React.FC<MapComponentProps> = ({ tipo, dados }) => {

  // 🔥 Agrupamento apenas se for risco de fogo
  const dadosAgrupados = useMemo(() => {
    if (tipo !== 'risco') return [];

    const grupos: {
      [estado: string]: {
        totalRisco: number;
        totalLat: number;
        totalLng: number;
        count: number;
        exemplo: BaseDado;
      };
    } = {};

    dados
      .filter(d => d.tipo === 'risco' && d.risco_fogo >= 0)
      .forEach(d => {
        const estado = d.estado;
        if (!grupos[estado]) {
          grupos[estado] = {
            totalRisco: 0,
            totalLat: 0,
            totalLng: 0,
            count: 0,
            exemplo: d,
          };
        }
        grupos[estado].totalRisco += d.risco_fogo;
        grupos[estado].totalLat += d.latitude;
        grupos[estado].totalLng += d.longitude;
        grupos[estado].count += 1;
      });

    return Object.entries(grupos).map(([estado, grupo]) => ({
      estado,
      media: grupo.totalRisco / grupo.count,
      latitude: grupo.totalLat / grupo.count,
      longitude: grupo.totalLng / grupo.count,
      exemplo: grupo.exemplo,
    }));
  }, [dados, tipo]);

  // 🔥 Risco de fogo agrupado sem cluster
  const riscoMarkers = useMemo(() => (
    dadosAgrupados.map((g, idx) => (
      <Marker
        key={idx}
        position={[g.latitude, g.longitude]}
        icon={L.divIcon({
          className: 'custom-icon',
          html: `
            <div style="
              background-color: ${getColor(g.media)};
              border: 2px solid ${getColor(g.media)};
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: black;
              font-weight: bold;
              font-size: 12px;
              border: 1px solid black;
              ">
              ${g.media.toFixed(2)}
            </div>
          `,
        })}
      >
        <Popup>
          <div>
            <strong>Estado:</strong> {g.estado}<br />
            <strong>Média do Risco de Fogo:</strong> {g.media.toFixed(3)}
          </div>
        </Popup>
      </Marker>
    ))
  ), [dadosAgrupados]);

  // 🔥 Marcadores com cluster para os outros tipos
  const markersComCluster = useMemo(() => (
    <MarkerClusterGroup
      iconCreateFunction={(cluster: L.MarkerCluster) => {
        const count = cluster.getChildCount();
        let color = "#FEB24C";
        if (count >= 100) color = "#800026";
        else if (count >= 50) color = "#BD0026";
        else if (count >= 20) color = "#FC4E2A";
        else if (count >= 10) color = "#FD8D3C";

        return L.divIcon({
          html: `
            <div style="
              background-color: ${color};
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              border: 1px solid black;">
              ${count}
            </div>`,
          className: 'marker-cluster-custom',
          iconSize: L.point(40, 40, true),
        });
      }}
    >
      {dados
        .filter(d => (d.frp ?? d.risco_fogo) >= 0)
        .map((item, idx) => (
          <Marker
            key={idx}
            position={[item.latitude, item.longitude]}
            icon={L.divIcon({
              className: 'custom-icon',
              html: `
                <div style="
                  background-color: ${getColor(item.frp ?? item.risco_fogo)};
                  border: 2px solid ${getColor(item.frp ?? item.risco_fogo)};
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;">
                </div>
              `,
            })}
          >
            <Popup>
              <strong>Tipo:</strong> {tipo}<br />
              <strong>Data:</strong> {new Date(item.data).toLocaleDateString()}<br />
              <strong>Estado:</strong> {item.estado}<br />
              <strong>Bioma:</strong> {item.bioma}<br />
              {item.risco_fogo !== undefined && (
                <>
                  <strong>Risco de Fogo:</strong> {item.risco_fogo}<br />
                </>
              )}
              {item.frp !== undefined && (
                <>
                  <strong>FRP:</strong> {item.frp}<br />
                </>
              )}
              {item.dia_sem_chuva && (
                <>
                  <strong>Dias sem chuva:</strong> {item.dia_sem_chuva}<br />
                  <strong>Precipitação:</strong> {item.precipitacao}<br />
                </>
              )}
            </Popup>
          </Marker>
        ))}
    </MarkerClusterGroup>
  ), [dados, tipo]);

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
        {tipo === 'risco' ? riscoMarkers : markersComCluster}
      </MapContainer>
    </MapaContainer>
  );
};

export default MapComponent;
