/**
 * Tipos de beneficiario disponibles en la plataforma Lumera.
 * Ahora enfocados en personas naturales.
 */
export type BeneficiaryType = 'persona_natural' | 'cabeza_familia' | 'adulto_mayor' | 'otro';

/**
 * Estado de validación documental del beneficiario.
 */
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

/**
 * Tipo de documento requerido para la validación del beneficiario persona natural.
 */
export type DocumentType = 'cedula_frontal' | 'cedula_posterior' | 'cuenta_servicios' | 'foto_perfil';

/**
 * Etiquetas legibles para los tipos de beneficiario.
 */
export const BENEFICIARY_TYPE_LABELS: Record<BeneficiaryType, string> = {
  persona_natural: 'Persona Natural',
  cabeza_familia: 'Cabeza de Familia',
  adulto_mayor: 'Adulto Mayor',
  otro: 'Otro',
};

/**
 * Etiquetas legibles para los tipos de documento.
 */
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  cedula_frontal: 'Cédula (Frontal)',
  cedula_posterior: 'Cédula (Posterior)',
  cuenta_servicios: 'Cuenta de Servicios',
  foto_perfil: 'Foto de Perfil / Ubicación',
};

/**
 * Representa un documento subido por el beneficiario para su validación.
 */
export interface BeneficiaryDocument {
  /** Identificador único del documento */
  id: string;
  /** Tipo de documento */
  type: DocumentType;
  /** Nombre original del archivo */
  fileName: string;
  /** URL pública de almacenamiento en Firebase Storage */
  storageUrl: string;
  /** Fecha de subida ISO-8601 */
  uploadedAt: string;
}

/**
 * Representa un beneficiario completo registrado en Lumera.
 * Ahora enfocado en personas naturales: nombre completo, cédula,
 * dirección, documentos de identidad y cuenta de servicios.
 */
export interface Beneficiary {
  /** ID interno (mismo que uid del usuario en Firebase Auth) */
  id: string;
  /** ID del usuario propietario en Firebase Auth */
  userId: string;
  /** Nombre completo de la persona */
  fullName: string;
  /** Número de cédula de identidad */
  documentId: string;
  /** Dirección física de residencia */
  address: string;
  /** Ciudad de residencia */
  city: string;
  /** Teléfono de contacto */
  phone: string;
  /** Tipo de beneficiario (Persona Natural, etc.) */
  beneficiaryType: BeneficiaryType;
  /** Documentos subidos para validación */
  documents: BeneficiaryDocument[];
  /** Latitud de la ubicación (geolocalización) */
  latitude?: number;
  /** Longitud de la ubicación (geolocalización) */
  longitude?: number;
  /** Estado de verificación documental */
  verificationStatus: VerificationStatus;
  /** Notas o motivo de rechazo en caso de verificationStatus === 'rejected' */
  verificationNotes?: string;
  /** Fecha de creación ISO-8601 */
  createdAt: string;
  /** Fecha de última actualización ISO-8601 */
  updatedAt: string;
}
