import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiltrosMapa } from '../entities/FiltroMapa';

interface FiltroMapaProps {
  onFiltrar: (filtros: FiltrosMapa) => void;
}

const SliderToggle = ({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
}) => (
  <ToggleWrapper>
    <span>{label}</span>
    <Slider $ativo={active} $cor={color} onClick={onClick}>
      <SliderThumb $ativo={active} />
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
  const [tipo, setTipo] = useState<FiltrosMapa['tipo']>('');

  useEffect(() => {
    if (location.pathname.includes('foco_calor')) setTipo('foco_calor');
    else if (location.pathname.includes('area_queimada')) setTipo('area_queimada');
    else if (location.pathname.includes('risco')) setTipo('risco');
    else setTipo('');
  }, [location.pathname]);

  const aplicarFiltro = () => {
    const rota = tipo ? `/${tipo}` : '/';
    navigate(rota);
    onFiltrar({
      tipo,
      estado: estado !== '' ? estado.toString() : '',
      bioma: bioma !== '' ? bioma.toString() : '',
      inicio,
      fim,
    });
  };

  const limparFiltro = () => {
    navigate('/');
    setTipo('risco');
    setEstado('');
    setBioma('');
    setInicio('');
    setFim('');
    onFiltrar({
      tipo: '',
      estado: '',
      bioma: '',
      inicio: '',
      fim: '',
    });
  };

  return (
    <FiltroContainer>
      <FiltrosContainer>
        <SliderToggle label="Foco de Calor" color="#FF9800" active={tipo === 'foco_calor'} onClick={() => setTipo('foco_calor')} />
        <SliderToggle label="Área Queimada" color="#FF9800" active={tipo === 'area_queimada'} onClick={() => setTipo('area_queimada')} />
        <SliderToggle label="Risco de Fogo" color="#FF9800" active={tipo === 'risco'} onClick={() => setTipo('risco')} />

        <Label>Estado</Label>
        <Select value={estado} onChange={(e) => setEstado(e.target.value === '' ? '' : parseInt(e.target.value))}>
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

        <Label>Bioma</Label>
        <Select value={bioma} onChange={(e) => setBioma(e.target.value === '' ? '' : parseInt(e.target.value))}>
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
              <Label>Início</Label>
              <Input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
            </InputContainer>
            <InputContainer>
              <Label>Fim</Label>
              <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
            </InputContainer>
          </InputGroup>
        </Datas>

        <ButtonGroup>
          <AplicarButton onClick={aplicarFiltro}>Aplicar</AplicarButton>
          <LimparButton onClick={limparFiltro}>Limpar</LimparButton>
        </ButtonGroup>
      </FiltrosContainer>
    </FiltroContainer>
  );
};

export default FiltroMapa;

import {
  FiltroContainer,
  FiltrosContainer,
  ToggleWrapper,
  Slider,
  SliderThumb,
  Select,
  Datas,
  Label,
  InputGroup,
  InputContainer,
  Input,
  ButtonGroup,
  AplicarButton,
  LimparButton,
} from '../styles/FiltroMapa';
