import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { GraficoContainer } from '../styles/GraficoStyle';
import { FiltrosGrafico } from '../entities/FiltrosGrafico';

interface DadoGrafico {
  local: string | number;
  media?: number;
  total?: number;
}

interface Props {
  filtros: FiltrosGrafico;
}

const Grafico: React.FC<Props> = ({ filtros }) => {
  const [dados, setDados] = useState<DadoGrafico[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = new URLSearchParams();
      query.append('local', filtros.local);
      query.append('inicio', filtros.inicio);
      if (filtros.fim) {
        query.append('fim', filtros.fim);
      }

      const url = `/api/grafico/${filtros.tipo}?${query.toString()}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setDados(data);
        } else {
          setDados([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        setDados([]);
      }
    };

    if (filtros.inicio && filtros.fim) {
      fetchData();
    } else {
      setDados([]);
    }
  }, [filtros]);

  const getNomeCategoria = (local: string | number) => {
    const mapeamento: Record<string, string> = {
      '1': 'Amazônia',
      '2': 'Caatinga',
      '3': 'Cerrado',
      '4': 'Mata Atlântica',
      '5': 'Pampa',
      '6': 'Pantanal',

      '11': 'RO', '12': 'AC', '13': 'AM', '14': 'RR', '15': 'PA', '16': 'AP',
      '17': 'TO', '21': 'MA', '22': 'PI', '23': 'CE', '24': 'RN', '25': 'PB',
      '26': 'PE', '27': 'AL', '28': 'SE', '29': 'BA', '31': 'MG', '32': 'ES',
      '33': 'RJ', '35': 'SP', '41': 'PR', '42': 'SC', '43': 'RS', '50': 'MS',
      '51': 'MT', '52': 'GO', '53': 'DF',
    };
    return mapeamento[String(local)] || String(local);
  };

  const calcularCor = (valor: number) => {
    const max = filtros.tipo === 'risco' ? 1 : 130;
    const min = 0;
    const ratio = Math.min(Math.max((valor - min) / (max - min), 0), 1);

    const r = Math.round(46 + ratio * (255 - 46));
    const g = Math.round(139 + ratio * (69 - 139));
    const b = Math.round(87 + ratio * (0 - 87));

    return `rgb(${r},${g},${b})`;
  };

  const chartData = [
    ['Categoria', filtros.tipo === 'risco' ? 'Média' : 'Total', { role: 'style' }],
    ...dados.map((d) => {
      const nome = getNomeCategoria(d.local);
      const valor = filtros.tipo === 'risco' ? Number(d.media) : Number(d.total);
      return [
        nome,
        valor,
        calcularCor(valor)
      ];
    }),
  ];

  const options = {
    title: filtros.tipo === 'risco'
      ? 'Média do Risco de Fogo'
      : filtros.tipo === 'foco_calor'
      ? 'Total de Focos de Calor'
      : 'Total de Área Queimada',
    legend: { position: 'none' },
    chartArea: { width: '70%', height: '70%' },
    hAxis: {
      title: filtros.tipo === 'risco' ? 'Média do Risco (0 a 1)' : 'Total',
      minValue: 0,
      maxValue: filtros.tipo === 'risco' ? 1 : undefined,
    },
    vAxis: {
      title: filtros.local === 'estado' ? 'Estados' : 'Biomas',
    },
    bar: { groupWidth: '65%' },
  };

  return (
    <GraficoContainer>
      {(!filtros.inicio || !filtros.fim) ? (
        <p style={{ color: 'white' }}>⚠️ Selecione o intervalo de datas.</p>
      ) : chartData.length <= 1 ? (
        <p style={{ color: 'white' }}>⚠️ Nenhum dado disponível para este filtro.</p>
      ) : (
        <Chart
          chartType="BarChart"
          data={chartData}
          options={options}
          width="100%"
          height="100%"
        />
      )}
    </GraficoContainer>
  );
};

export default Grafico;
