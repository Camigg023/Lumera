import {
  HelpRequest,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  URGENCY_COLORS,
  URGENCY_LABELS,
  TRACKING_STATUS_LABELS,
  TRACKING_STATUS_COLORS,
  TRACKING_ORDER,
} from '../../domain/entities/HelpRequest';

/**
 * Props para la tarjeta de solicitud de ayuda.
 */
interface HelpRequestCardProps {
  /** Solicitud a mostrar */
  request: HelpRequest;
  /** Función para cancelar la solicitud */
  onCancel?: (requestId: string) => Promise<void>;
  /** Indica si está procesando la cancelación */
  isCancelling?: boolean;
  /** Función para ver el tracking de la solicitud */
  onViewTracking?: (requestId: string) => void;
}

/**
 * Tarjeta individual que muestra el resumen de una solicitud de ayuda.
 * Incluye productos, urgencia, estado, timeline simplificado y acciones disponibles.
 */
export function HelpRequestCard({ request, onCancel, isCancelling = false, onViewTracking }: HelpRequestCardProps) {
  const urgencyColors = URGENCY_COLORS[request.urgency];
  const statusColors = TRACKING_STATUS_COLORS[request.status];
  const isActive = request.status === 'enviada' || request.status === 'en_revision' || request.status === 'aprobada';
  const canTrack = request.status !== 'cancelada';

  /**
   * Calcula el porcentaje de progreso en el timeline.
   */
  const progressPercent = (() => {
    if (request.status === 'cancelada') return 0;
    const idx = TRACKING_ORDER.indexOf(request.status);
    if (idx === -1) return 0;
    return Math.round((idx / (TRACKING_ORDER.length - 1)) * 100);
  })();

  /**
   * Formatea la fecha de creación.
   */
  const formatDate = (iso: string) => {
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
    <article
      className="rounded-xl border overflow-hidden transition-all hover:shadow-md"
      style={{
        backgroundColor: 'var(--lumera-bg)',
        borderColor: 'var(--lumera-border)',
      }}
      aria-label={`Solicitud #${request.id.slice(-6).toUpperCase()}, ${TRACKING_STATUS_LABELS[request.status]}`}
    >
      {/* Encabezado con estado y urgencia */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{
          borderColor: 'var(--lumera-border)',
          backgroundColor: 'var(--lumera-bg-tertiary)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${urgencyColors.bg} ${urgencyColors.text}`}
            aria-label={`Urgencia: ${URGENCY_LABELS[request.urgency]}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${urgencyColors.dot}`} aria-hidden="true" />
            {URGENCY_LABELS[request.urgency]}
          </span>
          <span className="text-xs" style={{ color: 'var(--lumera-text-muted)' }} aria-hidden="true">
            #{request.id.slice(-6).toUpperCase()}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
          role="status"
          aria-label={`Estado: ${TRACKING_STATUS_LABELS[request.status]}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot}`} aria-hidden="true" />
          {TRACKING_STATUS_LABELS[request.status]}
        </span>
      </div>

      {/* Cuerpo */}
      <div className="p-4 space-y-3">
        {/* Barra de progreso simplificada */}
        {request.status !== 'cancelada' && (
          <div className="space-y-1" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso: ${progressPercent}%`}>
            <div className="flex justify-between text-xs" style={{ color: 'var(--lumera-text-muted)' }}>
              <span>Progreso</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ backgroundColor: 'var(--lumera-bg-tertiary)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(to right, var(--lumera-primary), var(--lumera-success))',
                }}
              />
            </div>
          </div>
        )}

        {/* Productos solicitados */}
        <div className="space-y-1">
          <p className="text-xs font-medium" style={{ color: 'var(--lumera-text-muted)' }}>Productos:</p>
          <div className="grid grid-cols-2 gap-1">
            {request.items.map((item) => (
              <div key={item.category} className="flex items-center gap-1.5 text-sm">
                <span aria-hidden="true">{CATEGORY_ICONS[item.category]}</span>
                <span className="text-xs truncate" style={{ color: 'var(--lumera-text-secondary)' }}>{CATEGORY_LABELS[item.category]}</span>
                <span className="font-semibold text-xs ml-auto" style={{ color: 'var(--lumera-text)' }}>
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donador asignado */}
        {request.donorName && (
          <div
            className="flex items-center gap-2 text-xs p-2 rounded-lg"
            style={{
              color: 'var(--lumera-text-secondary)',
              backgroundColor: 'var(--lumera-primary-light)',
            }}
          >
            <span aria-hidden="true">🤝</span>
            <span>Donador: <strong style={{ color: 'var(--lumera-text)' }}>{request.donorName}</strong></span>
          </div>
        )}

        {/* ETA si está en tránsito */}
        {request.status === 'en_transito' && request.etaMinutes !== undefined && (
          <div
            className="flex items-center gap-2 text-xs p-2 rounded-lg"
            style={{
              color: 'var(--lumera-primary)',
              backgroundColor: 'var(--lumera-primary-light)',
            }}
            aria-label={`Tiempo estimado de llegada: ${request.etaMinutes} minutos`}
          >
            <span aria-hidden="true">🚚</span>
            <span>
              Tiempo estimado:{' '}
              <strong>
                {request.etaMinutes < 60
                  ? `${request.etaMinutes} min`
                  : `${Math.floor(request.etaMinutes / 60)}h ${request.etaMinutes % 60}min`}
              </strong>
            </span>
          </div>
        )}

        {/* Fecha */}
        <div
          className="text-xs pt-1 border-t"
          style={{
            color: 'var(--lumera-text-muted)',
            borderColor: 'var(--lumera-border)',
          }}
        >
          {formatDate(request.createdAt)}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-1">
          {canTrack && onViewTracking && (
            <button
              onClick={() => onViewTracking(request.id)}
              className="flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer"
              style={{
                color: 'var(--lumera-primary)',
                backgroundColor: 'var(--lumera-primary-light)',
              }}
              aria-label={`Ver seguimiento de solicitud #${request.id.slice(-6).toUpperCase()}`}
            >
              Ver seguimiento
            </button>
          )}
          {isActive && onCancel && (
            <button
              onClick={() => onCancel(request.id)}
              disabled={isCancelling}
              className="flex-1 py-2 text-xs font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                color: 'var(--lumera-error)',
                backgroundColor: 'rgba(229, 57, 53, 0.1)',
              }}
              aria-label={`Cancelar solicitud #${request.id.slice(-6).toUpperCase()}`}
            >
              {isCancelling ? 'Cancelando...' : 'Cancelar'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
