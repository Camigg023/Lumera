import { HelpRequest, CATEGORY_LABELS, CATEGORY_ICONS, anonymizeDonor } from '../../domain/entities/HelpRequest';

/**
 * Props para la lista de historial de entregas recibidas.
 */
interface DeliveryHistoryListProps {
  /** Lista de entregas completadas */
  deliveries: HelpRequest[];
  /** Función para ver el detalle de una entrega */
  onViewDetail: (delivery: HelpRequest) => void;
  /** Indica si está cargando */
  isLoading?: boolean;
}

/**
 * Lista completa de todas las entregas recibidas por el beneficiario.
 * Muestra cada entrega como una tarjeta con: código único, fecha,
 * productos, cantidad total, donante anonimizado y un botón para ver detalle.
 *
 * Diseñado para la sección "Historial de ayudas recibidas".
 */
export function DeliveryHistoryList({
  deliveries,
  onViewDetail,
  isLoading = false,
}: DeliveryHistoryListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (deliveries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No hay entregas recibidas aún
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Cuando complete solicitudes de donación y sean entregadas, aparecerán aquí
          con todos los detalles, evidencia y código único de cada entrega.
        </p>
      </div>
    );
  }

  /**
   * Formatea fecha ISO a formato corto.
   */
  const formatShortDate = (iso: string): string => {
    try {
      return new Date(iso).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-3">
      {/* Encabezado con total */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">
          <strong className="text-gray-900">{deliveries.length}</strong> entrega(s) recibida(s)
        </p>
        <p className="text-sm text-gray-500">
          Total: <strong className="text-gray-900">
            {deliveries.reduce((sum, d) => sum + (d.totalKg || 0), 0)} kg
          </strong>
        </p>
      </div>

      {deliveries.map((delivery) => {
        const deliveryCode = delivery.deliveryCode || `#${delivery.id.slice(-6).toUpperCase()}`;
        const anonymousDonor = anonymizeDonor(delivery.donorName);

        return (
          <div
            key={delivery.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
          >
            {/* Cabecera de la tarjeta */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-white border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎉</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {deliveryCode}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatShortDate(delivery.receivedAt || delivery.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Donado por: <strong className="text-gray-700">{anonymousDonor}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => onViewDetail(delivery)}
                className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                Ver detalle →
              </button>
            </div>

            {/* Cuerpo: productos */}
            <div className="px-4 py-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {delivery.items.map((item) => (
                  <div key={item.category} className="flex items-center gap-1.5 text-sm">
                    <span>{CATEGORY_ICONS[item.category]}</span>
                    <span className="text-xs text-gray-600 truncate">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                    <span className="text-xs font-semibold text-gray-900 ml-auto">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer: total + evidencia disponible */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span>
                  Total: <strong className="text-gray-700">{delivery.totalKg} kg</strong>
                </span>
                {delivery.deliveryPhotoUrl && <span>📸 Foto</span>}
                {delivery.digitalSignatureUrl && <span>✍️ Firma</span>}
              </div>
              <button
                onClick={() => onViewDetail(delivery)}
                className="text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer sm:hidden"
              >
                Ver detalle →
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
