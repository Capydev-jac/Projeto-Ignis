import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FiltrosGrafico } from '../entities/FiltrosGrafico';

import {
  FiltroContainer,
  FiltrosContainer,
  Label,
  Select,
  Datas,
  InputGroup,
  InputContainer,
  Input,
  ButtonGroup,
  AplicarButton,
  LimparButton,
} from '../styles/FiltroMapa';

interface Props {
  onAplicar: (filtros: FiltrosGrafico) => void;
}

const FiltroGrafico: React.FC<Props> = ({ onAplicar }) => {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState<FiltrosGrafico['tipo']>('risco');
  const [local, setLocal] = useState<FiltrosGrafico['local']>('estado');
  const [estado, setEstado] = useState<string>('');
  const [bioma, setBioma] = useState<string>('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');

  const aplicar = () => {
    navigate('/grafico');
    onAplicar({
      tipo,
      local,
      estado,
      bioma,
      inicio,
      fim,
    });
  };

  const limpar = () => {
    setTipo('risco');
    setLocal('estado');
    setEstado('');
    setBioma('');
    setInicio('');
    setFim('');
    onAplicar({
      tipo: 'risco',
      local: 'estado',
      estado: '',
      bioma: '',
      inicio: '',
      fim: '',
    });
  };

  return (
    <FiltroContainer>
      <FiltrosContainer>
        <Label>Tipo</Label>
        <Select value={tipo} onChange={(e) => setTipo(e.target.value as FiltrosGrafico['tipo'])}>
          <option value="risco">Risco de Fogo</option>
          <option value="foco_calor">Foco de Calor</option>
          <option value="area_queimada">Área Queimada</option>
        </Select>

        <Label>Local</Label>
        <Select value={local} onChange={(e) => setLocal(e.target.value as FiltrosGrafico['local'])}>
          <option value="estado">Estados</option>
          <option value="bioma">Biomas</option>

        </Select>

        <Label>Estado</Label>
        <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Todos os Estados</option>
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
        <Select value={bioma} onChange={(e) => setBioma(e.target.value)}>
          <option value="">Todos os Biomas</option>
          <option value="1">Amazônia</option>
          <option value="2">Caatinga</option>
          <option value="3">Cerrado</option>
          <option value="4">Mata Atlântica</option>
          <option value="5">Pampa</option>
          <option value="6">Pantanal</option>
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
          <AplicarButton onClick={aplicar}>Aplicar</AplicarButton>
          <LimparButton onClick={limpar}>Limpar</LimparButton>
        </ButtonGroup>
      </FiltrosContainer>
    </FiltroContainer>
  );
};

export default FiltroGrafico;
