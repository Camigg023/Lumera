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
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-800">
          📍 Ubicación de residencia
        </label>
        {hasLocation && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Ubicación capturada
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Capture su ubicación actual para encontrar los puntos de entrega más cercanos.
      </p>

      {/* Coordenadas actuales */}
      {hasLocation && latitude && longitude && (
        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-xs text-gray-600">
          <span>📍</span>
          <span>
            Lat: <strong>{latitude.toFixed(6)}</strong>
          </span>
          <span>|</span>
          <span>
            Lng: <strong>{longitude.toFixed(6)}</strong>
          </span>
        </div>
      )}

      {/* Error de geolocalización */}
      {locationError && (
        <div className="p-2 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
          {locationError}
        </div>
      )}

      {/* Botón para capturar ubicación */}
      <button
        onClick={getCurrentLocation}
        disabled={gettingLocation}
        className={`
          w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2
          ${gettingLocation
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98] cursor-pointer'
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
            Actualizar ubicación
          </>
        ) : (
          <>
            <span>📌</span>
            Capturar ubicación
          </>
        )}
      </button>
    </div>
  );
}
