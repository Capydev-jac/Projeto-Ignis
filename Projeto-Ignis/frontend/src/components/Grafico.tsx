import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { FiltrosGrafico } from '../entities/FiltroGrafico';
import { GraficoContainer } from '../styles/GraficoStyle';

interface DadoGrafico {
  categoria: string;
  total: number;
}

interface Props {
  filtros: FiltrosGrafico;
}

// 🔥 Montagem dos parâmetros da query
const montarQueryParams = (filtros: FiltrosGrafico) => {
  const params = new URLSearchParams();
  if (filtros.inicio) params.append('inicio', filtros.inicio);
  if (filtros.fim) params.append('fim', filtros.fim);
  params.append('local', filtros.local);
  return params.toString();
};

const Grafico: React.FC<Props> = ({ filtros }) => {
  const [dados, setDados] = useState<DadoGrafico[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const query = montarQueryParams(filtros);
      const url = `http://localhost:3000/api/grafico/${filtros.tipo}?${query}`;

      try {
        const res = await fetch(url);
        const rawData = await res.json();
        if (Array.isArray(rawData)) {
          // 🔥 Filtra valores negativos
          const filtrados = rawData.filter(
            (d: DadoGrafico) => Number(d.total) >= 0
          );
          setDados(filtrados);
        } else {
          setDados([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        setDados([]);
      }
    };

    fetchData();
  }, [filtros]);

  const chartData = [
    ['Categoria', 'Total', { role: 'style' }],
    ...dados.map((d) => [
      d.categoria,
      Number(d.total),
      getCorCategoria(d.categoria),
    ]),
  ];

  function getCorCategoria(categoria: string): string {
    switch (categoria.toLowerCase()) {
      case 'amazônia':
      case 'amazonia':
        return '#00b050';
      case 'cerrado':
        return '#ff0000';
      case 'pantanal':
        return '#4f81bd';
      case 'mata atlântica':
      case 'mata atlantica':
        return '#7030a0';
      case 'caatinga':
        return '#ffc000';
      case 'pampa':
        return '#ffff00';
      default:
        return '#999999';
    }
  }

  return (
    <GraficoContainer>
      {chartData.length <= 1 ? (
        <p style={{ color: 'white' }}>Nenhum dado disponível.</p>
      ) : (
        <Chart
          chartType="BarChart"
          data={chartData}
          options={{
            title: `${
              filtros.tipo === 'risco'
                ? 'Risco de Fogo'
                : filtros.tipo === 'foco_calor'
                ? 'Foco de Calor'
                : 'Área Queimada'
            } por ${filtros.local === 'bioma' ? 'Bioma' : 'Estado'}`,
            legend: { position: 'none' },
            bars: 'horizontal',
            backgroundColor: '#0a1a2f',
            titleTextStyle: { color: '#fff' },
            hAxis: { minValue: 0, textStyle: { color: '#fff' } },
            vAxis: { textStyle: { color: '#fff' } },
          }}
          width="100%"
          height="100%"
        />
      )}
    </GraficoContainer>
  );
};

export default Grafico;
