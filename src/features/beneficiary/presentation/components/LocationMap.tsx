import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Fix para iconos de Leaflet en Webpack/Vite ───
// Los iconos por defecto de Leaflet no se cargan correctamente con bundlers modernos.
// Esta solución parchea los iconos usando rutas directamente de node_modules.
// Referencia: https://github.com/PaulLeCam/react-leaflet/issues/453

const DefaultIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Componente interno que ajusta el viewport del mapa cuando cambian las coordenadas.
 */
function MapBoundsUpdater({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], 15, { animate: true });
  }, [map, latitude, longitude]);
  return null;
}

/**
 * Props para el componente LocationMap.
 */
interface LocationMapProps {
  /** Latitud de la ubicación */
  latitude: number;
  /** Longitud de la ubicación */
  longitude: number;
  /** Altura del mapa en píxeles (por defecto: 200) */
  height?: number;
  /** Etiqueta opcional para el marcador */
  label?: string;
  /** Si es true, el mapa ocupa todo el ancho disponible (por defecto: true) */
  fullWidth?: boolean;
}

/**
 * Componente de mapa interactivo para mostrar la ubicación del beneficiario.
 * Usa Leaflet con OpenStreetMap (gratuito, sin API key).
 *
 * @example
 * ```tsx
 * <LocationMap latitude={4.7110} longitude={-74.0721} label="Bogotá, Colombia" />
 * ```
 */
export function LocationMap({
  latitude,
  longitude,
  height = 200,
  label,
  fullWidth = true,
}: LocationMapProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${fullWidth ? 'w-full' : ''}`}
      style={{ height }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          {label && (
            <Popup>
              <span className="text-sm font-medium">{label}</span>
            </Popup>
          )}
        </Marker>
        <MapBoundsUpdater latitude={latitude} longitude={longitude} />
      </MapContainer>
    </div>
  );
}
