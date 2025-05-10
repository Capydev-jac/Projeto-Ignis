import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import MapComponent from './MapComponent';
import FiltroMapa from './FiltroMapa';

// Tipagem da ocorrência (o dado que o mapa precisa)
interface Ocorrencia {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  dia_sem_chuva?: string;
  precipitacao?: string;
  frp?: string;
}

// Tipagem dos filtros usados na busca
interface Filtros {
  tipo: string;
  estado: string;
  bioma: string;
  inicio: string;
  fim: string;
}

// Props recebidas pelo componente Mapa
interface MapaProps {
  tipo: string; // tipo inicial ("risco", "foco_calor" ou "area_queimada")
}

// Componente principal
const Mapa: React.FC<MapaProps> = ({ tipo }) => {
  // Estado para armazenar os dados recebidos da API
  const [dados, setDados] = useState<Ocorrencia[]>([]);

  // Estado para armazenar os filtros aplicados
  const [filtros, setFiltros] = useState<Filtros>({
    tipo: tipo, // inicializa com o tipo passado na prop
    estado: '',
    bioma: '',
    inicio: '',
    fim: ''
  });

  // Atualiza o filtro "tipo" sempre que a prop "tipo" mudar
  useEffect(() => {
    setFiltros((prev) => ({
      ...prev,
      tipo: tipo,
    }));
  }, [tipo]); // Vai ser chamado toda vez que o tipo mudar

  // Monta os parâmetros de consulta para a URL da API
  const montarQueryParams = () => {
    const params = new URLSearchParams();
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.bioma) params.append('bioma', filtros.bioma);
    if (filtros.inicio) params.append('inicio', filtros.inicio);
    if (filtros.fim) params.append('fim', filtros.fim);
    return params.toString();
  };

  // Sempre que os filtros mudam, busca os dados atualizados
  useEffect(() => {
    const fetchData = async () => {
      const query = montarQueryParams();
      // CORREÇÃO: escolher corretamente a URL com base no tipo
      const url =
        tipo === 'risco'
          ? `/api/risco${query ? `?${query}` : ''}`
          : tipo === 'foco_calor'
          ? `/api/foco_calor${query ? `?${query}` : ''}`
          : tipo === 'area_queimada'
          ? `/api/area_queimada${query ? `?${query}` : ''}`
          : '';

      console.log('URL gerada:', url); // Verifique a URL gerada

      try {
       /* const res = await fetch(url);*/
       const res = await fetch(`http://localhost:3000${url}`);
        const data = await res.json();
        console.log('Dados recebidos:', data); // Verifique os dados recebidos
        setDados(data); // Atualiza o estado com os dados recebidos
      } catch (error) {
        console.error('Erro ao buscar dados filtrados:', error);
      }
    };

    fetchData();
  }, [filtros, tipo]); // 🔥 Adicionado "tipo" como dependência para buscar quando tipo mudar

  return (
    <>
      {/* Componente de filtro, permite o usuário escolher estado, bioma, datas */}
      <FiltroMapa onFiltrar={setFiltros} />

      {/* Container estilizado que ocupa a tela toda */}
      <MapaContainer>
        {/* Componente de mapa que recebe os dados para desenhar */}
        <MapComponent dados={dados} />
      </MapaContainer>
    </>
  );
};

export default Mapa;

// Estilo do container do mapa
const MapaContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0; // Garante que o mapa fique no fundo
`;
