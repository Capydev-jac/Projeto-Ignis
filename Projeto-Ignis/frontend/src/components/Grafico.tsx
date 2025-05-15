import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

// Tipagem das props recebidas pelo componente
interface MeusGraficosProps {
  filtros: {
    tipo: string;   // Ex: "Focos", "Área de Queimadas", etc.
    local: string;  // Ex: "Estados", "Biomas"
    inicio: string; // Data inicial no formato "YYYY-MM-DD"
    fim: string;    // Data final no formato "YYYY-MM-DD"
  };
}

// Componente funcional que exibe o gráfico
const MeusGraficos: React.FC<MeusGraficosProps> = ({ filtros }) => {
  const [data, setData] = useState<any[][]>([]); // Estado que armazena os dados do gráfico
  const [loading, setLoading] = useState(true);  // Estado de carregamento

  // useEffect executa toda vez que o filtro muda
  useEffect(() => {
    setLoading(true); // Ativa estado de carregamento

    // Simula uma requisição de dados (aqui você pode substituir por fetch no backend)
    const fetchData = async () => {
      const simulated = [
        ['Data', filtros.tipo], // Cabeçalho da tabela
        [filtros.inicio, Math.floor(Math.random() * 3000)], // Valor aleatório para data inicial
        [filtros.fim, Math.floor(Math.random() * 3000)],     // Valor aleatório para data final
      ];
      setData(simulated);   // Atualiza dados do gráfico
      setLoading(false);    // Finaliza carregamento
    };

    fetchData();
  }, [filtros]); // Dispara o efeito sempre que os filtros mudam

  // Configurações visuais do gráfico
  const options = {
    chart: {
      title: `${filtros.tipo} por ${filtros.local}`, // Título dinâmico baseado nos filtros
      subtitle: `Período de ${filtros.inicio} até ${filtros.fim}`, // Subtítulo com intervalo
    },
    bars: 'horizontal',        // Gráfico de barras horizontais
    height: 400,               // Altura do gráfico
    legend: { position: 'none' }, // Esconde legenda
  };

  // Enquanto está carregando, exibe mensagem
  if (loading) {
    return <p style={{ padding: '1rem' }}>Carregando gráfico...</p>;
  }

  // Renderização do gráfico
  return (
    <div
      style={{
        width: '100%',           // Largura total
        maxWidth: '1400px',       // Máximo de 900px        
        margin: '0 auto',        // Centraliza
        padding: '2rem',         // Espaçamento interno
        display: 'flex',         // Layout flexível
        justifyContent: 'center' // Centraliza conteúdo interno
      }}
    >
      <Chart
        chartType="Bar"         // Tipo de gráfico
        width="100%"            // Ocupa toda largura do container
        height="400px"          // Altura do gráfico
        data={data}             // Dados a serem exibidos
        options={options}       // Configurações visuais
      />
    </div>
  );
};

export default MeusGraficos;
