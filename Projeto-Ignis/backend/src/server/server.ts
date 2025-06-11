import express from 'express';
import cors from 'cors';
import path from 'path';
import ocorrenciaRoutes from '../routes/OcorrenciaRoutes';

//configura middlewares e rotas
const app = express();
app.use(cors());
app.use(express.json());

// 🔽 Adicione essa linha para servir arquivos estáticos GeoJSON
app.use(express.static(path.join(__dirname, '../../public')));

app.use('/api/brasil', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/geojson/brasil.geojson'));
});

app.use('/api/estados', express.static(path.join(__dirname, '../../public/geojson/estados.geojson')));

app.use('/api', ocorrenciaRoutes);

export default app;
