import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { Area_Queimada } from '../entities/area_queimada';

// Tipagem da props
interface FiltroMapaProps {
  onFiltrar: (filtros: {
    tipo: string;
    estado: string;
    bioma: string;
    inicio: string;
    fim: string;
  }) => void;
}

// 🔥 Componente SliderToggle
const SliderToggle = ({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) => {
  return (
    <ToggleWrapper>
      <span>{label}</span>
      <Slider onClick={onClick} style={{ backgroundColor: active ? color : '#616161' }}>
        <SliderThumb style={{ transform: active ? 'translateX(60px)' : 'translateX(0)' }} />
      </Slider>
    </ToggleWrapper>
  );
};

const FiltroMapa: React.FC<FiltroMapaProps> = ({ onFiltrar }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [estado, setEstado] = useState('');
  const [bioma, setBioma] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');

  const [focoDeCalor, setFocoDeCalor] = useState(false);
  const [areaDeQueimada, setAreaDeQueimada] = useState(false);
  const [riscoDeFogo, setRiscoDeFogo] = useState(false);

  const tipos = ['Focos', 'Área de Calor', 'Riscos'];

  const aplicarFiltro = () => {
    onFiltrar({
      tipo: tipos[index],
      estado,
      bioma,
      inicio,
      fim,
    });

    // 🔥 Agora navega só quando clicar "Aplicar"
    if (focoDeCalor) {
      navigate("/foco_calor", { state: { tipo: tipos[index], estado, bioma, inicio, fim } });
    } else if (areaDeQueimada) {
      navigate("/area_queimada", { state: { tipo: tipos[index], estado, bioma, inicio, fim } });
    } else if (riscoDeFogo) {
      navigate("/risco", { state: { tipo: tipos[index], estado, bioma, inicio, fim } });
    } else {
      navigate("/");
    }
  };

  return (
    <FiltroContainer>
      <Filtros>

        {/* 🔥 Botões deslizantes (sem navigate dentro) */}
        <SliderToggle
          label="Foco de Calor"
          color="#FF9800"
          active={focoDeCalor}
          onClick={() => {
            if (!focoDeCalor) {
              setFocoDeCalor(true);
              setAreaDeQueimada(false);
              setRiscoDeFogo(false);
            } else {
              setFocoDeCalor(false);
              navigate("/");
            }
          }}
        />

        <SliderToggle
          label="Área de Queimada"
          color="#FF9800"
          active={areaDeQueimada}
          onClick={() => {
            if (!areaDeQueimada) {
            setFocoDeCalor(false);
            setAreaDeQueimada(true);
            setRiscoDeFogo(false);
          } else {
            setAreaDeQueimada(false);
            navigate("/");
          }        
          }}
        />
        

        <SliderToggle
          label="Risco de Fogo"
          color="#FF9800"
          active={riscoDeFogo}
          onClick={() => {
            if (!riscoDeFogo) {
              setFocoDeCalor(false);
              setAreaDeQueimada(false);
              setRiscoDeFogo(true);
            } else {
              setRiscoDeFogo(false);
              navigate("/");
            }
          }}
        />

        {/* 🔥 Selecionar Estado */}
        <label htmlFor="estado">Estados</label>
        <Select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Selecione um estado</option>
          <option value="ac">Acre</option>
          <option value="al">Alagoas</option>
          <option value="ap">Amapá</option>
          <option value="am">Amazonas</option>
          <option value="ba">Bahia</option>
          <option value="ce">Ceará</option>
          <option value="es">Espírito Santo</option>
          <option value="go">Goiás</option>
          <option value="ma">Maranhão</option>
          <option value="mt">Mato Grosso</option>
          <option value="ms">Mato Grosso do Sul</option>
          <option value="mg">Minas Gerais</option>
          <option value="pa">Pará</option>
          <option value="pb">Paraíba</option>
          <option value="pr">Paraná</option>
          <option value="pe">Pernambuco</option>
          <option value="pi">Piauí</option>
          <option value="rj">Rio de Janeiro</option>
          <option value="rn">Rio Grande do Norte</option>
          <option value="rs">Rio Grande do Sul</option>
          <option value="ro">Rondônia</option>
          <option value="rr">Roraima</option>
          <option value="sc">Santa Catarina</option>
          <option value="sp">São Paulo</option>
          <option value="se">Sergipe</option>
          <option value="to">Tocantins</option>
          <option value="df">Distrito Federal</option>
        </Select>

        {/* 🔥 Selecionar Bioma */}
        <label htmlFor="bioma">Biomas</label>
        <Select id="bioma" value={bioma} onChange={(e) => setBioma(e.target.value)}>
          <option value="">Selecione um bioma</option>
          <option value="cerrado">Cerrado</option>
          <option value="caatinga">Caatinga</option>
          <option value="pantanal">Pantanal</option>
          <option value="mata Atlântica">Mata Atlântica</option>
          <option value="pampa">Pampa</option>
        </Select>

        {/* 🔥 Selecionar Datas */}
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

        {/* 🔥 Botão Aplicar */}
        <AplicarButton onClick={aplicarFiltro}>Aplicar</AplicarButton>

      </Filtros>
    </FiltroContainer>
  );
};

export default FiltroMapa;

// 🔥 Estilos
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

const Slider = styled.div`
  position: relative;
  width: 100px;
  height: 24px;
  background-color: #ccc;
  border-radius: 12px;
  border: 1px solid white;
  display: flex;
  align-items: center;
  padding: 2px;
`;

const SliderThumb = styled.div`
  position: absolute;
  width: 40px;
  height: 20px;
  background-color: #333;
  border-radius: 10px;
  transition: transform 0.3s ease-in-out;
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
