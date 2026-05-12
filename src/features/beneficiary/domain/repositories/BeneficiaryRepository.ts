import { Beneficiary, BeneficiaryDocument, VerificationStatus } from '../entities/Beneficiary';

/**
 * Interfaz del repositorio de beneficiarios.
 * Define el contrato para acceder a datos de beneficiarios desde cualquier fuente
 * (Firebase, mock, etc.). El datasource concreto implementa esta interfaz.
 */
export interface BeneficiaryRepository {
  /**
   * Obtiene el perfil de beneficiario por ID de usuario.
   * @param userId - ID del usuario en Firebase Auth
   * @returns Promise con el beneficiario encontrado
   */
  getBeneficiary(userId: string): Promise<Beneficiary>;

  /**
   * Crea un nuevo registro de beneficiario.
   * @param data - Datos parciales del beneficiario a crear
   * @returns Promise con el beneficiario creado
   */
  createBeneficiary(data: Partial<Beneficiary>): Promise<Beneficiary>;

  /**
   * Actualiza los datos de un beneficiario existente.
   * @param userId - ID del usuario propietario
   * @param updates - Campos a actualizar
   * @returns Promise con el beneficiario actualizado
   */
  updateBeneficiary(userId: string, updates: Partial<Beneficiary>): Promise<Beneficiary>;

  /**
   * Cambia el estado de verificación de un beneficiario.
   * @param userId - ID del usuario a verificar/rechazar
   * @param status - Nuevo estado ('verified' | 'rejected')
   * @param notes - Notas opcionales (ej: motivo de rechazo)
   * @returns Promise con el beneficiario actualizado
   */
  verifyBeneficiary(userId: string, status: VerificationStatus, notes?: string): Promise<Beneficiary>;

  /**
   * Sube un documento a Firebase Storage y registra su metadata en Firestore.
   * @param userId - ID del usuario propietario
   * @param file - Archivo a subir (Blob/File)
   * @param docType - Tipo de documento
   * @returns Promise con el documento creado
   */
  uploadDocument(userId: string, file: File, docType: string): Promise<BeneficiaryDocument>;

  /**
   * Lista todos los beneficiarios registrados (para administración).
   * @returns Promise con arreglo de beneficiarios
   */
  listBeneficiaries(): Promise<Beneficiary[]>;

  /**
   * Lista beneficiarios filtrados por estado de verificación.
   * @param status - Estado de verificación a filtrar
   * @returns Promise con arreglo de beneficiarios filtrados
   */
  getBeneficiariesByStatus(status: VerificationStatus): Promise<Beneficiary[]>;
}
