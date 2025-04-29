// App.tsx

// Importação das dependências e componentes
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // 👈 pegar a URL
import Header from './components/Header';
import Abas from './components/Abas';
import FiltroMapa from './components/FiltroMapa';
import FiltroGrafico from './components/FiltroGrafico';
import Mapa from './components/Mapa';        // Mapa com dados
import MapaVazio from './components/MapaVazio'; // 👈 Mapa sem dados
import Grafico from './components/Grafico';
import styled from 'styled-components';

// Componente principal do App
const App: React.FC = () => {
  const [ativo, setAtivo] = useState('mapa'); // "mapa" é o valor inicial
  const location = useLocation(); // 👈 Pegamos a URL atual

  const handleClick = (tipo: string) => {
    setAtivo(tipo);
  };

  const [filtros, setFiltros] = useState({
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

        {/* 🔥 AQUI mudamos o mapa dependendo da URL */}
        {ativo === 'mapa' ? (
          location.pathname === '/risco' ? (
            <Mapa tipo={'risco'} />
          ) : location.pathname === '/foco_calor' ? (
            <Mapa tipo={'foco_calor'} />
          ) : ( location.pathname === '/area_queimada' ? (
            <Mapa tipo={'area_queimada'} />
          ) :
            <MapaVazio />
          )
        ) : (
          <Grafico />
        )}
      </MainContent>
    </AppContainer>
  );
};

export default App;

// Estilização do componente App
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
