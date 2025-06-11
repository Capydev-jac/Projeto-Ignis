import * as L from 'leaflet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import type { FeatureCollection } from 'geojson';

interface BaseDado {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  frp?: number;
  dia_sem_chuva?: string;
  precipitacao?: number;
  tipo: 'risco' | 'foco' | 'area_queimada';
}

interface Props {
  dados: BaseDado[];
  filtros: {
    estado?: string;
    bioma: string;
    inicio?: string;
    fim?: string;
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

const centroEstados: Record<string, { lat: number; lon: number }> = {
  'Acre': { lat: -9.02, lon: -70.81 },
  'Alagoas': { lat: -9.57, lon: -36.78 },
  'Amapá': { lat: 1.41, lon: -51.77 },
  'Amazonas': { lat: -3.47, lon: -65.10 },
  'Bahia': { lat: -12.96, lon: -41.55 },
  'Ceará': { lat: -5.20, lon: -39.50 },
  'Distrito Federal': { lat: -15.83, lon: -47.86 },
  'Espírito Santo': { lat: -19.19, lon: -40.34 },
  'Goiás': { lat: -15.98, lon: -49.86 },
  'Maranhão': { lat: -5.42, lon: -45.44 },
  'Mato Grosso': { lat: -12.64, lon: -55.42 },
  'Mato Grosso do Sul': { lat: -20.51, lon: -54.54 },
  'Minas Gerais': { lat: -18.10, lon: -44.38 },
  'Pará': { lat: -3.79, lon: -52.48 },
  'Paraíba': { lat: -7.12, lon: -36.72 },
  'Paraná': { lat: -24.89, lon: -51.55 },
  'Pernambuco': { lat: -8.38, lon: -37.86 },
  'Piauí': { lat: -7.72, lon: -43.00 },
  'Rio de Janeiro': { lat: -22.84, lon: -43.15 },
  'Rio Grande do Norte': { lat: -5.81, lon: -36.59 },
  'Rio Grande do Sul': { lat: -30.01, lon: -53.43 },
  'Rondônia': { lat: -10.90, lon: -62.80 },
  'Roraima': { lat: 2.05, lon: -61.39 },
  'Santa Catarina': { lat: -27.45, lon: -50.95 },
  'São Paulo': { lat: -23.55, lon: -46.64 },
  'Sergipe': { lat: -10.57, lon: -37.45 },
  'Tocantins': { lat: -10.25, lon: -48.25 }
};

const centroEstadosPorId: Record<string, { lat: number; lon: number }> = {
  '12': centroEstados['Acre'],
  '27': centroEstados['Alagoas'],
  '16': centroEstados['Amapá'],
  '13': centroEstados['Amazonas'],
  '29': centroEstados['Bahia'],
  '23': centroEstados['Ceará'],
  '32': centroEstados['Espírito Santo'],
  '52': centroEstados['Goiás'],
  '21': centroEstados['Maranhão'],
  '51': centroEstados['Mato Grosso'],
  '50': centroEstados['Mato Grosso do Sul'],
  '31': centroEstados['Minas Gerais'],
  '15': centroEstados['Pará'],
  '25': centroEstados['Paraíba'],
  '41': centroEstados['Paraná'],
  '26': centroEstados['Pernambuco'],
  '22': centroEstados['Piauí'],
  '33': centroEstados['Rio de Janeiro'],
  '24': centroEstados['Rio Grande do Norte'],
  '43': centroEstados['Rio Grande do Sul'],
  '11': centroEstados['Rondônia'],
  '14': centroEstados['Roraima'],
  '42': centroEstados['Santa Catarina'],
  '35': centroEstados['São Paulo'],
  '28': centroEstados['Sergipe'],
  '17': centroEstados['Tocantins'],
  '53': centroEstados['Distrito Federal']
};

const normalizar = (str: string) =>
  str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const MapComponent: React.FC<Props> = ({ dados, filtros, tipo }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [geojsonBiomas, setGeojsonBiomas] = useState<FeatureCollection | null>(null);
  const [geojsonAreaQueimada, setGeojsonAreaQueimada] = useState<FeatureCollection | null>(null);
  const [geojsonBrasil, setGeojsonBrasil] = useState<FeatureCollection | null>(null);
  const [geojsonEstados, setGeojsonEstados] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch('/biomas.geojson')
      .then(res => res.json())
      .then(setGeojsonBiomas)
      .catch(err => console.error('Erro ao carregar biomas:', err));
  }, []);

  useEffect(() => {
    if (tipo === 'area_queimada' && filtros.inicio && !filtros.fim) {
      fetch(`/geojson/area_queimada/${filtros.inicio}.geojson`)
        .then(res => {
          if (!res.ok) throw new Error('GeoJSON não encontrado');
          return res.json();
        })
        .then(setGeojsonAreaQueimada)
        .catch(err => {
          console.error('Erro ao carregar área queimada por mês:', err);
          setGeojsonAreaQueimada(null);
        });
    } else {
      setGeojsonAreaQueimada(null);
    }
  }, [tipo, filtros.inicio, filtros.fim]);

  useEffect(() => {
    fetch('/api/brasil')
      .then(res => res.json())
      .then(setGeojsonBrasil)
      .catch(err => console.error('Erro ao carregar brasil.geojson:', err));
  }, []);

  useEffect(() => {
    fetch('/api/estados')
      .then(res => res.json())
      .then(setGeojsonEstados)
      .catch(err => console.error('Erro ao carregar estados.geojson:', err));
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    if (filtros.estado) {
      const centro = centroEstadosPorId[filtros.estado];
      if (centro) {
        mapRef.current.flyTo([centro.lat, centro.lon], 6);
      }
    } else {
      mapRef.current.flyTo([-15.78, -47.92], 4);
    }
  }, [filtros.estado]);

  const biomaIdToNome: Record<number, string> = {
    1: 'Amazônia', 2: 'Caatinga', 3: 'Cerrado', 4: 'Mata Atlântica', 5: 'Pampa', 6: 'Pantanal'
  };

  const estadoIdToSigla: Record<string, string> = {
    '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA', '16': 'AP',
    '17': 'TO', '21': 'MA', '22': 'PI', '23': 'CE', '24': 'RN', '25': 'PB',
    '26': 'PE', '27': 'AL', '28': 'SE', '29': 'BA', '31': 'MG', '32': 'ES',
    '33': 'RJ', '35': 'SP', '41': 'PR', '42': 'SC', '43': 'RS', '50': 'MS',
    '51': 'MT', '52': 'GO', '53': 'DF'
  };

  const contornoEstadoSelecionado = useMemo(() => {
    if (!geojsonEstados || !filtros.estado) return null;
    const sigla = estadoIdToSigla[filtros.estado];
    if (!sigla) return null;
    const filtrado = geojsonEstados.features.filter((f) => {
      const id = typeof f.id === 'string' ? f.id.toUpperCase() : undefined;
      const propSigla = (f.properties?.SIGLA || f.properties?.PK_sigla) as string | undefined;
      return id === sigla || propSigla?.toUpperCase() === sigla;
    });
    if (filtrado.length === 0) return null;
    return { ...geojsonEstados, features: filtrado };
  }, [geojsonEstados, filtros.estado]);

  const contornoFiltrado = useMemo(() => {
    if (!geojsonBiomas || !filtros.bioma) return null;
    const nomeBioma = biomaIdToNome[Number(filtros.bioma)];
    if (!nomeBioma) return null;
    const filtrados = geojsonBiomas.features.filter(f => {
      const nome = f.properties?.bioma;
      return nome && normalizar(nome) === normalizar(nomeBioma);
    });
    return { ...geojsonBiomas, features: filtrados };
  }, [geojsonBiomas, filtros.bioma]);

  const dadosRiscoPorEstado = useMemo(() => {
    if (tipo !== 'risco') return [];
    const agrupado = dados.reduce<Record<string, { total: number; count: number }>>((acc, item) => {
      if (item.risco_fogo < 0) return acc;
      if (!acc[item.estado]) acc[item.estado] = { total: 0, count: 0 };
      acc[item.estado].total += item.risco_fogo;
      acc[item.estado].count++;
      return acc;
    }, {});
    return Object.entries(agrupado).map(([estado, { total, count }]) => ({
      estado,
      media: total / count,
      latitude: centroEstados[estado]?.lat ?? -15.78,
      longitude: centroEstados[estado]?.lon ?? -47.92
    }));
  }, [dados, tipo]);

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

      {contornoEstadoSelecionado && (
        <GeoJSON
          key={filtros.estado}
          data={contornoEstadoSelecionado}
          style={() => ({
            color: '#0066FF',
            weight: 3,
            fillOpacity: 0.05
          })}
        />
      )}

      {geojsonBrasil && (
        <GeoJSON data={geojsonBrasil} style={{ color: 'black', weight: 3, fillOpacity: 0 }} />
      )}

      {tipo === 'risco' && dadosRiscoPorEstado.map((item, idx) => (
        <Marker
          key={idx}
          position={[item.latitude, item.longitude]}
          icon={L.divIcon({
            className: 'custom-icon',
            html: `<div style="background-color: ${getColor(item.media)}; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${item.media.toFixed(2)}</div>`
          })}
        >
          <Popup>
            <strong>Estado:</strong> {item.estado}<br />
            <strong>Média Risco de Fogo:</strong> {item.media.toFixed(2)}
          </Popup>
        </Marker>
      ))}

      {(tipo === 'foco_calor' || (tipo === 'area_queimada' && filtros.fim)) && dados.map((item, idx) => (
        <Marker
          key={idx}
          position={[item.latitude, item.longitude]}
          icon={L.divIcon({
            className: 'custom-icon',
            html: `<div style="background-color: ${getColor(item.risco_fogo)}; width: 20px; height: 20px; border-radius: 50%;"></div>`
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
      ))}

      {geojsonAreaQueimada && tipo === 'area_queimada' && !filtros.fim && (
        <GeoJSON
          data={geojsonAreaQueimada}
          style={() => ({
            color: 'red',
            weight: 2,
            fillOpacity: 0.3
          })}
        />
      )}

      {contornoFiltrado && (
        <GeoJSON
          key={filtros.bioma}
          data={contornoFiltrado}
          style={() => ({
            color: 'black',
            weight: 3,
            fillOpacity: 0
          })}
        />
      )}
    </MapContainer>
  );
};

export default MapComponent;
