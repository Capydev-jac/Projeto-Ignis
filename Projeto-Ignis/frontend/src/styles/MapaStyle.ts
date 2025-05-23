import styled from 'styled-components';

export const MapaContainer = styled.div`
  flex: 1;
  padding: 1rem;
  background-color: #0a1a2f;
  height: 100%;
  width: 100%;
  position: relative; /* ⚠️ Importante para contexto do z-index */
  z-index: 0;
`;
