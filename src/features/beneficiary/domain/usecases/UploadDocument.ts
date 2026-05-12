import { BeneficiaryRepository } from '../repositories/BeneficiaryRepository';
import { BeneficiaryDocument } from '../entities/Beneficiary';

/**
 * Caso de uso: Subir un documento de validación para un beneficiario.
 * Maneja la subida del archivo a Firebase Storage y el registro en Firestore.
 */
export class UploadDocument {
  constructor(private repository: BeneficiaryRepository) {}

  /**
   * Ejecuta la subida de un documento de validación.
   * Valida el tipo de archivo y el tipo de documento antes de subir.
   * @param userId - ID del usuario propietario
   * @param file - Archivo a subir (PDF, JPG, PNG)
   * @param docType - Tipo de documento
   * @returns Promise con el documento creado
   * @throws Error si el archivo o tipo de documento son inválidos
   */
  async execute(userId: string, file: File, docType: string): Promise<BeneficiaryDocument> {
    if (!userId || userId.trim() === '') {
      throw new Error('El ID de usuario es requerido.');
    }
    if (!file) {
      throw new Error('Debe seleccionar un archivo para subir.');
    }
    
    // Validar tipo de archivo permitido
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Formato de archivo no permitido. Use JPG, PNG o PDF.');
    }

    // Validar tamaño máximo (10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Tamaño máximo: 10 MB.');
    }

    // Validar tipo de documento
    const validDocTypes = ['cedula', 'certificado_existencia', 'foto_local'];
    if (!validDocTypes.includes(docType)) {
      throw new Error('Tipo de documento inválido.');
    }

    return this.repository.uploadDocument(userId, file, docType);
  }
}
