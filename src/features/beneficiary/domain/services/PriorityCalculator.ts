import { HelpRequest, PriorityScore, UrgencyLevel } from '../entities/HelpRequest';

/**
 * Pesos de cada factor en el puntaje total (suma = 100).
 */
const WEIGHTS = {
  timeSinceLastHelp: 25,   // Tiempo desde última ayuda
  peopleServed: 20,        // Personas atendidas
  urgency: 25,             // Urgencia declarada
  distanceToCenter: 15,    // Distancia al centro de acopio
  complianceHistory: 15,   // Historial de cumplimiento
};

/**
 * Valores base por nivel de urgencia (0-100).
 */
const URGENCY_VALUES: Record<UrgencyLevel, number> = {
  bajo: 25,
  medio: 50,
  alto: 75,
  critico: 100,
};

/**
 * Calcula la prioridad de una solicitud basándose en múltiples factores.
 *
 * Algoritmo de priorización:
 * 1. Tiempo desde la última ayuda recibida (más tiempo = más prioridad)
 * 2. Cantidad de personas atendidas (más personas = más prioridad)
 * 3. Nivel de urgencia declarado (crítico = máxima prioridad)
 * 4. Distancia al centro de acopio más cercano (más cerca = ligeramente más prioridad)
 * 5. Historial de cumplimiento (mejor historial = más prioridad)
 *
 * @param request - Solicitud a evaluar
 * @returns Objeto con puntaje total y desglose
 */
export function calculatePriority(request: Partial<HelpRequest>): PriorityScore {
  // ─── 1. Tiempo desde la última ayuda (0-25 pts) ───
  let timeSinceLastHelp = 0;
  if (request.lastHelpDate) {
    const daysSince = Math.floor(
      (Date.now() - new Date(request.lastHelpDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    // Escala logarítmica: 0-7 días = 0 pts, 7-30 = 5 pts, 30-90 = 15 pts, 90+ = 25 pts
    if (daysSince >= 90) timeSinceLastHelp = 25;
    else if (daysSince >= 30) timeSinceLastHelp = 15;
    else if (daysSince >= 14) timeSinceLastHelp = 10;
    else if (daysSince >= 7) timeSinceLastHelp = 5;
    else timeSinceLastHelp = 0;
  } else {
    // Nunca ha recibido ayuda → máxima prioridad en este factor
    timeSinceLastHelp = 25;
  }

  // ─── 2. Personas atendidas (0-20 pts) ───
  let peopleServed = 0;
  const served = request.peopleServed || 0;
  if (served >= 500) peopleServed = 20;
  else if (served >= 200) peopleServed = 15;
  else if (served >= 100) peopleServed = 10;
  else if (served >= 50) peopleServed = 5;
  else peopleServed = 0;

  // ─── 3. Nivel de urgencia (0-25 pts) ───
  const urgency = request.urgency
    ? URGENCY_VALUES[request.urgency] * (WEIGHTS.urgency / 100)
    : 0;

  // ─── 4. Distancia al centro de acopio (0-15 pts) ───
  let distanceToCenter = 0;
  const dist = request.distanceToCenter ?? 50; // default: 50km si no hay datos
  if (dist <= 2) distanceToCenter = 15;        // Muy cerca
  else if (dist <= 5) distanceToCenter = 12;
  else if (dist <= 10) distanceToCenter = 9;
  else if (dist <= 20) distanceToCenter = 6;
  else if (dist <= 50) distanceToCenter = 3;
  else distanceToCenter = 0;                    // Muy lejos

  // ─── 5. Historial de cumplimiento (0-15 pts) ───
  let complianceHistory = 0;
  const rate = request.complianceRate ?? 0.5; // default: 50% si no hay datos
  if (rate >= 0.95) complianceHistory = 15;    // Excelente
  else if (rate >= 0.80) complianceHistory = 12;
  else if (rate >= 0.60) complianceHistory = 8;
  else if (rate >= 0.40) complianceHistory = 5;
  else if (rate >= 0.20) complianceHistory = 2;
  else complianceHistory = 0;

  // ─── Total ───
  const total = Math.round(
    timeSinceLastHelp + peopleServed + urgency + distanceToCenter + complianceHistory
  );

  return {
    total: Math.min(total, 100), // Cap at 100
    breakdown: {
      timeSinceLastHelp,
      peopleServed,
      urgency: Math.round(urgency),
      distanceToCenter,
      complianceHistory,
    },
  };
}

/**
 * Ordena un arreglo de solicitudes por prioridad descendente (mayor prioridad primero).
 *
 * @param requests - Arreglo de solicitudes a ordenar
 * @returns Nuevo arreglo ordenado con scores calculados
 */
export function sortByPriority(requests: HelpRequest[]): HelpRequest[] {
  return requests
    .map((r) => ({
      ...r,
      priorityScore: r.priorityScore || calculatePriority(r),
    }))
    .sort((a, b) => (b.priorityScore?.total || 0) - (a.priorityScore?.total || 0));
}
