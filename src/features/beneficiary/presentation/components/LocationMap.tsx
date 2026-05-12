/**
 * Componente LocationMap - Muestra un mapa embebido de OpenStreetMap.
 *
 * En lugar de usar react-leaflet (que requiere CSS adicional y puede causar
 * conflictos de layout), usamos un iframe de OpenStreetMap que es liviano,
 * gratuito, sin API key y no requiere CSS externo.
 *
 * @example
 * ```tsx
 * <LocationMap latitude={4.7110} longitude={-74.0721} address="Bogotá" />
 * ```
 */

interface LocationMapProps {
  /** Latitud de la ubicación */
  latitude: number;
  /** Longitud de la ubicación */
  longitude: number;
  /** Altura del mapa en píxeles (por defecto: 180) */
  height?: number;
  /** Etiqueta opcional para mostrar como popup */
  label?: string;
}

export function LocationMap({
  latitude,
  longitude,
  height = 180,
  label,
}: LocationMapProps) {
  // Calcular el bounding box para el embed (viewport de ~0.02 grados alrededor del punto)
  const padding = 0.02;
  const minLng = longitude - padding;
  const minLat = latitude - padding;
  const maxLng = longitude + padding;
  const maxLat = latitude + padding;

  // URL del embed de OpenStreetMap con marcador
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  // URL para abrir en una ventana externa
  const externalUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

  return (
    <div
      className="mt-3 rounded-xl overflow-hidden border"
      style={{
        height,
        borderColor: 'var(--color-outline-variant)',
      }}
    >
      <iframe
        title={`Mapa de ${label || 'ubicación del beneficiario'}`}
        src={embedUrl}
        width="100%"
        height="100%"
        loading="lazy"
        style={{ border: 'none', display: 'block' }}
        allowFullScreen
      />
      {/* Botón para abrir en OpenStreetMap */}
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-colors"
        style={{
          backgroundColor: 'var(--color-surface-container-high)',
          color: 'var(--color-primary)',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Abrir en OpenStreetMap
      </a>
    </div>
  );
}
