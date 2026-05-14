import { useState, useEffect } from 'react';
import { AlertCircle, Package, Weight } from 'lucide-react';
import CodeDisplay from './components/CodeDisplay';
import DeliveryEvidence from './components/DeliveryEvidence';
import { obtenerDonacionesPorUsuario } from '../../services/donationService';

/**
 * Historial de donaciones del usuario con sus códigos de validación.
 */
export default function DonationHistory({ userId, onViewDetail }) {
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
      <div className="space-y-4 py-4">
        {/* Skeleton loading para historial */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-2xl p-5 border border-outline-variant/40 animate-pulse flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-surface-container-highest rounded w-1/4"></div>
              <div className="h-3 bg-surface-container-high rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-surface-container rounded-full w-16"></div>
                <div className="h-6 bg-surface-container rounded-full w-20"></div>
              </div>
            </div>
            <div className="w-24 h-24 bg-surface-container-high rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-error-container rounded-xl">
        <AlertCircle size={18} className="text-error shrink-0" />
        <p className="text-on-error-container text-sm">{error}</p>
      </div>
    );
  }

  if (donaciones.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-container-low flex items-center justify-center mb-4">
          <Package size={32} className="text-outline/50" />
        </div>
        <p className="font-semibold text-on-surface">Aún no hay donaciones registradas</p>
        <p className="text-sm text-outline mt-1">Las donaciones que realices aparecerán aquí con su código único</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-h3 text-on-surface">
          Mis donaciones
        </h3>
        <span className="text-sm text-outline font-medium bg-surface-container-low px-3 py-1 rounded-full">
          {donaciones.length} registros
        </span>
      </div>

      <div className="space-y-4">
        {donaciones.map((donacion) => {
          const totalKg = donacion.productos?.reduce(
            (acc, p) => acc + p.pesoUnidad * p.cantidad, 0
          ).toFixed(2) || '0';

          return (
            <div
              key={donacion.id}
              className="bg-surface rounded-2xl p-5 border border-outline-variant/40 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                {/* Info de la donación */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      donacion.estado === 'entregado' || donacion.estado === 'validado'
                        ? 'bg-success-container text-success'
                        : 'bg-accent-bg text-accent'
                    }`}>
                      {donacion.estado === 'entregado' || donacion.estado === 'validado'
                        ? '✅ Entregado'
                        : '⏳ Pendiente'}
                    </span>
                    <span className="text-xs font-medium text-outline flex items-center gap-1">
                      <Package size={14} />
                      {donacion.totalProductos}
                    </span>
                    <span className="text-xs font-medium text-outline flex items-center gap-1">
                      <Weight size={14} />
                      {totalKg} kg
                    </span>
                  </div>

                  {/* Lista de productos */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {donacion.productos?.map((p, i) => (
                      <span key={i} className="text-xs bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant px-2.5 py-1 rounded-lg truncate max-w-[160px] shadow-sm">
                        <span className="font-semibold text-primary mr-1">{p.cantidad}x</span>
                        {p.nombre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Código */}
                <div className="w-full sm:w-auto shrink-0 mt-4 sm:mt-0 flex justify-center">
                  <CodeDisplay codigo={donacion.codigoUnico} estado={donacion.estado} tamaño="sm" />
                </div>
              </div>


              <div className="mt-6 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
                <button 
                  onClick={() => onViewDetail && onViewDetail(donacion.codigoUnico, donacion)}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Package size={14} />
                  Ver detalles de trazabilidad
                </button>
                <span className="text-[10px] text-outline opacity-70">ID: {donacion.id?.slice(0, 8)}...</span>
              </div>

              {/* Evidencia de entrega (si aplica) */}
              <DeliveryEvidence donacion={donacion} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
