// Grafico.tsx
import React from 'react';
import styled from 'styled-components';

const Grafico: React.FC = () => {
  return (
    <GraficoContainer>
      <Mensagem>Disponível em Breve!</Mensagem>
    </GraficoContainer>
  );
};

export default Grafico;

// Estilo para o contêiner do gráfico
const GraficoContainer = styled.div`
  width: 153vh;
  height: 90vh;
  padding: 20px;
  border-radius: 8px;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: gray;
  border-top-right-radius: 8px;
  z-index: 1;
  margin-top: 0.5%;
  margin-left: 22%;
  position: fixed;

  display: flex;               /* Flexbox para centralizar */
  justify-content: center;     /* Centraliza horizontalmente */
  align-items: center;         /* Centraliza verticalmente */
`;

// Estilo para o texto
const Mensagem = styled.p`
  font-size: 2rem;             /* Aumenta o tamanho da fonte */
  color: white;                /* Melhor contraste */
  font-weight: 600;            /* Deixa mais destacado */
`;
