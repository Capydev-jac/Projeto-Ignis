// Versão com clusterização de marcadores usando react-leaflet-markercluster
import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

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
  const [modoAgrupamento, setModoAgrupamento] = useState<'estado' | 'bioma'>('estado');
  const [filtroSelecionado, setFiltroSelecionado] = useState<string | null>(null);

  const normalizar = (str: string) => str.trim().toLowerCase();

  const dadosAreaQueimada = useMemo(() => dados.filter(d => d.tipo === 'area_queimada'), [dados]);

  const opcoes = useMemo(
    () => [...new Set(dadosAreaQueimada.map(d => normalizar(modoAgrupamento === 'estado' ? d.estado : d.bioma)))],
    [dadosAreaQueimada, modoAgrupamento]
  );

  useEffect(() => {
    if (!filtroSelecionado && opcoes.length > 3) {
      setFiltroSelecionado(opcoes[0]);
    }
  }, [opcoes]);

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
    <>
      <div style={{ padding: '1rem' }}>
        <label>Agrupar por:</label>
        <select
          value={modoAgrupamento}
          onChange={e => {
            setModoAgrupamento(e.target.value as 'estado' | 'bioma');
            setFiltroSelecionado(null);
          }}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="estado">Estado</option>
          <option value="bioma">Bioma</option>
        </select>

        <select
          value={filtroSelecionado ?? ''}
          onChange={e => setFiltroSelecionado(e.target.value || null)}
          style={{ marginLeft: '1rem' }}
        >
          <option value="">Selecione um {modoAgrupamento}</option>
          {opcoes.map(op => (
            <option key={op} value={op}>{op.charAt(0).toUpperCase() + op.slice(1)}</option>
          ))}
        </select>
      </div>

      <MapContainer
        center={[-15.78, -47.92]}
        zoom={4}
        style={{ height: '90vh', width: '100%' }}
        maxBounds={brasilBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

<MarkerClusterGroup
  iconCreateFunction={(cluster) => {
    const count = cluster.getChildCount();
    let color = "#FEB24C"; // padrão

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
    </>
  );
};

export default MapComponent;
