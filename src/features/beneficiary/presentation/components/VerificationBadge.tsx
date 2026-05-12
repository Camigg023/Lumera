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
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  verified: {
    label: 'Verificado',
    bg: 'bg-green-50',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  rejected: {
    label: 'Rechazado',
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500',
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
