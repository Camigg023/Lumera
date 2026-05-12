import { BeneficiaryRepository } from '../repositories/BeneficiaryRepository';
import { Beneficiary } from '../entities/Beneficiary';

/**
 * Caso de uso: Crear un nuevo registro de beneficiario (persona natural).
 * Valida los datos requeridos antes de delegar al repositorio.
 */
export class CreateBeneficiary {
  constructor(private repository: BeneficiaryRepository) {}

  /**
   * Ejecuta la creación del beneficiario con validaciones previas.
   * @param data - Datos parciales del beneficiario (debe incluir userId, fullName y documentId)
   * @returns Promise con el beneficiario creado
   * @throws Error si faltan campos obligatorios
   */
  async execute(data: Partial<Beneficiary>): Promise<Beneficiary> {
    // Validaciones de negocio
    if (!data.userId) {
      throw new Error('El ID de usuario es obligatorio.');
    }
    if (!data.fullName || data.fullName.trim() === '') {
      throw new Error('El nombre completo es obligatorio.');
    }
    if (!data.documentId || data.documentId.trim() === '') {
      throw new Error('El número de cédula es obligatorio.');
    }
    if (!data.beneficiaryType) {
      throw new Error('El tipo de beneficiario es obligatorio.');
    }
    if (!data.address || data.address.trim() === '') {
      throw new Error('La dirección es obligatoria.');
    }
    if (!data.city || data.city.trim() === '') {
      throw new Error('La ciudad es obligatoria.');
    }
    if (!data.phone || data.phone.trim() === '') {
      throw new Error('El teléfono es obligatorio.');
    }

    return this.repository.createBeneficiary(data);
  }
}
