import * as L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import type { FeatureCollection } from 'geojson';
import { BaseDado } from '../entities/BaseDado';

interface Props {
  dados: BaseDado[];
  filtros: {
    estado?: string;
    bioma: string;
    inicio?: string;
    fim?: string;
    local?: 'estado' | 'bioma';
  };
  tipo: '' | 'risco' | 'foco_calor' | 'area_queimada';
}

const brasilBounds: L.LatLngBoundsExpression = [
  [-34.0, -74.0],
  [5.3, -32.4],
];

const getColor = (valor: number): string => {
  if (valor >= 0.8) return '#800026';
  if (valor >= 0.6) return '#BD0026';
  if (valor >= 0.4) return '#FC4E2A';
  if (valor >= 0.2) return '#FD8D3C';
  if (valor > 0) return '#FED976';
  return '#FFEDA0';
};

const estadosPorId: Record<string, string> = {
  '11': 'RO',
  '12': 'AC',
  '13': 'AM',
  '14': 'RR',
  '15': 'PA',
  '16': 'AP',
  '17': 'TO',
  '21': 'MA',
  '22': 'PI',
  '23': 'CE',
  '24': 'RN',
  '25': 'PB',
  '26': 'PE',
  '27': 'AL',
  '28': 'SE',
  '29': 'BA',
  '31': 'MG',
  '32': 'ES',
  '33': 'RJ',
  '35': 'SP',
  '41': 'PR',
  '42': 'SC',
  '43': 'RS',
  '50': 'MS',
  '51': 'MT',
  '52': 'GO',
  '53': 'DF'
};


const centroEstadosPorId: Record<string, { lat: number; lon: number }> = {
  '11': { lat: -10.9, lon: -62.8 },
  '12': { lat: -9.02, lon: -70.81 },
  '13': { lat: -3.47, lon: -65.10 },
  '14': { lat: 2.05, lon: -61.39 },
  '15': { lat: -3.79, lon: -52.48 },
  '16': { lat: 1.41, lon: -51.77 },
  '17': { lat: -10.25, lon: -48.25 },
  '21': { lat: -5.42, lon: -45.44 },
  '22': { lat: -7.06, lon: -42.82 },
  '23': { lat: -5.20, lon: -39.50 },
  '24': { lat: -5.81, lon: -36.59 },
  '25': { lat: -7.12, lon: -36.72 },
  '26': { lat: -8.38, lon: -37.86 },
  '27': { lat: -9.57, lon: -36.78 },
  '28': { lat: -10.57, lon: -37.45 },
  '29': { lat: -12.96, lon: -41.55 },
  '31': { lat: -18.10, lon: -44.38 },
  '32': { lat: -19.19, lon: -40.34 },
  '33': { lat: -22.84, lon: -43.15 },
  '35': { lat: -23.55, lon: -46.64 },
  '41': { lat: -24.89, lon: -51.55 },
  '42': { lat: -27.45, lon: -50.95 },
  '43': { lat: -30.01, lon: -53.43 },
  '50': { lat: -20.51, lon: -54.54 },
  '51': { lat: -12.64, lon: -55.42 },
  '52': { lat: -15.98, lon: -49.86 },
  '53': { lat: -15.83, lon: -47.86 }
};

const centroBiomasPorId: Record<string, { lat: number; lon: number }> = {
  '1': { lat: -3, lon: -60 },   // Amazônia
  '2': { lat: -9, lon: -40 },   // Caatinga
  '3': { lat: -12, lon: -47 },  // Cerrado
  '4': { lat: -20, lon: -43 },  // Mata Atlântica
  '5': { lat: -30, lon: -53 },  // Pampa
  '6': { lat: -17, lon: -57 }   // Pantanal
};

const MapComponent: React.FC<Props> = ({ dados, filtros, tipo }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [geojsonBiomas, setGeojsonBiomas] = useState<FeatureCollection | null>(null);
  const [geojsonAreaQueimada, setGeojsonAreaQueimada] = useState<FeatureCollection | null>(null);
  const [geojsonBrasil, setGeojsonBrasil] = useState<FeatureCollection | null>(null);
  const [geojsonEstados, setGeojsonEstados] = useState<FeatureCollection | null>(null);

  // 🔥 Carrega GeoJSON
  useEffect(() => {
  fetch('http://localhost:3000/geojson/biomas.geojson')
    .then(res => res.json())
    .then(setGeojsonBiomas)
    .catch(err => console.error('Erro ao carregar biomas:', err));

    fetch('http://localhost:3000/geojson/estados.geojson')
  .then(res => res.json())
  .then(setGeojsonEstados);

fetch('http://localhost:3000/geojson/brasil.geojson')
  .then(res => res.json())
  .then(setGeojsonBrasil);
  }, []);

  // 🔥 Carrega Área Queimada (por mês)
  useEffect(() => {
  if (tipo === 'area_queimada' && filtros.inicio && !filtros.fim) {
    fetch(`http://localhost:3000/geojson/area_queimada/${filtros.inicio}.geojson`)
      .then(res => {
        if (!res.ok) throw new Error('GeoJSON não encontrado');
        return res.json();
      })
      .then(setGeojsonAreaQueimada)
      .catch(() => setGeojsonAreaQueimada(null));
  } else {
    setGeojsonAreaQueimada(null);
  }
}, [tipo, filtros.inicio, filtros.fim]);

  // 🔥 Zoom nos estados
  useEffect(() => {
    if (!mapRef.current) return;
    const centro = centroEstadosPorId[filtros.estado ?? ''];
    if (centro) {
      mapRef.current.flyTo([centro.lat, centro.lon], 6);
    } else {
      mapRef.current.flyTo([-15.78, -47.92], 4);
    }
  }, [filtros.estado]);

  return (
    <MapContainer
      center={[-15.78, -47.92]}
      zoom={4}
      minZoom={5}
      style={{ height: '90vh', width: '78%', marginLeft: '21%', marginTop: '85px', borderRadius: '10px' }}
      maxBounds={brasilBounds}
      maxBoundsViscosity={1.0}
      whenReady={() => {
        if (mapRef.current === null && typeof window !== 'undefined') {
          // @ts-ignore
          const leafletMap = (document.querySelector('.leaflet-container') as any)?._leaflet_map;
          if (leafletMap) mapRef.current = leafletMap;
        }
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

      {geojsonBrasil && (
        <GeoJSON data={geojsonBrasil} style={{ color: 'black', weight: 3, fillOpacity: 0 }} />
      )}

      {geojsonEstados && filtros.estado && (
        <GeoJSON
          key={filtros.estado}
          data={{
            ...geojsonEstados,
            features: geojsonEstados.features.filter(
              (f) => String(f.properties?.id_estado) === filtros.estado
            )
          } as FeatureCollection}
          style={{ color: '#0066FF', weight: 2, fillOpacity: 0.05 }}
        />
      )}

      {geojsonBiomas && filtros.bioma && (
  <GeoJSON
    key={filtros.bioma}
    data={{
      ...(geojsonBiomas as FeatureCollection),
      features: (geojsonBiomas as FeatureCollection).features.filter(
        (f) => String(f.properties?.id) === filtros.bioma
      )
    }}
    style={{ color: 'green', weight: 2, fillOpacity: 0.05 }}
  />
)}

      {tipo === 'risco' && dados.map((item, idx) => {
        const agrupamento = filtros.local === 'bioma' ? 'bioma' : 'estado';

        const id = agrupamento === 'bioma'
          ? item.bioma?.toString()
          : item.estado?.toString();

        const centro = agrupamento === 'bioma'
          ? centroBiomasPorId[id ?? '']
          : centroEstadosPorId[id ?? ''];

        const pos = centro ?? { lat: -15.78, lon: -47.92 };

        return (
          <Marker
            key={idx}
            position={[pos.lat, pos.lon]}
            icon={L.divIcon({
              className: 'custom-icon',
              html: `<div style="background-color: ${getColor(item.media ?? 0)}; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${(item.media ?? 0).toFixed(2)}</div>`
            })}
          >
            <Popup>
              <strong>{agrupamento === 'bioma' ? 'Bioma' : 'Estado'}:</strong>
              {agrupamento === 'bioma'
                ? item.bioma
                : estadosPorId[item.estado?.toString() || ''] || item.estado}<br />
              <strong>Média Risco de Fogo:</strong> {(item.media ?? 0).toFixed(2)}<br />
              <strong>Total de Pontos:</strong> {item.total ?? 0}
            </Popup>
          </Marker>
        );
      })}

      {(tipo === 'foco_calor' || (tipo === 'area_queimada' && filtros.fim)) && dados.map((item, idx) => (
        <Marker
          key={idx}
          position={[
            item.latitude ?? -15.78,
            item.longitude ?? -47.92
          ]}
          icon={L.divIcon({
            className: 'custom-icon',
            html: `<div style="background-color: ${getColor(item.risco_fogo ?? 0)}; width: 20px; height: 20px; border-radius: 50%;"></div>`
          })}
        >
          <Popup>
            <strong>Data:</strong> {new Date(item.data).toLocaleDateString()}<br />
            <strong>Estado:</strong> {item.estado}<br />
            <strong>Bioma:</strong> {item.bioma}<br />
            <strong>Risco de Fogo:</strong> {item.risco_fogo ?? 0}<br />
            {item.frp !== undefined && <><strong>FRP:</strong> {item.frp}<br /></>}
            {item.dia_sem_chuva && (
              <>
                <strong>Dias sem chuva:</strong> {item.dia_sem_chuva}<br />
                <strong>Precipitação:</strong> {item.precipitacao}<br />
              </>
            )}
          </Popup>
        </Marker>
      ))}

      {geojsonAreaQueimada && tipo === 'area_queimada' && !filtros.fim && (
        <GeoJSON
          data={geojsonAreaQueimada}
          style={{ color: 'red', weight: 2, fillOpacity: 0.3 }}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
