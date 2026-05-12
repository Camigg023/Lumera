import { TrackingStatus, TRACKING_STATUS_LABELS } from '../../domain/entities/HelpRequest';

/**
 * Servicio de notificaciones para cambios de estado en solicitudes.
 *
 * Implementa dos mecanismos:
 * 1. Notification API del navegador (permiso del usuario)
 * 2. Callbacks para integración con Firebase Cloud Messaging (FCM)
 *
 * Para habilitar FCM real se requiere:
 * - Agregar `getMessaging`, `onMessage`, `getToken` desde 'firebase/messaging'
 * - Configurar el service worker de Firebase
 * - Solicitar permiso de notificaciones al usuario
 */

/**
 * Verifica si el navegador soporta notificaciones y si hay permiso.
 */
function hasNotificationSupport(): boolean {
  return 'Notification' in window;
}

/**
 * Solicita permiso para enviar notificaciones al usuario.
 * @returns true si el permiso fue concedido, false en caso contrario
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!hasNotificationSupport()) return false;

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
}

/**
 * Envía una notificación local del navegador sobre un cambio de estado.
 *
 * @param organizationName - Nombre de la organización beneficiaria
 * @param newStatus - Nuevo estado al que transitó la solicitud
 * @param requestId - ID de la solicitud (para referencia)
 */
export function notifyStatusChange(
  organizationName: string,
  newStatus: TrackingStatus,
  requestId: string
): void {
  if (!hasNotificationSupport() || Notification.permission !== 'granted') return;

  const statusLabel = TRACKING_STATUS_LABELS[newStatus] || newStatus;
  const shortId = requestId.slice(-6).toUpperCase();

  try {
    new Notification(`Lumera - ${organizationName}`, {
      body: `Tu solicitud #${shortId} cambió a: ${statusLabel}`,
      icon: '/lumera-icon.png', // Reemplazar con el icono real de la app
      tag: `request-${requestId}`,
      requireInteraction: newStatus === 'en_transito' || newStatus === 'entregada',
    });
  } catch (error) {
    console.warn('[NotificationService] Error al mostrar notificación:', error);
  }
}

/**
 * Prepara datos para enviar una notificación push vía Firebase Cloud Messaging.
 * El envío real se hace desde Cloud Functions o el servidor.
 *
 * @param registrationToken - Token FCM del dispositivo destino
 * @param organizationName - Nombre de la organización
 * @param newStatus - Nuevo estado
 * @param requestId - ID de la solicitud
 * @returns Objeto con los datos de la notificación para enviar vía API FCM
 */
export function buildFcmPayload(
  registrationToken: string,
  organizationName: string,
  newStatus: TrackingStatus,
  requestId: string
): Record<string, unknown> {
  const statusLabel = TRACKING_STATUS_LABELS[newStatus] || newStatus;
  const shortId = requestId.slice(-6).toUpperCase();

  return {
    to: registrationToken,
    notification: {
      title: `Lumera - ${organizationName}`,
      body: `Tu solicitud #${shortId} cambió a: ${statusLabel}`,
      icon: '/lumera-icon.png',
    },
    data: {
      requestId,
      newStatus,
      type: 'status_change',
      clickAction: `https://lumera.app/beneficiario/solicitudes/${requestId}`,
    },
  };
}
