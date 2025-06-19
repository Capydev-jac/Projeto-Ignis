// src/utils/drawPolygon.ts
import * as turf from "@turf/turf";
import L from "leaflet";

// Tipo de ponto que será usado no polígono
export type Point = {
  lat: number;
  lng: number;
  grupo: string;
};

// Cor visual do polígono baseada na quantidade de pontos
function getColorByPointCount(count: number): string {
  if (count <= 3) return "green";      // 🟢 Poucos pontos
  if (count <= 10) return "yellow";    // 🟡 Médio
  if (count <= 20) return "orange";    // 🟠 Muitos
  return "darkred";                    // 🔴 Muitos pontos
}

// Função principal para desenhar os polígonos agrupados
export function drawGroupedBurnedPolygons(group: L.LayerGroup, points: Point[]) {
  // 🧩 Agrupa os pontos pelo valor do campo `grupo` (estado ou bioma)
  const grupos: Record<string, Point[]> = {};

  points.forEach((pt) => {
    if (!grupos[pt.grupo]) grupos[pt.grupo] = [];
    grupos[pt.grupo].push(pt);
  });

  // 🛠️ Para cada grupo válido, gera e adiciona um polígono
  Object.entries(grupos).forEach(([grupo, grupoPontos]) => {
    if (grupoPontos.length < 3) return;

    // Cria coleção de pontos do turf.js
    const geoPoints = grupoPontos.map((pt) =>
      turf.point([pt.lng, pt.lat])
    );
    const featureCollection = turf.featureCollection(geoPoints);
    const convexHull = turf.convex(featureCollection);

    if (!convexHull) return;

    const color = getColorByPointCount(grupoPontos.length);

    // ✅ Debug no console
    console.log("🛠️ Desenhando polígono para grupo:", grupo);

    // Cria o polígono Leaflet
    const polygonLayer = L.geoJSON(convexHull as GeoJSON.GeoJsonObject, {
      style: {
        color,         // Borda
        fillColor: color, // Preenchimento
        fillOpacity: 0.3,
        weight: 2,
      },
    });

    // Adiciona ao grupo (será controlado pelo componente)
    group.addLayer(polygonLayer);
  });
}
