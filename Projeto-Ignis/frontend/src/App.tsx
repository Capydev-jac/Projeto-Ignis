import React, { Suspense, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Header from './components/Header';
import Abas from './components/Abas';
import FiltroMapa from './components/FiltroMapa';
import FiltroGrafico from './components/FiltroGrafico';
import Grafico from './components/Grafico';

import { FiltrosMapa as TipoFiltroMapa } from './entities/FiltrosMapa';
import { FiltrosGrafico as TipoFiltroGrafico } from './entities/FiltrosGrafico';

// Lazy load do componente de mapa
const Mapa = React.lazy(() => import('./components/Mapa'));

const App: React.FC = () => {
  const navigate = useNavigate();

  const [filtrosMapa, setFiltrosMapa] = useState<TipoFiltroMapa>({
    tipo: '',
    estado: '',
    bioma: '',
    inicio: '',
    fim: '',
  });

 const [filtrosGrafico, setFiltrosGrafico] = useState<TipoFiltroGrafico>({
  tipo: 'risco',           // ✅ agora está completo
  local: 'estado',
  estado: '',
  bioma: '',
  inicio: '',
  fim: '',
});

  const handleFiltrarMapa = (filtros: TipoFiltroMapa) => {
    setFiltrosMapa(filtros);
  };

  const handleAplicarGrafico = (filtros: TipoFiltroGrafico) => {
    setFiltrosGrafico(filtros);
  };

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Abas ativo="mapa" onClick={(rota) => navigate(rota === 'mapa' ? '/' : '/grafico')} />
                <FiltroMapa onFiltrar={handleFiltrarMapa} />
                <Suspense fallback={<div>Carregando mapa...</div>}>
                <Mapa tipo={filtrosMapa.tipo} filtros={filtrosMapa} />
                </Suspense>
              </>
            }
          />
          <Route
            path="/risco"
            element={
              <>
                <Abas ativo="mapa" onClick={(rota) => navigate(rota === 'mapa' ? '/risco' : '/grafico')} />
                <FiltroMapa onFiltrar={handleFiltrarMapa} />
                <Suspense fallback={<div>Carregando mapa...</div>}>
                  <Mapa tipo="risco" filtros={filtrosMapa} />
                </Suspense>
              </>
            }
          />
          <Route
            path="/foco_calor"
            element={
              <>
                <Abas ativo="mapa" onClick={(rota) => navigate(rota === 'mapa' ? '/foco_calor' : '/grafico')} />
                <FiltroMapa onFiltrar={handleFiltrarMapa} />
                <Suspense fallback={<div>Carregando mapa...</div>}>
                  <Mapa tipo="foco_calor" filtros={filtrosMapa} />
                </Suspense>
              </>
            }
          />
          <Route
            path="/area_queimada"
            element={
              <>
                <Abas ativo="mapa" onClick={(rota) => navigate(rota === 'mapa' ? '/area_queimada' : '/grafico')} />
                <FiltroMapa onFiltrar={handleFiltrarMapa} />
                <Suspense fallback={<div>Carregando mapa...</div>}>
                  <Mapa tipo="area_queimada" filtros={filtrosMapa} />
                </Suspense>
              </>
            }
          />
          <Route
            path="/grafico"
            element={
              <>
                <Abas ativo="grafico" onClick={(rota) => navigate(rota === 'grafico' ? '/grafico' : '/')} />
                <FiltroGrafico onAplicar={handleAplicarGrafico} />
                <Grafico filtros={filtrosGrafico} />
              </>
            }
          />
        </Routes>
      </MainContent>
    </AppContainer>
  );
};

export default App;

// 🎨 Estilos
const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;
