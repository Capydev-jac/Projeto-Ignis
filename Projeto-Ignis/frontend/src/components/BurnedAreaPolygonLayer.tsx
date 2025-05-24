// src/components/BurnedAreaPolygonLayer.tsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { Layer } from "leaflet";
import { drawGroupedBurnedPolygons, Point } from "../utils/drawPolygon";

interface Props {
  pontosQueimadas: Point[];
}

const BurnedAreaPolygonLayer: React.FC<Props> = ({ pontosQueimadas }) => {
  const map = useMap();

  useEffect(() => {
    // ✅ Cria um grupo novo a cada renderização para limpar corretamente
    const polygonGroup = L.layerGroup();

    // 🧹 Remove qualquer camada anterior que seja um polígono
    map.eachLayer((layer: Layer) => {
      if (layer instanceof L.GeoJSON) {
        map.removeLayer(layer);
      }
    });

    // ✅ Apenas desenha se houver pontos suficientes
    if (pontosQueimadas.length >= 3) {
      drawGroupedBurnedPolygons(polygonGroup, pontosQueimadas);
      polygonGroup.addTo(map);
    }

    // 🧼 Cleanup (garante que o grupo seja limpo ao desmontar ou atualizar)
    return () => {
      polygonGroup.clearLayers();
      map.removeLayer(polygonGroup);
    };
  }, [pontosQueimadas, map]); // ← todas dependências listadas corretamente

  return null;
};

export default BurnedAreaPolygonLayer;
