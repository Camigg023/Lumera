import { useState } from 'react';
import { obtenerUbicacionActual, encontrarMasCercano } from '../../../../../services/geolocationService';
import { CollectionPointRepository } from '../../../data/repositories/ICollectionPointRepository';

/**
 * Componente que encuentra y muestra el centro de acopio más cercano
 * usando la geolocalización del navegador.
 */
export default function NearbyAcopio() {
  const [cargando, setCargando] = useState(false);
  const [punto, setPunto] = useState(null);
  const [error, setError] = useState('');
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = async () => {
    setCargando(true);
    setError('');
    setPunto(null);
    setBuscado(true);

    // 1. Obtener ubicación del usuario
    const ubicacion = await obtenerUbicacionActual();

    if (!ubicacion) {
      setError(
        'No pudimos obtener tu ubicación. Asegúrate de permitir el acceso a la ubicación en tu navegador.'
      );
      setCargando(false);
      return;
    }

    // 2. Obtener puntos de acopio
    try {
      const repo = new CollectionPointRepository();
      const puntos = await repo.getAll();

      if (puntos.length === 0) {
        setError('No hay centros de acopio disponibles en este momento.');
        setCargando(false);
        return;
      }

      // 3. Encontrar el más cercano
      const masCercano = encontrarMasCercano(ubicacion, puntos);

      if (!masCercano) {
        setError('No se pudo determinar el centro de acopio más cercano.');
        setCargando(false);
        return;
      }

      setPunto(masCercano);
    } catch (err) {
      console.error('[NearbyAcopio] Error:', err);
      setError('Error al consultar los centros de acopio. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  /** Abre Google Maps con la ruta al punto de acopio */
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
            Encuentra dónde entregar tus productos donados
          </p>
        </div>
      </div>

      {/* Botón buscar */}
      <button
        onClick={handleBuscar}
        disabled={cargando}
        className="w-full h-12 bg-primary hover:bg-primary-container disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
      >
        {cargando ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Buscando ubicación...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">my_location</span>
            Encontrar centro de acopio
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 px-4 py-3 bg-error-container rounded-xl">
          <span className="material-symbols-outlined text-error text-lg mt-0.5">error</span>
          <div>
            <p className="text-on-error-container text-sm font-medium">{error}</p>
            {!buscado && (
              <button
                onClick={handleBuscar}
                className="text-xs text-on-error-container underline mt-1 cursor-pointer"
              >
                Reintentar
              </button>
            )}
          </div>
        </div>
      )}

      {/* Resultado: punto de acopio más cercano */}
      {punto && (
        <div className="bg-white rounded-3xl p-6 border border-outline-variant/40 shadow-sm animate-fade-in space-y-4">
          {/* Header del punto */}
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

          {/* Detalles */}
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

          {/* Acciones */}
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
