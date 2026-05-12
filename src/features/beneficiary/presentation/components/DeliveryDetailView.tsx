import { HelpRequest, CATEGORY_LABELS, CATEGORY_ICONS, URGENCY_LABELS, URGENCY_COLORS, TRACKING_STATUS_LABELS, anonymizeDonor } from '../../domain/entities/HelpRequest';
import { DeliveryEvidence } from './DeliveryEvidence';

/**
 * Props para la vista de detalle de una entrega recibida.
 */
interface DeliveryDetailViewProps {
  /** Entrega completada a mostrar */
  delivery: HelpRequest;
  /** Función para volver a la lista */
  onBack: () => void;
}

/**
 * Vista detallada de una entrega recibida.
 * Muestra: código único, fecha, productos, donador anonimizado,
 * evidencia (foto y firma), y toda la metadata de la entrega.
 */
export function DeliveryDetailView({ delivery, onBack }: DeliveryDetailViewProps) {
  const urgencyColors = URGENCY_COLORS[delivery.urgency];
  const anonymousDonor = anonymizeDonor(delivery.donorName);
  const deliveryCode = delivery.deliveryCode || `#${delivery.id.slice(-6).toUpperCase()}`;

  /**
   * Formatea fecha ISO a formato legible en español.
   */
  const formatDate = (iso?: string): string => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Encabezado con código único */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <span className="text-lg">←</span>
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Detalle de entrega</h2>
            <p className="text-sm text-gray-500">
              {delivery.beneficiaryName}
            </p>
          </div>
        </div>

        {/* Código único de entrega */}
        <div className="text-right">
          <div className="text-xs text-gray-400">Código único</div>
          <div className="text-sm font-mono font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
            {deliveryCode}
          </div>
        </div>
      </div>

      {/* Badge de entregada */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800 flex items-center gap-3">
        <span className="text-2xl">🎉</span>
        <div>
          <strong>Entrega completada</strong>
          <p className="text-emerald-600">
            Recibida el {formatDate(delivery.receivedAt || delivery.updatedAt)}
          </p>
        </div>
      </div>

      {/* Grid principal: Info + Donante */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Información general */}
        <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            📋 Información de la entrega
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Fecha de entrega</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(delivery.receivedAt || delivery.updatedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Urgencia original</p>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-0.5 ${urgencyColors.bg} ${urgencyColors.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${urgencyColors.dot}`} />
                {URGENCY_LABELS[delivery.urgency]}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Dirección de entrega</p>
              <p className="text-sm text-gray-900">{delivery.deliveryAddress || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total recibido</p>
              <p className="text-sm font-semibold text-gray-900">{delivery.totalKg} kg</p>
            </div>
          </div>

          {/* Productos entregados */}
          <div className="pt-2">
            <p className="text-xs text-gray-500 font-medium mb-2">Productos entregados:</p>
            <div className="space-y-1.5">
              {delivery.items.map((item) => (
                <div key={item.category} className="flex items-center gap-2 text-sm">
                  <span>{CATEGORY_ICONS[item.category]}</span>
                  <span className="text-gray-700">{CATEGORY_LABELS[item.category]}</span>
                  <span className="text-gray-900 font-semibold ml-auto">
                    {item.quantity} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notas de entrega */}
          {delivery.deliveryNotes && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1">Notas de entrega:</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {delivery.deliveryNotes}
              </p>
            </div>
          )}
        </div>

        {/* Información del donante (anonimizada) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            🤝 Donante
          </h3>

          <div className="text-center py-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center mb-3">
              <span className="text-2xl">🙋</span>
            </div>
            <p className="text-base font-semibold text-gray-900">{anonymousDonor}</p>
            <p className="text-xs text-gray-400 mt-1">
              {delivery.donorId
                ? `ID: #${delivery.donorId.slice(-6).toUpperCase()}`
                : 'Donante verificado'}
            </p>
          </div>
        </div>
      </div>

      {/* Evidencia de recepción */}
      <DeliveryEvidence
        photoUrl={delivery.deliveryPhotoUrl}
        signatureUrl={delivery.digitalSignatureUrl}
        beneficiaryName={delivery.beneficiaryName}
      />

      {/* Metadata adicional */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">
          📎 Metadata
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-500">
          <div>
            <span className="block text-gray-400">Solicitud ID</span>
            <span className="text-gray-700 font-mono">#{delivery.id.slice(-8).toUpperCase()}</span>
          </div>
          <div>
            <span className="block text-gray-400">Solicitada</span>
            <span className="text-gray-700">{formatDate(delivery.createdAt)}</span>
          </div>
          <div>
            <span className="block text-gray-400">Actualizada</span>
            <span className="text-gray-700">{formatDate(delivery.updatedAt)}</span>
          </div>
          <div>
            <span className="block text-gray-400">Estado</span>
            <span className="text-emerald-600 font-medium">{TRACKING_STATUS_LABELS[delivery.status]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
