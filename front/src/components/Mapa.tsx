import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MapComponent from './MapComponent';
import FiltroMapa from './FiltroMapa';

interface Ocorrencia {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
}

interface Filtros {
  tipo: string;
  estado: string;
  bioma: string;
  inicio: string;
  fim: string;
}

interface MapaProps {
  tipo: string;
}

const Mapa: React.FC<MapaProps> = ({ tipo }) => {
  const [dados, setDados] = useState<Ocorrencia[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({
    tipo: tipo,
    estado: '',
    bioma: '',
    inicio: '',
    fim: ''
  });

  useEffect(() => {
    setFiltros((prev) => ({
      ...prev,
      tipo: tipo,
    }));
  }, [tipo]);

  const montarQueryParams = () => {
    const params = new URLSearchParams();
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.bioma) params.append('bioma', filtros.bioma);
    if (filtros.inicio) params.append('inicio', filtros.inicio);
    if (filtros.fim) params.append('fim', filtros.fim);
    return params.toString();
  };

  useEffect(() => {
    const fetchData = async () => {
      const query = montarQueryParams();
      const url = tipo === 'risco' 
    ? (query ? `/api/risco?${query}` : '/api/risco')
    : (query ? `/api/foco_calor?${query}` : '/api/foco_calor');

      try {
        const res = await fetch(url);
        const data = await res.json();
        setDados(data);
      } catch (error) {
        console.error('Erro ao buscar dados filtrados:', error);
      }
    };
    fetchData();
  }, [filtros]);

  return (
    <>
      <FiltroMapa onFiltrar={setFiltros} />
      <MapaContainer>
        <MapComponent dados={dados} />
      </MapaContainer>
    </>
  );
};

export default Mapa;

const MapaContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
`;
