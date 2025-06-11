// Importa a biblioteca styled-components para criar componentes estilizados
import styled from 'styled-components';
import logoSrc from "../img/logo.png"; // Renomeado para evitar conflito

// Define o componente funcional Header
const Header = () => {
  return (
    <HeaderWrapper>
      {/* Agrupa logo + título */}
      <LogoGroup>
        <LogoImage src={logoSrc} alt="Logo do site" />
        <Title>Ignis</Title>
      </LogoGroup>
    </HeaderWrapper>
  );
};

export default Header;

// Wrapper do header
const HeaderWrapper = styled.header`
  background-color: #212121;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-left: -10px;
  margin-top: -10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
`;

// Agrupamento de logo + título
const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Espaço entre logo e título */
`;

// Estilo do título
const Title = styled.h1`
  color: white;
  margin-left: 5vh;
  font-size: 1.5rem;
  position: fixed;
`;

// Estilo da imagem do logo
const LogoImage = styled.img`
  height: 40px; /* Ajustável conforme sua imagem */
  position: fixed;
`;
