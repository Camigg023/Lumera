import { HelpRequestRepository } from '../repositories/HelpRequestRepository';
import { HelpRequest, CATEGORY_UNITS, KG_LIMITS_BY_TYPE, MAX_ACTIVE_REQUESTS_PER_WEEK } from '../entities/HelpRequest';

/**
 * Caso de uso: Crear una nueva solicitud de ayuda.
 * Valida límites semanales, máximos por tipo de organización y datos requeridos.
 *
 * Reglas de negocio:
 * - Máximo 1 solicitud activa por semana (configurable)
 * - Límite de kg total según tipo de organización
 * - La justificación es obligatoria
 * - Al menos un ítem debe tener cantidad > 0
 */
export class CreateHelpRequest {
  constructor(private repository: HelpRequestRepository) {}

  /**
   * Obtiene el inicio de la semana actual (lunes 00:00) en formato ISO-8601.
   */
  private getWeekStart(): string {
    const now = new Date();
    const day = now.getDay(); // 0=domingo, 1=lunes...
    const diff = day === 0 ? 6 : day - 1; // cantidad de días desde lunes
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString();
  }

  /**
   * Calcula el total de kg de la solicitud (suma de items con unidad 'kg').
   */
  private calculateTotalKg(items: HelpRequest['items']): number {
    return items
      .filter((item) => item.unit === 'kg')
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Ejecuta la creación de la solicitud con todas las validaciones.
   *
   * @param data - Datos de la solicitud (beneficiaryId, beneficiaryName, beneficiaryType, items, urgency, justification)
   * @returns Promise con la solicitud creada
   * @throws Error si no pasa las validaciones de negocio
   */
  async execute(data: Partial<HelpRequest>): Promise<HelpRequest> {
    // ─── Validaciones de campos obligatorios ───
    if (!data.beneficiaryId) throw new Error('El ID del beneficiario es obligatorio.');
    if (!data.beneficiaryName || data.beneficiaryName.trim() === '') throw new Error('El nombre del beneficiario es obligatorio.');
    if (!data.beneficiaryType) throw new Error('El tipo de organización es obligatorio.');
    if (!data.items || data.items.length === 0) throw new Error('Debe agregar al menos un producto.');

    // Validar que al menos un item tenga cantidad > 0
    const hasQuantity = data.items.some((item) => item.quantity > 0);
    if (!hasQuantity) throw new Error('Al menos un producto debe tener cantidad mayor a 0.');

    if (!data.urgency) throw new Error('El nivel de urgencia es obligatorio.');
    if (!data.justification || data.justification.trim() === '') throw new Error('La justificación es obligatoria.');

    // Validar que la justificación tenga al menos 20 caracteres
    if (data.justification.trim().length < 20) {
      throw new Error('La justificación debe tener al menos 20 caracteres.');
    }

    // Validar cantidades positivas
    for (const item of data.items) {
      if (item.quantity < 0) {
        throw new Error(`La cantidad para "${item.category}" no puede ser negativa.`);
      }
      if (item.quantity > 10000) {
        throw new Error(`La cantidad para "${item.category}" excede el máximo permitido (10,000).`);
      }
    }

    // ─── Validar límite de kg según tipo de organización ───
    const totalKg = this.calculateTotalKg(data.items);
    const maxKg = KG_LIMITS_BY_TYPE[data.beneficiaryType];

    if (totalKg > maxKg) {
      throw new Error(
        `El límite máximo para su tipo de organización (${data.beneficiaryType}) es de ${maxKg} kg por solicitud. ` +
        `Ha solicitado ${totalKg} kg.`
      );
    }

    // ─── Validar límite semanal (máximo 1 solicitud activa por semana) ───
    const weekStart = this.getWeekStart();
    const activeInWeek = await this.repository.countActiveRequestsInWeek(data.beneficiaryId, weekStart);

    if (activeInWeek >= MAX_ACTIVE_REQUESTS_PER_WEEK) {
      throw new Error(
        `Ya tiene ${activeInWeek} solicitud(es) activa(s) esta semana. ` +
        `El máximo permitido es ${MAX_ACTIVE_REQUESTS_PER_WEEK} por semana.`
      );
    }

    // ─── Asignar unidad automática según categoría ───
    const itemsWithUnits = data.items.map((item) => ({
      ...item,
      unit: CATEGORY_UNITS[item.category] || 'kg',
    }));

    // ─── Construir objeto completo ───
    const now = new Date().toISOString();
    const requestData: Partial<HelpRequest> = {
      ...data,
      items: itemsWithUnits,
      totalKg,
      status: 'enviada',
      weekStart,
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.createRequest(requestData);
  }
}
