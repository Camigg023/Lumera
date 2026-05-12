import { BeneficiaryType } from './Beneficiary';

// ─── TIPOS ───────────────────────────────────────────

/**
 * Categorías de productos disponibles para solicitar.
 */
export type ProductCategory = 'no_perecederos' | 'frescos' | 'lacteos' | 'panaderia';

/**
 * Nivel de urgencia de la solicitud.
 */
export type UrgencyLevel = 'bajo' | 'medio' | 'alto' | 'critico';

/**
 * Estados granulares del ciclo de vida de una solicitud.
 * - enviada: Recién creada, esperando revisión
 * - en_revision: Un administrador está evaluando la solicitud
 * - aprobada: Solicitud aprobada, asignada a un donador/empresa
 * - en_preparacion: El donador está preparando los alimentos
 * - en_transito: Los alimentos están en camino
 * - entregada: Entregada satisfactoriamente al beneficiario
 * - cancelada: Cancelada por el beneficiario o el administrador
 */
export type TrackingStatus =
  | 'enviada'
  | 'en_revision'
  | 'aprobada'
  | 'en_preparacion'
  | 'en_transito'
  | 'entregada'
  | 'cancelada';

/**
 * Estado simplificado para operaciones de negocio (compatible con versiones anteriores).
 */
export type RequestStatus = TrackingStatus;

// ─── CONSTANTES ──────────────────────────────────────

/**
 * Etiquetas legibles para categorías de producto.
 */
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  no_perecederos: 'Alimentos no perecederos',
  frescos: 'Frescos (frutas/verduras)',
  lacteos: 'Lácteos',
  panaderia: 'Panadería',
};

/**
 * Iconos para cada categoría.
 */
export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  no_perecederos: '🥫',
  frescos: '🥦',
  lacteos: '🥛',
  panaderia: '🥖',
};

/**
 * Etiquetas para nivel de urgencia.
 */
export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  bajo: 'Bajo',
  medio: 'Medio',
  alto: 'Alto',
  critico: 'Crítico',
};

/**
 * Colores para cada nivel de urgencia (clases Tailwind).
 */
export const URGENCY_COLORS: Record<UrgencyLevel, { bg: string; text: string; dot: string }> = {
  bajo: { bg: 'bg-blue-50', text: 'text-blue-800', dot: 'bg-blue-500' },
  medio: { bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-400' },
  alto: { bg: 'bg-orange-50', text: 'text-orange-800', dot: 'bg-orange-500' },
  critico: { bg: 'bg-red-50', text: 'text-red-800', dot: 'bg-red-500' },
};

/**
 * Etiquetas legibles para cada estado de tracking.
 */
export const TRACKING_STATUS_LABELS: Record<TrackingStatus, string> = {
  enviada: 'Solicitud enviada',
  en_revision: 'En revisión',
  aprobada: 'Aprobada',
  en_preparacion: 'En preparación',
  en_transito: 'En tránsito',
  entregada: 'Entregada',
  cancelada: 'Cancelada',
};

/**
 * Iconos para cada estado del timeline.
 */
export const TRACKING_STATUS_ICONS: Record<TrackingStatus, string> = {
  enviada: '📝',
  en_revision: '🔍',
  aprobada: '✅',
  en_preparacion: '📦',
  en_transito: '🚚',
  entregada: '🎉',
  cancelada: '❌',
};

/**
 * Colores para cada estado del timeline (clases Tailwind).
 */
export const TRACKING_STATUS_COLORS: Record<TrackingStatus, { border: string; bg: string; text: string; dot: string }> = {
  enviada:        { border: 'border-blue-400',     bg: 'bg-blue-50',     text: 'text-blue-800',     dot: 'bg-blue-500' },
  en_revision:    { border: 'border-amber-400',    bg: 'bg-amber-50',    text: 'text-amber-800',    dot: 'bg-amber-400' },
  aprobada:       { border: 'border-green-400',    bg: 'bg-green-50',    text: 'text-green-800',    dot: 'bg-green-500' },
  en_preparacion: { border: 'border-purple-400',   bg: 'bg-purple-50',   text: 'text-purple-800',   dot: 'bg-purple-500' },
  en_transito:    { border: 'border-orange-400',   bg: 'bg-orange-50',   text: 'text-orange-800',   dot: 'bg-orange-500' },
  entregada:      { border: 'border-emerald-400',  bg: 'bg-emerald-50',  text: 'text-emerald-800',  dot: 'bg-emerald-500' },
  cancelada:      { border: 'border-red-400',      bg: 'bg-red-50',      text: 'text-red-800',      dot: 'bg-red-500' },
};

/**
 * Orden de los estados en el timeline.
 */
export const TRACKING_ORDER: TrackingStatus[] = [
  'enviada',
  'en_revision',
  'aprobada',
  'en_preparacion',
  'en_transito',
  'entregada',
];

/**
 * Límite máximo de kg permitido por solicitud según tipo de beneficiario.
 * Para personas naturales el límite es menor que para organizaciones.
 */
export const KG_LIMITS_BY_TYPE: Record<BeneficiaryType, number> = {
  persona_natural: 50,
  cabeza_familia: 60,
  adulto_mayor: 70,
  otro: 50,
};

/**
 * Máximo de solicitudes activas permitidas por semana.
 */
export const MAX_ACTIVE_REQUESTS_PER_WEEK = 1;

/**
 * Unidad de medida para cada categoría de producto.
 */
export const CATEGORY_UNITS: Record<ProductCategory, 'kg' | 'unidades'> = {
  no_perecederos: 'kg',
  frescos: 'kg',
  lacteos: 'unidades',
  panaderia: 'unidades',
};

// ─── HELPERS ────────────────────────────────────────

/**
 * Genera un código único de entrega con formato LMR-XXXX-XXXX.
 * Usa caracteres alfanuméricos en mayúscula (excluye vocales para evitar palabras accidentales).
 */
export function generateDeliveryCode(): string {
  const chars = 'BCDFGHJKLMNPQRSTVWXYZ23456789';
  const pick = () => chars[Math.floor(Math.random() * chars.length)];
  const block = (len: number) => Array.from({ length: len }, pick).join('');
  return `LMR-${block(4)}-${block(4)}`;
}

/**
 * Anonimiza el nombre de un donador para mostrar en la interfaz.
 * Muestra solo el primer nombre y la inicial del apellido.
 * Ejemplo: "Carlos Martínez López" → "Carlos M."
 *          "María Gómez" → "María G."
 * Si no hay nombre, retorna "Donante Anónimo".
 */
export function anonymizeDonor(fullName?: string): string {
  if (!fullName || fullName.trim() === '') return 'Donante Anónimo';
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() + '.' : '';
  return lastInitial ? `${firstName} ${lastInitial}` : firstName;
}

// ─── ENTIDADES ───────────────────────────────────────

/**
 * Evento individual en el timeline de una solicitud.
 */
export interface TrackingEvent {
  /** Estado al que se transitó */
  status: TrackingStatus;
  /** Fecha ISO-8601 del cambio */
  timestamp: string;
  /** Nota opcional sobre el cambio */
  note?: string;
  /** Nombre de quien realizó el cambio */
  updatedBy?: string;
}

/**
 * Ubicación en tiempo real de la entrega (cuando está en tránsito).
 */
export interface DeliveryLocation {
  /** Latitud actual */
  latitude: number;
  /** Longitud actual */
  longitude: number;
  /** Dirección legible */
  address?: string;
  /** Última actualización ISO-8601 */
  updatedAt: string;
}

/**
 * Ítem individual dentro de una solicitud de ayuda.
 */
export interface HelpRequestItem {
  category: ProductCategory;
  quantity: number;
  unit: 'kg' | 'unidades';
}

/**
 * Puntaje de prioridad asignado a una solicitud.
 */
export interface PriorityScore {
  /** Puntaje total (0-100) */
  total: number;
  /** Desglose de cada factor */
  breakdown: {
    timeSinceLastHelp: number;    // 0-25
    peopleServed: number;         // 0-20
    urgency: number;              // 0-25
    distanceToCenter: number;     // 0-15
    complianceHistory: number;    // 0-15
  };
}

/**
 * Solicitud de ayuda realizada por un beneficiario con tracking completo.
 */
export interface HelpRequest {
  /** ID único de la solicitud (Firestore doc id) */
  id: string;
  /** ID del beneficiario que solicita */
  beneficiaryId: string;
  /** Nombre de la organización beneficiaria */
  beneficiaryName: string;
  /** Tipo de organización beneficiaria */
  beneficiaryType: BeneficiaryType;
  /** Productos solicitados */
  items: HelpRequestItem[];
  /** Nivel de urgencia */
  urgency: UrgencyLevel;
  /** Justificación de la necesidad */
  justification: string;
  /** Estado actual de la solicitud */
  status: TrackingStatus;
  /** Total de kg/unidades sumados */
  totalKg: number;
  /** Fecha de creación ISO-8601 */
  createdAt: string;
  /** Fecha de última actualización ISO-8601 */
  updatedAt: string;
  /** Fecha de inicio de la semana ISO-8601 (lunes) */
  weekStart: string;

  // ─── CAMPOS DE TRACKING ───
  /** Historial completo de cambios de estado */
  statusHistory?: TrackingEvent[];
  /** Ubicación actual de la entrega (en tránsito) */
  deliveryLocation?: DeliveryLocation;
  /** Dirección de entrega */
  deliveryAddress?: string;
  /** Tiempo estimado de llegada en minutos */
  etaMinutes?: number;
  /** Nombre del donador/empresa asignada */
  donorName?: string;
  /** ID del donador/empresa asignada */
  donorId?: string;

  // ─── CAMPOS DE EVIDENCIA Y CIERRE ───
  /** Código único de entrega (ej: LMR-A3F2-7C1D) */
  deliveryCode?: string;
  /** URL de la foto de evidencia de recepción */
  deliveryPhotoUrl?: string;
  /** URL de la firma digital de recepción */
  digitalSignatureUrl?: string;
  /** Fecha ISO-8601 en que se recibió la entrega */
  receivedAt?: string;
  /** Notas sobre la entrega */
  deliveryNotes?: string;

  // ─── CAMPOS DE PRIORIDAD ───
  /** Número estimado de personas atendidas por esta organización */
  peopleServed?: number;
  /** Fecha ISO-8601 de la última ayuda recibida */
  lastHelpDate?: string;
  /** Distancia en km al centro de acopio más cercano */
  distanceToCenter?: number;
  /** Historial de cumplimiento: entregas completadas / total */
  complianceRate?: number;
  /** Puntaje de prioridad calculado */
  priorityScore?: PriorityScore;
}
