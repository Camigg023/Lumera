import { useState, useEffect } from 'react';

/**
 * Props para el componente LocationPicker.
 */
interface LocationPickerProps {
  /** Latitud actual (si ya está definida) */
  latitude?: number;
  /** Longitud actual (si ya está definida) */
  longitude?: number;
  /** Callback cuando cambia la ubicación */
  onLocationChange: (lat: number, lng: number) => void;
}

/**
 * Componente para capturar la geolocalización de la sede principal.
 * Usa la API de Geolocalización del navegador para obtener coordenadas.
 * Muestra la ubicación actual y permite actualizarla.
 */
export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasLocation, setHasLocation] = useState(!!latitude && !!longitude);

  useEffect(() => {
    setHasLocation(!!latitude && !!longitude);
  }, [latitude, longitude]);

  /**
   * Obtiene la ubicación actual del navegador.
   * Solicita permiso al usuario y captura latitud/longitud.
   */
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La geolocalización no está disponible en este navegador.');
      return;
    }

    setGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        onLocationChange(lat, lng);
        setHasLocation(true);
        setGettingLocation(false);
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Permiso de geolocalización denegado. Active la ubicación en su navegador.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('No se pudo determinar la ubicación.');
            break;
          case error.TIMEOUT:
            setLocationError('La solicitud de ubicación expiró.');
            break;
          default:
            setLocationError('Error al obtener la ubicación.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <label className="text-label-sm font-bold text-on-surface uppercase tracking-wider">
          📍 Ubicación de residencia
        </label>
        {hasLocation && (
          <span className="text-xs text-success font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-success rounded-full" />
            Ubicación capturada
          </span>
        )}
      </div>

      <p className="text-body-md text-on-surface-variant">
        Capture su ubicación actual para encontrar los puntos de entrega más cercanos.
      </p>

      {/* Coordenadas actuales */}
      {hasLocation && latitude && longitude && (
        <div className="flex items-center gap-4 p-3 bg-surface-container rounded-md text-xs text-on-surface-variant border border-outline-variant/30">
          <span className="text-lg">📍</span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold opacity-50">Coordenadas</span>
            <div className="flex gap-3">
              <span>Lat: <strong>{latitude.toFixed(6)}</strong></span>
              <span>Lng: <strong>{longitude.toFixed(6)}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Error de geolocalización */}
      {locationError && (
        <div className="p-3 bg-error-container text-on-error-container text-xs rounded-md border border-error/20 flex items-center gap-2">
          <span>⚠️</span>
          {locationError}
        </div>
      )}

      {/* Botón para capturar ubicación */}
      <button
        onClick={getCurrentLocation}
        disabled={gettingLocation}
        className={`
          w-full py-3 px-6 rounded-md text-label-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm
          ${gettingLocation
            ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed opacity-50'
            : 'bg-accent text-white hover:brightness-110 active:scale-[0.98] cursor-pointer hover:shadow-md'
          }
        `}
      >
        {gettingLocation ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Obteniendo ubicación...
          </>
        ) : hasLocation ? (
          <>
            <span>🔄</span>
            Actualizar mi ubicación
          </>
        ) : (
          <>
            <span>📌</span>
            Capturar mi ubicación
          </>
        )}
      </button>
    </div>
  );
}
