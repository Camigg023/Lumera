import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { HelpRequest, TrackingStatus } from '../../domain/entities/HelpRequest';
import { notifyStatusChange, requestNotificationPermission } from '../../data/services/notificationService';

/**
 * Hook para seguimiento en tiempo real de una solicitud mediante Firestore snapshot.
 *
 * Escucha cambios en el documento de la solicitud y dispara notificaciones
 * cuando el estado cambia. Proporciona la ubicación de entrega en tiempo real
 * y el tiempo estimado de llegada.
 *
 * @param requestId - ID de la solicitud a seguir (null si no hay seleccionada)
 */
export function useRequestTracking(requestId: string | null) {
  const [request, setRequest] = useState<HelpRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastNotifiedStatus, setLastNotifiedStatus] = useState<TrackingStatus | null>(null);
  const previousStatusRef = useRef<TrackingStatus | null>(null);

  // Solicitar permiso de notificaciones al montar
  useEffect(() => {
    if (requestId) {
      requestNotificationPermission();
    }
  }, [requestId]);

  // Suscripción en tiempo real al documento de Firestore
  useEffect(() => {
    if (!requestId) {
      setRequest(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const docRef = doc(db, 'helpRequests', requestId);

    /**
     * Escucha cambios en tiempo real usando onSnapshot.
     * Se dispara automáticamente cuando el documento cambia en Firestore.
     */
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError('Solicitud no encontrada.');
          setIsLoading(false);
          return;
        }

        const data = snapshot.data();
        const mapped: HelpRequest = {
          id: snapshot.id,
          beneficiaryId: data.beneficiaryId || '',
          beneficiaryName: data.beneficiaryName || '',
          beneficiaryType: data.beneficiaryType || 'fundacion',
          items: data.items || [],
          urgency: data.urgency || 'medio',
          justification: data.justification || '',
          status: data.status || 'enviada',
          totalKg: data.totalKg || 0,
          createdAt: data.createdAt?.toDate?.().toISOString() || data.createdAt || '',
          updatedAt: data.updatedAt?.toDate?.().toISOString() || data.updatedAt || '',
          weekStart: data.weekStart || '',
          statusHistory: data.statusHistory
            ? data.statusHistory.map((e: any) => ({
                ...e,
                timestamp: e.timestamp?.toDate?.().toISOString() || e.timestamp,
              }))
            : [],
          deliveryLocation: data.deliveryLocation
            ? {
                ...data.deliveryLocation,
                updatedAt:
                  data.deliveryLocation.updatedAt?.toDate?.().toISOString() ||
                  data.deliveryLocation.updatedAt,
              }
            : undefined,
          deliveryAddress: data.deliveryAddress,
          etaMinutes: data.etaMinutes,
          donorName: data.donorName,
          donorId: data.donorId,
          peopleServed: data.peopleServed,
          lastHelpDate: data.lastHelpDate?.toDate?.().toISOString() || data.lastHelpDate,
          distanceToCenter: data.distanceToCenter,
          complianceRate: data.complianceRate,
          priorityScore: data.priorityScore,
        };

        setRequest(mapped);
        setIsLoading(false);

        // ─── Notificar cambio de estado ───
        const prevStatus = previousStatusRef.current;
        const newStatus = mapped.status;

        if (prevStatus && prevStatus !== newStatus) {
          // Evitar notificaciones duplicadas
          if (lastNotifiedStatus !== newStatus) {
            notifyStatusChange(mapped.beneficiaryName, newStatus, mapped.id);
            setLastNotifiedStatus(newStatus);
          }
        }

        previousStatusRef.current = newStatus;
      },
      (err: any) => {
        console.error('[useRequestTracking] Error en snapshot:', err);
        setError('Error al conectar con el servicio de tracking en tiempo real.');
        setIsLoading(false);
      }
    );

    return () => {
      unsubscribe();
      previousStatusRef.current = null;
    };
  }, [requestId, lastNotifiedStatus]);

  /**
   * Obtiene el último evento del historial de estados.
   */
  const lastEvent = request?.statusHistory?.[request.statusHistory.length - 1] ?? null;

  /**
   * Obtiene el progreso del timeline como porcentaje (0-100).
   */
  const trackingProgress = useCallback((): number => {
    if (!request) return 0;
    if (request.status === 'cancelada') return 0;

    const order: TrackingStatus[] = [
      'enviada',
      'en_revision',
      'aprobada',
      'en_preparacion',
      'en_transito',
      'entregada',
    ];

    const currentIndex = order.indexOf(request.status);
    if (currentIndex === -1) return 0;

    return Math.round((currentIndex / (order.length - 1)) * 100);
  }, [request]);

  return {
    request,
    isLoading,
    error,
    lastEvent,
    trackingProgress,
  };
}
