import { VerificationStatus } from '../../domain/entities/Beneficiary';

/**
 * Props para el componente VerificationBadge.
 */
interface VerificationBadgeProps {
  /** Estado de verificación a mostrar */
  status: VerificationStatus;
  /** Clases CSS adicionales */
  className?: string;
  /** Tamaño del badge */
  size?: 'sm' | 'md' | 'lg';
}

// Mapeo de estado a colores, íconos y etiquetas
const STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    bg: 'bg-warning-container',
    text: 'text-on-surface',
    border: 'border-warning/20',
    dot: 'bg-warning',
  },
  verified: {
    label: 'Verificado',
    bg: 'bg-success-container',
    text: 'text-on-success-container',
    border: 'border-success/20',
    dot: 'bg-success',
  },
  rejected: {
    label: 'Rechazado',
    bg: 'bg-error-container',
    text: 'text-on-error-container',
    border: 'border-error/20',
    dot: 'bg-error',
  },
};

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-1.5 gap-2',
};

/**
 * Componente reutilizable que muestra el estado de verificación documental
 * con un indicador visual de color (ámbar/verde/rojo).
 * Cumple WCAG AA con contraste suficiente en los colores seleccionados.
 */
export function VerificationBadge({ status, className = '', size = 'md' }: VerificationBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${config.bg} ${config.text} ${config.border}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
      role="status"
      aria-label={`Estado: ${config.label}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
