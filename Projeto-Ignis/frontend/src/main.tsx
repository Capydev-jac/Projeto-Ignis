import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "leaflet/dist/leaflet.css";

import App from './App'; // Agora o App vai gerenciar se mostra mapa vazio ou com risco
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />       {/* App: mostra mapa vazio */}
        <Route path="/risco" element={<App />} />   {/* App: mostra mapa com riscos */}
        <Route path="/foco_calor" element={<App />} />   {/* App: mostra mapa com foco */}
        <Route path="/area_queimada" element={<App />} />   {/* App: mostra mapa com area  queimada */}


      </Routes>
    </BrowserRouter>
  </StrictMode>
);
