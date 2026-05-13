import { DeliveryLocation } from '../../domain/entities/HelpRequest';

/**
 * Props para el componente de mapa de tracking.
 */
interface TrackingMapProps {
  /** Ubicación actual de la entrega */
  location: DeliveryLocation;
  /** Nombre de la organización beneficiaria */
  beneficiaryName: string;
  /** Dirección de entrega */
  deliveryAddress?: string;
  /** Tiempo estimado de llegada en minutos */
  etaMinutes?: number;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente de mapa para seguimiento de entregas en tiempo real.
 *
 * Usa OpenStreetMap embed para mostrar la ubicación actual de la entrega.
 * Muestra la dirección, el ETA y un mapa estático con la ubicación.
 * 
 * NOTA: Para usar Google Maps en producción, reemplazar el iframe de OSM
 * con el componente de Google Maps React correspondiente.
 */
export function TrackingMap({
  location,
  beneficiaryName,
  deliveryAddress,
  etaMinutes,
  className = '',
}: TrackingMapProps) {
  const { latitude, longitude } = location;

  /**
   * Genera la URL del mapa embebido de OpenStreetMap.
   */
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=transport&marker=${latitude}%2C${longitude}`;

  /**
   * Genera enlace para abrir en Google Maps.
   */
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  /**
   * Genera enlace para abrir en Waze.
   */
  const wazeUrl = `https://www.waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`;

  /**
   * Formatea el ETA de minutos a texto legible.
   */
  const formatEta = (minutes: number): string => {
    if (minutes < 1) return 'Llegando';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Encabezado */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">📍 Ubicación de la entrega</h3>
            <p className="text-xs text-gray-500 mt-0.5">{beneficiaryName}</p>
          </div>

          {/* ETA */}
          {etaMinutes !== undefined && etaMinutes > 0 && (
            <div className="text-right">
              <div className="text-lg font-bold text-orange-600">
                {formatEta(etaMinutes)}
              </div>
              <p className="text-xs text-gray-400">Tiempo estimado</p>
            </div>
          )}
          {etaMinutes !== undefined && etaMinutes === 0 && (
            <div className="text-right">
              <div className="text-sm font-bold text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Llegando
              </div>
            </div>
          )}
        </div>

        {/* Dirección */}
        {deliveryAddress && (
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <span>📮</span> {deliveryAddress}
          </p>
        )}
      </div>

      {/* Mapa embebido */}
      <div className="relative w-full h-64 bg-gray-100">
        <iframe
          title="Mapa de entrega"
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-b-lg"
        />

        {/* Overlay de coordenadas */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      </div>

      {/* Acciones */}
      <div className="p-3 bg-gray-50 flex gap-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 text-xs font-medium text-center text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Abrir en Google Maps
        </a>
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 text-xs font-medium text-center text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Abrir en Waze
        </a>
      </div>
    </div>
  );
}
