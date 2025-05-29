import styled from 'styled-components';

export const FiltroContainer = styled.div`
  position: fixed; /* ⚠️ Mantém fixo */
  top: 70px; /* Ajuste conforme o header */
  left: 0;
  width: 350px;
  height: calc(100vh - 70px);
  background-color: #d32f2f;
  z-index: 10; /* ⚠️ Garante que fica acima do mapa */
  border-radius: 0 8px 8px 8px;
  padding: 20px;
`;
export const FiltrosContainer = styled.div`
  padding: 10px 0;
`;

export const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;

  span {
    margin-bottom: 5px;
    font-size: 1rem;
  }
`;

export const Slider = styled.div<{ $ativo: boolean; $cor: string }>`
  position: relative;
  width: 100px;
  height: 24px;
  background-color: ${({ $ativo, $cor }) => ($ativo ? $cor : '#616161')};
  border-radius: 12px;
  border: 1px solid white;
  display: flex;
  align-items: center;
  padding: 2px;
  cursor: pointer;
`;

export const SliderThumb = styled.div<{ $ativo: boolean }>`
  position: absolute;
  width: 40px;
  height: 20px;
  background-color: #333;
  border-radius: 10px;
  transition: transform 0.3s ease-in-out;
  transform: ${({ $ativo }) => ($ativo ? 'translateX(60px)' : 'translateX(0)')};
`;

export const Select = styled.select`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const Datas = styled.div`
  margin-top: 20px;
`;

export const Label = styled.label`
  font-weight: bold;
  font-size: 1rem;
  display: block;
  margin-bottom: 5px;
`;

export const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
`;

export const Input = styled.input`
  padding: 8px;
  width: 150px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 20px;
`;

export const AplicarButton = styled.button`
  padding: 8px 16px;
  background-color: #616161;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #388e3c;
  }
`;

export const LimparButton = styled.button`
  padding: 8px 16px;
  background-color: #616161;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #d32f2f;
  }
`;
