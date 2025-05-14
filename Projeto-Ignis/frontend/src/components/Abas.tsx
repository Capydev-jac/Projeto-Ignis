import React, { ReactNode } from 'react';
import styled from 'styled-components';

type AbasProps = {
  onClick: (tipo: string) => void;
  ativo: string;
  children?: ReactNode;
};

const Abas: React.FC<AbasProps> = ({ onClick, ativo, children }) => {
  return (
    <AbasContainer>
      <Button $ativo={ativo === 'mapa'} onClick={() => onClick('mapa')}>
        Mapa
      </Button>
      <Button $ativo={ativo === 'grafico'} onClick={() => onClick('grafico')}>
        Gráfico
      </Button>
      <div>{children}</div>
    </AbasContainer>
  );
};

export default Abas;

const AbasContainer = styled.div`
  display: flex;
  gap: 5px;
  justify-content: flex-start;
  width: 80%;
  max-width: 350px;
  margin-top: 10px;
  z-index: 1;
  margin-top: 0.5%;
  position: fixed;
`;

const Button = styled.button<{ $ativo: boolean }>`
  padding: 8px 15px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
  transition: background-color 0.3s, color 0.3s;
  background-color: ${(props) => (props.$ativo ? '#d32f2f' : '#ff9595')};

  &:hover {
    background-color: ${(props) => (props.$ativo ? '#c62828' : '#ff6f6f')};
  }
`;
