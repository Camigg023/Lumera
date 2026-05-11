import { useState, useEffect } from 'react';
import CodeDisplay from './components/CodeDisplay';
import { obtenerDonacionesPorUsuario } from '../../services/donationService';

/**
 * Historial de donaciones del usuario con sus códigos de validación.
 */
export default function DonationHistory({ userId }) {
  const [donaciones, setDonaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setCargando(false);
      return;
    }

    const cargar = async () => {
      try {
        const data = await obtenerDonacionesPorUsuario(userId);
        setDonaciones(data);
      } catch (err) {
        console.error('[DonationHistory] Error:', err);
        setError('Error al cargar el historial');
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [userId]);

  if (cargando) {
    return (
      <div className="text-center py-8">
        <svg className="animate-spin h-8 w-8 mx-auto text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-sm text-outline mt-2">Cargando donaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-error-container rounded-xl">
        <span className="material-symbols-outlined text-error">error</span>
        <p className="text-on-error-container text-sm">{error}</p>
      </div>
    );
  }

  if (donaciones.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-container-low flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl text-outline/50">inventory_2</span>
        </div>
        <p className="font-semibold text-on-surface">No hay donaciones registradas</p>
        <p className="text-sm text-outline mt-1">Las donaciones que realices aparecerán aquí con su código único</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-h3 text-on-surface">
          Mis donaciones
        </h3>
        <span className="text-sm text-outline">{donaciones.length} registros</span>
      </div>

      <div className="space-y-3">
        {donaciones.map((donacion) => {
          const totalKg = donacion.productos?.reduce(
            (acc, p) => acc + p.pesoUnidad * p.cantidad, 0
          ).toFixed(2) || '0';

          return (
            <div
              key={donacion.id}
              className="bg-white rounded-2xl p-5 border border-outline-variant/40 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Info de la donación */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      donacion.estado === 'entregado' || donacion.estado === 'validado'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {donacion.estado === 'entregado' || donacion.estado === 'validado'
                        ? '✅ Entregado'
                        : '⏳ Pendiente'}
                    </span>
                    <span className="text-xs text-outline">
                      {donacion.totalProductos} productos
                    </span>
                    <span className="text-xs text-outline">
                      {totalKg} kg
                    </span>
                  </div>

                  {/* Lista pequeña de productos */}
                  <div className="flex flex-wrap gap-1.5">
                    {donacion.productos?.slice(0, 3).map((p, i) => (
                      <span key={i} className="text-xs bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded-full truncate max-w-[140px]">
                        {p.nombre} x{p.cantidad}
                      </span>
                    ))}
                    {donacion.productos?.length > 3 && (
                      <span className="text-xs text-outline">
                        +{donacion.productos.length - 3} más
                      </span>
                    )}
                  </div>
                </div>

                {/* Código */}
                <CodeDisplay codigo={donacion.codigoUnico} estado={donacion.estado} tamaño="sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
