import { BeneficiaryRepository } from '../repositories/BeneficiaryRepository';
import { BeneficiaryDocument, DocumentType } from '../entities/Beneficiary';

/**
 * Tipos de documento v�lidos para la validaci�n de beneficiarios persona natural.
 * Deben coincidir con los definidos en la entidad Beneficiary (DocumentType).
 */
const VALID_DOCUMENT_TYPES: DocumentType[] = [
  'cedula_frontal',
  'cedula_posterior',
  'cuenta_servicios',
  'foto_perfil',
];

/**
 * Tipos MIME permitidos para la subida de documentos.
 */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

/** Tama�o m�ximo permitido: 10 MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Caso de uso: Subir un documento de validaci�n para un beneficiario.
 * Maneja la subida del archivo a Firebase Storage y el registro en Firestore.
 *
 * Validaciones:
 * - Usuario autenticado (userId no vac�o)
 * - Archivo seleccionado
 * - Tipo MIME permitido (JPG, PNG, WEBP, PDF)
 * - Tama�o m�ximo 10 MB
 * - Tipo de documento v�lido (cedula_frontal, cedula_posterior, cuenta_servicios, foto_perfil)
 */
export class UploadDocument {
  constructor(private repository: BeneficiaryRepository) {}

  /**
   * Ejecuta la subida de un documento de validaci�n.
   *
   * @param userId - ID del usuario propietario (Firebase Auth UID)
   * @param file - Archivo a subir (PDF, JPG, PNG, WEBP)
   * @param docType - Tipo de documento (cedula_frontal, cedula_posterior, cuenta_servicios, foto_perfil)
   * @returns Promise con el documento creado (incluye storageUrl para visualizaci�n)
   * @throws Error si el archivo o tipo de documento son inv�lidos
   */
  async execute(userId: string, file: File, docType: string): Promise<BeneficiaryDocument> {
    // ─── Validar userId ───
    if (!userId || userId.trim() === '') {
      throw new Error('El ID de usuario es requerido.');
    }

    // ─── Validar archivo ───
    if (!file) {
      throw new Error('Debe seleccionar un archivo para subir.');
    }

    // Validar tipo MIME
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error('Formato de archivo no permitido. Use JPG, PNG, WEBP o PDF.');
    }

    // Validar tama�o m�ximo
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('El archivo es demasiado grande. Tama�o m�ximo: 10 MB.');
    }

    // ─── Validar tipo de documento ───
    if (!VALID_DOCUMENT_TYPES.includes(docType as DocumentType)) {
      throw new Error(
        `Tipo de documento inv�lido: "${docType}". ` +
        `Los v�lidos son: ${VALID_DOCUMENT_TYPES.join(', ')}`
      );
    }

    // ─── Ejecutar subida ───
    return this.repository.uploadDocument(userId, file, docType);
  }
}
