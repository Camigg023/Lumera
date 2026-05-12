import { useState, useEffect, useRef, useCallback } from 'react';
import { obtenerUbicacionActual, encontrarMasCercano } from '../../../../../services/geolocationService';
import { CollectionPointRepository } from '../../../data/repositories/ICollectionPointRepository';

/**
 * Componente que encuentra y muestra el centro de acopio más cercano
 * usando la geolocalización del navegador.
 *
 * @param {{ autoDetectar?: boolean }} props
 *   - autoDetectar: Si es true, busca automáticamente al montar el componente
 */
export default function NearbyAcopio({ autoDetectar = false }) {
  const [cargando, setCargando] = useState(false);
  const [punto, setPunto] = useState(null);
  const [error, setError] = useState('');
  const [buscado, setBuscado] = useState(false);
  const montado = useRef(true);

  useEffect(() => {
    return () => { montado.current = false; };
  }, []);

  const handleBuscar = useCallback(async () => {
    setCargando(true);
    setError('');
    setPunto(null);
    setBuscado(true);

    const ubicacion = await obtenerUbicacionActual();

    if (!ubicacion) {
      if (montado.current) {
        setError(
          'No pudimos obtener tu ubicación. Asegúrate de permitir el acceso a la ubicación en tu navegador.'
        );
        setCargando(false);
      }
      return;
    }

    try {
      const repo = new CollectionPointRepository();
      const puntos = await repo.getAll();

      if (!montado.current) return;

      if (puntos.length === 0) {
        setError('No hay centros de acopio disponibles en este momento.');
        setCargando(false);
        return;
      }

      const masCercano = encontrarMasCercano(ubicacion, puntos);

      if (!masCercano) {
        setError('No se pudo determinar el centro de acopio más cercano.');
        setCargando(false);
        return;
      }

      setPunto(masCercano);
    } catch (err) {
      if (montado.current) {
        console.error('[NearbyAcopio] Error:', err);
        setError('Error al consultar los centros de acopio. Intenta de nuevo.');
      }
    } finally {
      if (montado.current) {
        setCargando(false);
      }
    }
  }, []);

  // Auto-detección al montar el componente
  useEffect(() => {
    if (autoDetectar && !buscado) {
      handleBuscar();
    }
  }, [autoDetectar, buscado, handleBuscar]);

  const abrirMapa = () => {
    if (!punto) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${punto.coordenadas.lat},${punto.coordenadas.lng}`;
    window.open(url, '_blank');
  };

  const estadoColor = {
    active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', label: 'Abierto ahora' },
    high_demand: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Alta demanda' },
    inactive: { bg: 'bg-gray-50', text: 'text-gray-500', dot: 'bg-gray-400', label: 'Cerrado' },
  };

  const estilo = punto ? estadoColor[punto.estado] : estadoColor.active;

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">near_me</span>
        <div>
          <h3 className="font-semibold text-on-surface">Centro de acopio más cercano</h3>
          <p className="text-xs text-outline">
            {autoDetectar && cargando && !punto
              ? 'Buscando centros cercanos...'
              : 'Lugar recomendado para entregar tus donaciones'}
          </p>
        </div>
      </div>

      {/* Skeleton loading para auto-detección */}
      {autoDetectar && cargando && !punto && !error && (
        <div className="flex items-center justify-center gap-3 py-8 bg-white rounded-3xl border border-outline-variant/40 animate-pulse">
          <svg className="animate-spin h-6 w-6 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-outline">Detectando tu ubicación...</p>
        </div>
      )}

      {/* Botón manual (solo si no está en auto-detección o si falló) */}
      {!autoDetectar && !punto && !cargando && (
        <button
          onClick={handleBuscar}
          className="w-full h-12 bg-primary hover:bg-primary-container disabled:bg-gray-300 text-white font-semibold rounded-2xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
        >
          <span className="material-symbols-outlined">my_location</span>
          Encontrar centro de acopio
        </button>
      )}

      {/* Botón re-intentar si auto-detección falló */}
      {autoDetectar && error && !cargando && (
        <button
          onClick={handleBuscar}
          className="w-full h-12 bg-primary hover:bg-primary-container text-white font-semibold rounded-2xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
        >
          <span className="material-symbols-outlined">refresh</span>
          Reintentar
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 bg-error-container rounded-xl">
          <span className="material-symbols-outlined text-error text-lg mt-0.5">error</span>
          <div>
            <p className="text-on-error-container text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Resultado: punto de acopio más cercano */}
      {punto && (
        <div className="bg-white rounded-3xl p-6 border border-outline-variant/40 shadow-sm animate-fade-in space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">store</span>
              </div>
              <div>
                <h4 className="font-semibold text-on-surface">{punto.nombre}</h4>
                <p className="text-xs text-outline">{punto.direccion}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${estilo.bg}`}>
              <span className={`w-2 h-2 rounded-full ${estilo.dot}`}></span>
              <span className={`text-xs font-semibold ${estilo.text}`}>{estilo.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low rounded-xl p-3 text-center">
              <p className="text-xs text-outline">Distancia</p>
              <p className="font-bold text-primary text-lg">{punto.distanciaKm} km</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-3 text-center">
              <p className="text-xs text-outline">Distrito</p>
              <p className="font-semibold text-on-surface text-sm">{punto.distrito}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={abrirMapa}
              className="flex-1 h-11 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">map</span>
              Ver en Google Maps
            </button>
            <button
              onClick={handleBuscar}
              className="h-11 px-4 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant text-sm font-medium rounded-xl transition cursor-pointer flex items-center gap-1"
              title="Buscar de nuevo"
            >
              <span className="material-symbols-outlined text-lg">refresh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
