// index.ts ou app.ts
import { server } from './server';

const port = 3000; // Defina a porta em que o servidor vai escutar

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
