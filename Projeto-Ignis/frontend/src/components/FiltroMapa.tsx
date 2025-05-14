// Versão final de FiltroMapa com props transitórias e toggles funcionais
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from "react-router-dom";

interface FiltroMapaProps {
  onFiltrar: (filtros: {
    tipo: string;
    estado: string;
    bioma: string;
    inicio: string;
    fim: string;
  }) => void;
}

const SliderToggle = ({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) => (
  <ToggleWrapper>
    <span>{label}</span>
    <Slider $ativo={active} $cor={color} onClick={onClick}>
      <SliderThumb ativo={active} />
    </Slider>
  </ToggleWrapper>
);

const FiltroMapa: React.FC<FiltroMapaProps> = ({ onFiltrar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [estado, setEstado] = useState<number | ''>('');
  const [bioma, setBioma] = useState<number | ''>('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [tipo, setTipo] = useState<string>('');

  useEffect(() => {
    if (location.pathname.includes("foco_calor")) setTipo("foco_calor");
    else if (location.pathname.includes("area_queimada")) setTipo("area_queimada");
    else if (location.pathname.includes("risco")) setTipo("risco");
    else setTipo("");
  }, [location.pathname]);

  const aplicarFiltro = () => {
    const rota = tipo ? `/${tipo}` : '/';
    navigate(rota);
    setTimeout(() => {
      onFiltrar({ tipo, estado: estado !== '' ? estado.toString() : '', bioma: bioma !== '' ? bioma.toString() : '', inicio, fim });
    }, 100);
  };

  const limparFiltro = () => {
    navigate("/");
    setTipo("");
    setEstado("");
    setBioma("");
  };

  return (
    <FiltroContainer>
      <Filtros>
        <SliderToggle label="Foco de Calor" color="#FF9800" active={tipo === 'foco_calor'} onClick={() => setTipo("foco_calor")} />
        <SliderToggle label="Área de Queimada" color="#FF9800" active={tipo === 'area_queimada'} onClick={() => setTipo("area_queimada")} />
        <SliderToggle label="Risco de Fogo" color="#FF9800" active={tipo === 'risco'} onClick={() => setTipo("risco")} />

        <label htmlFor="id_estado">Estados</label>
        <Select id="id_estado" value={estado} onChange={(e) => setEstado(e.target.value === '' ? '' : parseInt(e.target.value))}>
          <option value="">Selecione um estado</option>
          <option value="12">Acre</option>
          <option value="27">Alagoas</option>
          <option value="16">Amapá</option>
          <option value="13">Amazonas</option>
          <option value="29">Bahia</option>
          <option value="23">Ceará</option>
          <option value="32">Espírito Santo</option>
          <option value="52">Goiás</option>
          <option value="21">Maranhão</option>
          <option value="51">Mato Grosso</option>
          <option value="50">Mato Grosso do Sul</option>
          <option value="31">Minas Gerais</option>
          <option value="15">Pará</option>
          <option value="25">Paraíba</option>
          <option value="41">Paraná</option>
          <option value="26">Pernambuco</option>
          <option value="22">Piauí</option>
          <option value="33">Rio de Janeiro</option>
          <option value="24">Rio Grande do Norte</option>
          <option value="43">Rio Grande do Sul</option>
          <option value="11">Rondônia</option>
          <option value="14">Roraima</option>
          <option value="42">Santa Catarina</option>
          <option value="35">São Paulo</option>
          <option value="28">Sergipe</option>
          <option value="17">Tocantins</option>
          <option value="53">Distrito Federal</option>
        </Select>

        <label htmlFor="bioma">Biomas</label>
        <Select id="bioma" value={bioma} onChange={(e) => setBioma(e.target.value === '' ? '' : parseInt(e.target.value))}>
          <option value="">Selecione um bioma</option>
          <option value="3">Cerrado</option>
          <option value="2">Caatinga</option>
          <option value="6">Pantanal</option>
          <option value="4">Mata Atlântica</option>
          <option value="5">Pampa</option>
          <option value="1">Amazônia</option>
        </Select>

        <Datas>
          <Label>Datas:</Label>
          <InputGroup>
            <InputContainer>
              <Label htmlFor="inicio">Início</Label>
              <Input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
            </InputContainer>
            <InputContainer>
              <Label htmlFor="fim">Fim</Label>
              <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
            </InputContainer>
          </InputGroup>
        </Datas>

        <AplicarButton onClick={aplicarFiltro}>Aplicar</AplicarButton>
        
        <LimparButton onClick={limparFiltro}>Limpar</LimparButton>

      </Filtros>
    </FiltroContainer>
  );
};

export default FiltroMapa;

const FiltroContainer = styled.div`
  font-weight: bold;
  padding: 20px;
  background-color: #d32f2f;
  height: 83vh;
  width: 350px;
  border-radius: 0px 8px 8px 8px;
  z-index: 1;
  margin-top: 2%;
  position: fixed;
`;

const Filtros = styled.div`
  padding: 10px 0;
`;

const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;

  span {
    margin-bottom: 5px;
    font-size: 1rem;
  }
`;

const Slider = styled.div<{ $ativo: boolean; $cor: string }>`
  position: relative;
  width: 100px;
  height: 24px;
  background-color: ${({ $ativo, $cor }) => ($ativo ? $cor : '#616161')};
  border-radius: 12px;
  border: 1px solid white;
  display: flex;
  align-items: center;
  padding: 2px;
`;

const SliderThumb = styled.div<{ ativo: boolean }>`
  position: absolute;
  width: 40px;
  height: 20px;
  background-color: #333;
  border-radius: 10px;
  transition: transform 0.3s ease-in-out;
  transform: ${({ ativo }) => (ativo ? 'translateX(60px)' : 'translateX(0)')};
`;

const Select = styled.select`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const Datas = styled.div`
  margin-top: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 1rem;
  display: block;
  margin-bottom: 5px;
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
`;

const Input = styled.input`
  padding: 8px;
  width: 150px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 5px;
`;

const AplicarButton = styled.button`
  margin-top: 10px;
  margin-left: 250px;
  width: 100px;
  padding: 8px;
  background-color: #616161;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #388E3C;
  }
`;

const LimparButton = styled.button`
  margin-top:  10px;
  margin-left: 250px;
  width: 100px;
  padding: 8px;
  background-color: #616161;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #388E3C;
  }
`;
