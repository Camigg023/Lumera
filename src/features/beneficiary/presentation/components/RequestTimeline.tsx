import { TrackingStatus, TrackingEvent, TRACKING_STATUS_LABELS, TRACKING_STATUS_ICONS, TRACKING_ORDER } from '../../domain/entities/HelpRequest';

/**
 * Props para el componente de timeline.
 */
interface RequestTimelineProps {
  /** Estado actual de la solicitud */
  currentStatus: TrackingStatus;
  /** Historial completo de cambios de estado */
  statusHistory?: TrackingEvent[];
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Timeline visual que muestra el progreso de una solicitud a través de sus estados.
 * Cada estado tiene un icono, color y etiqueta.
 * Los estados completados aparecen en verde, el actual resaltado y los futuros en gris.
 */
export function RequestTimeline({ currentStatus, statusHistory = [], className = '' }: RequestTimelineProps) {
  const isCancelled = currentStatus === 'cancelada';
  /**
   * Determina si un estado está completado (anterior al actual).
   */
  const isCompleted = (status: TrackingStatus): boolean => {
    if (isCancelled) return false;
    return TRACKING_ORDER.indexOf(status) < TRACKING_ORDER.indexOf(currentStatus);
  };

  /**
   * Determina si un estado es el actual.
   */
  const isCurrent = (status: TrackingStatus): boolean => {
    return status === currentStatus;
  };

  /**
   * Encuentra la nota asociada a un estado en el historial.
   */
  const findNote = (status: TrackingStatus): string | undefined => {
    const event = statusHistory.find((e) => e.status === status);
    return event?.note;
  };

  /**
   * Formatea una fecha ISO a formato legible.
   */
  const formatTimestamp = (iso: string): string => {
    try {
      return new Date(iso).toLocaleString('es-CO', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  // Si está cancelada, mostrar timeline hasta el estado donde se canceló
  const timelineStates = isCancelled
    ? [...TRACKING_ORDER, 'cancelada' as TrackingStatus]
    : TRACKING_ORDER;

  return (
    <div className={`w-full ${className}`}>
      {/* Barra de progreso general */}
      {!isCancelled && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Inicio</span>
            <span>Entrega</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700 ease-out"
              style={{
                width: `${(TRACKING_ORDER.indexOf(currentStatus) / (TRACKING_ORDER.length - 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Timeline vertical */}
      <div className="relative">
        {/* Línea vertical conectora */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-0">
          {timelineStates.map((status, index) => {
            const icon = TRACKING_STATUS_ICONS[status];
            const label = TRACKING_STATUS_LABELS[status];
            const done = isCompleted(status);
            const active = isCurrent(status);
            const note = findNote(status);
            const timestamp = statusHistory.find((e) => e.status === status)?.timestamp;

            // Determinar el estado visual del nodo
            let nodeColor = 'bg-gray-300 border-gray-300';        // Pendiente

            if (isCancelled) {
              if (status === 'cancelada') {
                nodeColor = 'bg-red-500 border-red-500';
              } else if (TRACKING_ORDER.indexOf(status) < TRACKING_ORDER.indexOf(currentStatus === 'cancelada' ? 'en_revision' : currentStatus)) {
                nodeColor = 'bg-emerald-500 border-emerald-500';
              }
            } else if (done) {
              nodeColor = 'bg-emerald-500 border-emerald-500';   // Completado
            } else if (active) {
              nodeColor = 'bg-white border-orange-500 ring-4 ring-orange-100'; // Actual
            }

            return (
              <div key={status} className="relative flex items-start gap-4 pb-6 last:pb-0">
                {/* Indicador de línea conectando (se pinta sobre la anterior si está completada) */}
                {index > 0 && !isCancelled && (
                  <div
                    className={`absolute left-5 top-0 w-0.5 h-6 -translate-y-2 transition-colors duration-500 ${
                      done || active ? 'bg-emerald-400' : 'bg-gray-200'
                    }`}
                    style={{ zIndex: 0 }}
                  />
                )}

                {/* Nodo circular */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${nodeColor}`}
                  >
                    {done || (isCancelled && status !== 'cancelada') ? (
                      <span className="text-sm">✓</span>
                    ) : (
                      <span className="text-sm">{icon}</span>
                    )}
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0 pt-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-semibold ${
                        done
                          ? 'text-emerald-700'
                          : active
                          ? 'text-orange-700'
                          : isCancelled && status === 'cancelada'
                          ? 'text-red-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {label}
                    </span>
                    {active && !isCancelled && (
                      <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                        Actual
                      </span>
                    )}
                    {timestamp && (
                      <span className="text-xs text-gray-400">{formatTimestamp(timestamp)}</span>
                    )}
                  </div>

                  {/* Nota del evento */}
                  {note && (
                    <p className="text-xs text-gray-500 mt-1 italic bg-gray-50 p-2 rounded-lg border border-gray-100">
                      {note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
