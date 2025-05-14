// App.tsx

import React, { useState, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Abas from './components/Abas';
import FiltroMapa from './components/FiltroMapa';
import FiltroGrafico from './components/FiltroGrafico';
import MapaVazio from './components/MapaVazio';
import Grafico from './components/Grafico';
import styled from 'styled-components';

// Lazy loading do Mapa
const Mapa = React.lazy(() => import('./components/Mapa'));

const App: React.FC = () => {
  const [ativo, setAtivo] = useState('mapa');
  const location = useLocation();

  const handleClick = (tipo: string) => {
    setAtivo(tipo);
  };

  const [, setFiltros] = useState({
    tipo: 'Focos',
    estado: '',
    bioma: '',
    inicio: '',
    fim: ''
  });

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <ContentContainer>
          <Abas onClick={handleClick} ativo={ativo} />
          {ativo === 'mapa' ? (
            <FiltroMapa onFiltrar={setFiltros} />
          ) : (
            <FiltroGrafico />
          )}
        </ContentContainer>

        {/* Conteúdo com lazy-loading */}
        <Suspense fallback={<div style={{ padding: '2rem' }}>Carregando o mapa...</div>}>
          {ativo === 'mapa' ? (
            location.pathname === '/risco' ? (
              <Mapa tipo="risco" />
            ) : location.pathname === '/foco_calor' ? (
              <Mapa tipo="foco_calor" />
            ) : location.pathname === '/area_queimada' ? (
              <Mapa tipo="area_queimada" />
            ) : (
              <MapaVazio />
            )
          ) : (
            <Grafico />
          )}
        </Suspense>
      </MainContent>
    </AppContainer>
  );
};

export default App;

// Estilos
const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

const MainContent = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;
