// Estrutura base otimizada para Mapa.tsx com foco em performance e redução de INP
import React, { useEffect, useState, useTransition } from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

// Importa dinamicamente o componente de mapa com suspense
const MapComponent = React.lazy(() => import('./MapComponent'));
const FiltroMapa = React.lazy(() => import('./FiltroMapa'));

interface Ocorrencia {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  dia_sem_chuva?: string;
  precipitacao?: number;
  frp?: number;
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
  const [filtros, setFiltros] = useState<Filtros>({ tipo, estado: '', bioma: '', inicio: '', fim: '' });
  const [isPending, startTransition] = useTransition();

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
      const url =
        tipo === 'risco' ? `/api/risco?${query}` :
        tipo === 'foco_calor' ? `/api/foco_calor?${query}` :
        tipo === 'area_queimada' ? `/api/area_queimada?${query}` : '';

      try {
        const res = await fetch(`http://localhost:3000${url}`);
        const rawData = await res.json();

        if (Array.isArray(rawData)) {
          startTransition(() => {
            setDados(
              rawData.map((item) => ({
                ...item,
                frp: item.frp !== undefined ? Number(item.frp) : undefined,
                precipitacao: item.precipitacao !== undefined ? Number(item.precipitacao) : undefined,
              }))
            );
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [filtros, tipo]);

  return (
    <>
      <React.Suspense fallback={<div>Carregando filtros...</div>}>
        <FiltroMapa onFiltrar={setFiltros} />
      </React.Suspense>

      <MapaContainer>
        <React.Suspense fallback={<div>Carregando mapa...</div>}>
          <MapComponent dados={dados} />
        </React.Suspense>
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
