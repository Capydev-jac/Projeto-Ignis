import React, { useState } from 'react'; // Importa o React e o hook useState para gerenciamento de estado
import styled from 'styled-components'; // Importa a biblioteca styled-components para estilização com CSS-in-JS

// Componente funcional FiltroGrafico
const FiltroGrafico: React.FC = () => {
  // Definindo estados para controlar os índices dos sliders
  const [index1, setIndex1] = useState(0); // Índice para o primeiro slider
  const [index2, setIndex2] = useState(0); // Índice para o segundo slider

  // Listas de estados e cores para os sliders
  const estados1 = ['Focos', 'Área de Queimadas', 'Riscos de Fogo']; // Opções para o primeiro slider
  const cores1 = ['#FF5722', '#795548', '#FF9800']; // Cores para o primeiro slider
  const estados2 = ['Estados', 'Biomas']; // Opções para o segundo slider
  const cores2 = ['#1976D2', '#388E3C']; // Cores para o segundo slider

  // Função para atualizar o estado do primeiro slider
  const atualizarEstado1 = () => (
    <Slider1 style={{ backgroundColor: cores1[index1] }}>
      <SliderThumb1 style={{ transform: `translateX(${index1 * 122}px)` }} />
    </Slider1>
  );

  // Função para atualizar o estado do segundo slider
  const atualizarEstado2 = () => (
    <Slider2 style={{ backgroundColor: cores2[index2] }}>
      <SliderThumb2 style={{ transform: `translateX(${index2 * 75}px)` }} />
    </Slider2>
  );

  return (
    <FiltroContainer>
      <Filtros>
        {/* Rótulos do primeiro slider */}
        <ToggleLabels1>
          <span>{estados1[0]}</span>
          <span>{estados1[1]}</span>
          <span>{estados1[2]}</span>
        </ToggleLabels1>

        {/* Primeiro Slider */}
        <SliderContainer onClick={() => setIndex1((index1 + 1) % estados1.length)}>
          {atualizarEstado1()} {/* Atualiza o primeiro slider com base no índice */}
        </SliderContainer>

        {/* Rótulos do segundo slider */}
        <ToggleLabels2>
          <span>{estados2[0]}</span>
          <span>{estados2[1]}</span>
        </ToggleLabels2>

        {/* Segundo Slider */}
        <SliderContainer onClick={() => setIndex2((index2 + 1) % estados2.length)}>
          {atualizarEstado2()} {/* Atualiza o segundo slider com base no índice */}
        </SliderContainer>

        {/* Seção de datas */}
        <Datas>
          <Label>Datas:</Label>
          <InputGroup>
            {/* Input para a data de início */}
            <InputContainer>
              <Label htmlFor="inicio">Início</Label>
              <Input type="date" id="inicio" name="inicio" min="2025-03-20" max="2025-03-27" />
            </InputContainer>
            {/* Input para a data de fim */}
            <InputContainer>
              <Label htmlFor="fim">Fim</Label>
              <Input type="date" id="fim" name="fim" min="2025-03-20" max="2025-03-27" />
            </InputContainer>
          </InputGroup>
        </Datas>

        {/* Botão para aplicar os filtros */}
        <AplicarButton>Aplicar</AplicarButton>

        {/* Botão para limpar os filtros */}
        <LimparButton>Limpar</LimparButton>
      </Filtros>
    </FiltroContainer>
  );
};

export default FiltroGrafico; // Exporta o componente FiltroGrafico para ser usado em outros lugares

// Estilizações dos componentes com styled-components

// Container principal do filtro
const FiltroContainer = styled.div`
  font-weight: bold; // Estilo do texto dentro do filtro
  padding: 20px; // Espaçamento interno
  background-color: #d32f2f; // Cor de fundo
  height: 83vh; // Altura do container
  width: 350px; // Largura do container
  border-radius: 0px 8px 8px 8px; // Borda arredondada no canto superior direito e inferior
  z-index: 1; // Prioridade de sobreposição
  margin-top: 2%; // Margem superior
  position: fixed; // Fixa o filtro na tela
`;

// Contêiner interno para os filtros
const Filtros = styled.div`
  padding: 10px 0; // Espaçamento interno
`;

// Estilos para os rótulos do primeiro slider
const ToggleLabels1 = styled.div`
  display: flex; // Exibe os rótulos em linha
  justify-content: space-between; // Espaça os itens uniformemente
  margin-bottom: 10px; // Espaçamento inferior

  span {
    font-size: 16px; // Tamanho da fonte
    color: #000; // Cor do texto
    font-weight: bold; // Negrito
  }
`;

// Estilos para os rótulos do segundo slider
const ToggleLabels2 = styled.div`
  display: flex; // Exibe os rótulos em linha
  justify-content: center;  /* Alinha os itens ao centro */
  gap: 60px; // Espaçamento entre os rótulos

  span {
    font-size: 16px; // Tamanho da fonte
    color: #000; // Cor do texto
    font-weight: bold; // Negrito
  }
`;

// Estilos para o container de sliders
const SliderContainer = styled.div`
  margin: 10px 0; // Espaçamento vertical entre os sliders
`;

// Estilos para o primeiro slider
const Slider1 = styled.div`
  position: relative; // Define a posição relativa para o thumb
  width: 345px; // Largura do slider
  height: 24px; // Altura do slider
  background-color: #ddd; // Cor de fundo
  border-radius: 12px; // Bordas arredondadas
  border: 1px solid white; // Borda branca
  display: flex; // Utiliza flexbox
  align-items: center; // Alinha os itens no centro
  padding: 2px; // Espaçamento interno
  cursor: pointer; // Cursor de ponteiro para indicar interatividade
`;

// Estilos para o segundo slider
const Slider2 = styled.div`
  position: relative; // Define a posição relativa para o thumb
  width: 150px; // Largura do slider
  height: 24px; // Altura do slider
  background-color: #ddd; // Cor de fundo
  border-radius: 12px; // Bordas arredondadas
  border: 1px solid white; // Borda branca
  display: flex; // Utiliza flexbox
  align-items: center; // Alinha os itens no centro
  padding: 2px; // Espaçamento interno
  cursor: pointer; // Cursor de ponteiro
  left: 50%; // Centraliza o slider horizontalmente
  transform: translateX(-50%); // Ajusta o deslocamento para garantir o alinhamento correto
`;

// Estilos para o "thumb" do primeiro slider
const SliderThumb1 = styled.div`
  position: absolute; // Posição absoluta dentro do slider
  width: 100px; // Largura do thumb
  height: 20px; // Altura do thumb
  background-color: #333; // Cor do thumb
  border-radius: 10px; // Bordas arredondadas
  transition: transform 0.3s ease-in-out; // Transição suave ao mover o thumb
`;

// Estilos para o "thumb" do segundo slider
const SliderThumb2 = styled.div`
  position: absolute; // Posição absoluta dentro do slider
  width: 75px; // Largura do thumb
  height: 20px; // Altura do thumb
  background-color: #333; // Cor do thumb
  border-radius: 10px; // Bordas arredondadas
  transition: transform 0.3s ease-in-out; // Transição suave ao mover o thumb
  display: flex; // Utiliza flexbox para alinhamento
  align-items: center; // Alinha os itens no centro
`;

// Estilos para a seção de datas
const Datas = styled.div`
  margin-top: 10px; // Espaçamento superior
`;

// Estilos para os rótulos de input
const Label = styled.label`
  font-weight: bold; // Negrito
  font-size: 1rem; // Tamanho da fonte
  display: block; // Exibe o rótulo como bloco
  margin-bottom: 5px; // Espaçamento inferior
`;

// Estilos para o grupo de inputs
const InputGroup = styled.div`
  display: flex; // Exibe os inputs em linha
  justify-content: space-between; // Espaça uniformemente os itens
  gap: 15px; // Espaçamento entre os inputs
`;

// Estilos para o container de cada input
const InputContainer = styled.div`
  display: flex; // Exibe os itens em linha
  flex-direction: column; // Organiza os itens na direção vertical
  width: 48%; // Largura do container de input
`;

// Estilos para o input de data
const Input = styled.input`
  padding: 8px; // Espaçamento interno
  width: 150px; // Largura do input
  border-radius: 4px; // Bordas arredondadas
  border: 1px solid #ccc; // Borda do input
  margin-top: 5px; // Espaçamento superior
`;

// Estilos para o botão de aplicar
const AplicarButton = styled.button`
  margin-top: 10px; // Espaçamento superior
  margin-left: 250px; // Espaçamento à esquerda
  width: 100px; // Largura do botão
  padding: 8px; // Espaçamento interno
  background-color: #616161; // Cor de fundo
  color: white; // Cor do texto
  border: none; // Remove a borda
  border-radius: 4px; // Bordas arredondadas
  cursor: pointer; // Cursor de ponteiro
  font-weight: bold; // Negrito
  &:hover {
    background-color: #388E3C; // Cor de fundo ao passar o mouse
  }
`;

// Estilos para o botão de limpar
const LimparButton = styled.button`
  margin-top: 5px; // Espaçamento superior
  margin-left: 10px; // Espaçamento à esquerda
  width: 100px; // Largura do botão
  padding: 8px; // Espaçamento interno
  background-color: #616161; // Cor de fundo
  color: white; // Cor do texto
  border: none; // Remove a borda
  border-radius: 4px; // Bordas arredondadas
  cursor: pointer; // Cursor de ponteiro
  font-weight: bold; // Negrito
  &:hover {
    background-color: #388E3C; // Cor de fundo ao passar o mouse
  }
`;
