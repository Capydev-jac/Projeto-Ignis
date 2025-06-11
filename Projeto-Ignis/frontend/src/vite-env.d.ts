/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // outras variáveis de ambiente aqui, se quiser
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
