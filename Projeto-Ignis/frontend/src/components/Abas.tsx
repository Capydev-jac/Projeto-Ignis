import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

type AbasProps = {
  onClick: (tipo: 'mapa' | 'grafico') => void;
  ativo: 'mapa' | 'grafico';
  children?: ReactNode;
};

const Abas: React.FC<AbasProps> = ({ onClick, ativo, children }) => {
  const navigate = useNavigate();

  const handleAba = (tipo: 'mapa' | 'grafico') => {
    onClick(tipo);
    if (tipo === 'mapa') {
      navigate('/');
    } else {
      navigate('/grafico');
    }
  };

  return (
    <AbasContainer>
      <Button $ativo={ativo === 'mapa'} onClick={() => handleAba('mapa')}>
        Mapa
      </Button>
      <Button $ativo={ativo === 'grafico'} onClick={() => handleAba('grafico')}>
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
  margin-top: 0.5%;
  z-index: 1;
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
  color: white;

  &:hover {
    background-color: ${(props) => (props.$ativo ? '#c62828' : '#ff6f6f')};
  }
`;
