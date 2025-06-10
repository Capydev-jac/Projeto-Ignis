import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { MarkerCluster } from 'leaflet';


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
}

const getColor = (item: BaseDado): string => {
  if (item.frp !== undefined) {
    if (item.frp >= 50) return '#800026';
    if (item.frp >= 30) return '#BD0026';
    if (item.frp >= 15) return '#FC4E2A';
    if (item.frp >= 2) return '#FD8D3C';
    return '#FEB24C';
  }
  const valor = item.risco_fogo;
  if (valor > 1000) return '#800026';
  if (valor > 500) return '#BD0026';
  if (valor > 200) return '#E31A1C';
  if (valor > 100) return '#FC4E2A';
  if (valor > 50) return '#FD8D3C';
  if (valor > 20) return '#FEB24C';
  if (valor > 0) return '#FED976';
  return '#FFEDA0';
};

const brasilBounds: L.LatLngBoundsExpression = [
  [-34.0, -74.0],
  [5.3, -32.4],
];

const MapComponent: React.FC<Props> = ({ dados }) => {
  const [geojsonBiomas, setGeojsonBiomas] = useState<FeatureCollection | null>(null);
  const [biomasSelecionados, setBiomasSelecionados] = useState<string[]>([]);

  useEffect(() => {
    fetch('/biomas.geojson')
      .then(res => res.json())
      .then(data => {
        console.log('✅ GeoJSON carregado:', data);
        setGeojsonBiomas(data);
      })
      .catch(err => console.error('❌ Erro ao carregar biomas:', err));
  }, []);

  const removerAcentos = useCallback((str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(),
    []
  );

  const normalizar = useCallback((str: string) => removerAcentos(str.trim()), [removerAcentos]);



  const opcoesBiomas = useMemo(
    () => Array.from(new Set(dados.map(d => normalizar(d.bioma)))).sort(),
    [dados, normalizar]
  );

  const toggleBioma = (bioma: string) => {
    setBiomasSelecionados(prev =>
      prev.includes(bioma)
        ? prev.filter(b => b !== bioma)
        : [...prev, bioma]
    );
  };

  const limparBiomas = () => setBiomasSelecionados([]);

  const contornosSelecionados = useMemo(() => {
    if (!geojsonBiomas || biomasSelecionados.length === 0) return null;

    const isBiomaFeature = (feat: Feature): feat is Feature<Geometry, { bioma: string }> =>
      !!feat.properties && typeof feat.properties.bioma === 'string';

    const filtrados = geojsonBiomas.features.filter(isBiomaFeature).filter(feat => {
      const nome = normalizar(feat.properties.bioma);
      return biomasSelecionados.includes(nome);
    });

    return { ...geojsonBiomas, features: filtrados };
  }, [geojsonBiomas, biomasSelecionados, normalizar]);

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
    )),
    [dados]
  );

  return (
    <div style={{ display: 'flex' }}>
      {/* Mapa */}
      <div style={{ flex: 1 }}>
        <<MapContainer center={[-15.78, -47.92]} zoom={4} minZoom={4} style={{ height: '89%', width: '78%', marginLeft: '400px', marginTop: '80px', borderRadius: '10px' }}
          maxBounds={brasilBounds}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <MarkerClusterGroup
            iconCreateFunction={(cluster: MarkerCluster) => {
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

          {contornosSelecionados && (
            <GeoJSON
              key={biomasSelecionados.sort().join(',') || 'vazio'}
              data={contornosSelecionados}
              style={() => ({
                color: 'black',
                weight: 3,
                fillOpacity: 0
              })}
            />
          )}
        </MapContainer>
      </div>

      {/* Painel lateral de checkboxes */}
      <div style={{
        width: '300px',
        padding: '1rem',
        background: '#f0f0f0',
        borderLeft: '1px solid #ccc',
        marginTop: '80px',
        color: 'black' // ✅ Aplica a cor preta ao texto do painel
      }}>
        <h3 style={{ marginBottom: '1rem', color: 'black' }}>Filtrar Biomas:</h3>
        {opcoesBiomas.map(b => {
          const nomeOriginal = dados.find(d => normalizar(d.bioma) === b)?.bioma || b;
          return (
            <label
              key={b}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '0.5rem',
                color: 'black' // ✅ cor preta para o texto do label
              }}
            >
              <input
                type="checkbox"
                checked={biomasSelecionados.includes(b)}
                onChange={() => toggleBioma(b)}
                style={{ marginRight: '0.5rem' }}
              />
              {nomeOriginal}
            </label>
          );
        })}

        {biomasSelecionados.length > 0 && (
          <button
            onClick={limparBiomas}
            style={{
              marginTop: '1rem',
              padding: '6px 10px',
              background: '#fff',
              color: 'black', // ✅ texto preto no botão
              border: '1px solid #000',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Limpar seleção
          </button>
        )}
      </div>

    </div>
  );
};

export default MapComponent;
