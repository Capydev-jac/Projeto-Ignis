import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FiltrosGrafico } from '../entities/FiltrosGrafico';

import {
  FiltroContainer,
  FiltrosContainer,
  Label,
  Select,
  Datas,
  InputGroup,
  ButtonGroup,
  AplicarButton,
  LimparButton,
} from '../styles/FiltroMapa';

interface Props {
  onAplicar: (filtros: FiltrosGrafico) => void;
}

const nomesMeses: Record<string, string> = {
  "01": "Janeiro",
  "02": "Fevereiro",
  "03": "Março",
  "04": "Abril",
  "05": "Maio",
  "06": "Junho",
  "07": "Julho",
  "08": "Agosto",
  "09": "Setembro",
  "10": "Outubro",
  "11": "Novembro",
  "12": "Dezembro",
};

const formatarParaDiaMesAno = (dataISO: string): string => {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano.slice(2)}`;
};

const FiltroGrafico: React.FC<Props> = ({ onAplicar }) => {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState<FiltrosGrafico['tipo']>('risco');
  const [local, setLocal] = useState<FiltrosGrafico['local']>('estado');
  const [estado, setEstado] = useState<string>('');
  const [bioma, setBioma] = useState<string>('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [datasDisponiveis, setDatasDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    const buscarDatas = async () => {
      try {
        const res = await fetch(`/api/datas_disponiveis?tipo=${tipo}`);
        const data = await res.json();

        const datasFormatadas = data.datas_disponiveis
          .filter((d: string | null) => d !== null)
          .map((d: string) =>
            tipo === 'area_queimada'
              ? d.padStart(2, '0')
              : new Date(d).toISOString().split('T')[0].trim()
          );

        const datasUnicas = Array.from(new Set<string>(datasFormatadas)).sort();
        setDatasDisponiveis(datasUnicas);
      } catch (error) {
        console.error('Erro ao buscar datas:', error);
      }
    };

    buscarDatas();
    setInicio('');
    setFim('');
  }, [tipo]);

  const datasFimDisponiveis = useMemo(() => {
    if (!inicio || tipo === 'area_queimada') return [];

    const inicioDate = new Date(inicio);
    const datas: string[] = [];

    for (let i = 0; i < 30; i++) {
      const novaData = new Date(inicioDate);
      novaData.setDate(inicioDate.getDate() + i);
      datas.push(novaData.toISOString().split('T')[0]);
    }

    return datas;
  }, [inicio, tipo]);

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
        </Select>

        <Label>Local</Label>
        <Select value={local} onChange={(e) => setLocal(e.target.value as FiltrosGrafico['local'])}>
          <option value="estado">Estados</option>
          <option value="bioma">Biomas</option>
        </Select>

        <Datas>
          <Label>{tipo === 'area_queimada' ? 'Mês' : 'Data Início'}</Label>
          <Select value={inicio} onChange={(e) => { setInicio(e.target.value); setFim(''); }}>
            <option value="">Selecione</option>
            {datasDisponiveis.map((data) => (
              <option key={data} value={data}>
                {tipo === 'area_queimada'
                  ? nomesMeses[data] || `Mês ${data}`
                  : formatarParaDiaMesAno(data)}
              </option>
            ))}
          </Select>

          {tipo !== 'area_queimada' && (
            <>
              <Label>Data Fim</Label>
              <Select value={fim} onChange={(e) => setFim(e.target.value)} disabled={!inicio}>
                <option value="">Selecione</option>
                {datasFimDisponiveis.map((data) => (
                  <option key={data} value={data}>
                    {formatarParaDiaMesAno(data)}
                  </option>
                ))}
              </Select>
            </>
          )}
        </Datas>

        {((tipo !== 'area_queimada' && (!inicio || !fim)) || (tipo === 'area_queimada' && !inicio)) && (
          <p style={{ color: 'White', fontSize: '0.9rem' }}>
            ⚠️ Selecione {tipo === 'area_queimada' ? 'o mês' : 'um intervalo de datas'} válido.
          </p>
        )}

        <ButtonGroup>
          <AplicarButton
            onClick={aplicar}
            disabled={tipo !== 'area_queimada' ? (!inicio || !fim) : !inicio}
          >
            Aplicar
          </AplicarButton>
          <LimparButton onClick={limpar}>Limpar</LimparButton>
        </ButtonGroup>
      </FiltrosContainer>
    </FiltroContainer>
  );
};

export default FiltroGrafico;
