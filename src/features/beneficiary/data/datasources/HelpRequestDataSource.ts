import { db } from '../../../../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { HelpRequest, TrackingStatus, TrackingEvent } from '../../domain/entities/HelpRequest';
import { calculatePriority } from '../../domain/services/PriorityCalculator';

/**
 * Colección de Firestore donde se almacenan las solicitudes de ayuda.
 */
const COLLECTION_NAME = 'helpRequests';

/**
 * Convierte un documento de Firestore a la entidad HelpRequest.
 */
const mapDocToRequest = (docSnap: any): HelpRequest => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
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
          updatedAt: data.deliveryLocation.updatedAt?.toDate?.().toISOString() || data.deliveryLocation.updatedAt,
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
    priorityScore: data.priorityScore || calculatePriority(data),
  } as HelpRequest;
};

/**
 * Convierte un string ISO a Timestamp de Firestore.
 */
const toTimestamp = (isoString: string) => {
  try {
    return Timestamp.fromDate(new Date(isoString));
  } catch {
    return isoString;
  }
};

/**
 * Serializa un TrackingEvent para guardar en Firestore.
 */
const serializeEvent = (event: TrackingEvent) => ({
  status: event.status,
  timestamp: toTimestamp(event.timestamp),
  note: event.note || null,
  updatedBy: event.updatedBy || null,
});

/**
 * Fuente de datos para solicitudes de ayuda usando Firebase Firestore.
 *
 * Estructura en Firestore:
 *   /helpRequests/{requestId} → HelpRequest (con campos de tracking y prioridad)
 */
export class HelpRequestDataSource {
  private getCollection() {
    return collection(db, COLLECTION_NAME);
  }

  private getDocRef(requestId: string) {
    return doc(db, COLLECTION_NAME, requestId);
  }

  /**
   * Crea una nueva solicitud y registra el evento inicial en el timeline.
   */
  async createRequest(data: Partial<HelpRequest>): Promise<HelpRequest> {
    const colRef = this.getCollection();
    const now = Timestamp.now();

    // Crear evento inicial en el timeline
    const initialEvent: TrackingEvent = {
      status: 'enviada',
      timestamp: now.toDate().toISOString(),
      note: 'Solicitud creada por el beneficiario.',
    };

    const firestoreData: Record<string, unknown> = {
      beneficiaryId: data.beneficiaryId,
      beneficiaryName: data.beneficiaryName,
      beneficiaryType: data.beneficiaryType,
      items: data.items,
      urgency: data.urgency,
      justification: data.justification,
      status: 'enviada',
      totalKg: data.totalKg || 0,
      weekStart: data.weekStart,
      statusHistory: [serializeEvent(initialEvent)],
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(colRef, firestoreData);

    return {
      id: docRef.id,
      ...data,
      status: 'enviada',
      statusHistory: [initialEvent],
      totalKg: data.totalKg || 0,
    } as HelpRequest;
  }

  /**
   * Obtiene una solicitud por su ID.
   */
  async getRequest(requestId: string): Promise<HelpRequest> {
    const docRef = this.getDocRef(requestId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) throw new Error('Solicitud no encontrada.');
    return mapDocToRequest(snap);
  }

  /**
   * Lista todas las solicitudes de un beneficiario, ordenadas por fecha descendente.
   */
  async listRequestsByBeneficiary(beneficiaryId: string): Promise<HelpRequest[]> {
    const colRef = this.getCollection();
    const q = query(colRef, where('beneficiaryId', '==', beneficiaryId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToRequest);
  }

  /**
   * Lista todas las solicitudes activas ordenadas por prioridad descendente.
   */
  async listActiveRequests(): Promise<HelpRequest[]> {
    const colRef = this.getCollection();
    const q = query(
      colRef,
      where('status', 'in', ['enviada', 'en_revision', 'aprobada', 'en_preparacion', 'en_transito']),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const requests = snapshot.docs.map(mapDocToRequest);

    // Ordenar por prioridad calculada (mayor primero)
    return requests.sort(
      (a, b) => (b.priorityScore?.total || 0) - (a.priorityScore?.total || 0)
    );
  }

  /**
   * Lista solicitudes activas filtradas por prioridad mínima.
   * Útil para que los donadores vean las solicitudes más urgentes primero.
   */
  async listHighPriorityRequests(minScore: number = 50): Promise<HelpRequest[]> {
    const all = await this.listActiveRequests();
    return all.filter((r) => (r.priorityScore?.total || 0) >= minScore);
  }

  /**
   * Actualiza el estado de una solicitud y registra el evento en el timeline.
   */
  async updateRequestStatus(
    requestId: string,
    status: TrackingStatus,
    options?: {
      note?: string;
      updatedBy?: string;
      deliveryLocation?: { latitude: number; longitude: number; address?: string };
      etaMinutes?: number;
      donorName?: string;
      donorId?: string;
    }
  ): Promise<HelpRequest> {
    const docRef = this.getDocRef(requestId);
    const existing = await getDoc(docRef);
    if (!existing.exists()) throw new Error('Solicitud no encontrada.');

    const currentData = existing.data();
    const currentHistory = currentData.statusHistory || [];

    // Crear evento de cambio de estado
    const newEvent: TrackingEvent = {
      status,
      timestamp: new Date().toISOString(),
      note: options?.note || `Estado actualizado a: ${status}`,
      updatedBy: options?.updatedBy,
    };

    const updates: any = {
      status,
      statusHistory: [...currentHistory, serializeEvent(newEvent)],
      updatedAt: Timestamp.now(),
    };

    // Actualizar ubicación de entrega si se proporciona
    if (options?.deliveryLocation) {
      updates.deliveryLocation = {
        ...options.deliveryLocation,
        updatedAt: Timestamp.now(),
      };
    }

    // Actualizar ETA
    if (options?.etaMinutes !== undefined) {
      updates.etaMinutes = options.etaMinutes;
    }

    // Actualizar donador asignado
    if (options?.donorName) updates.donorName = options.donorName;
    if (options?.donorId) updates.donorId = options.donorId;

    await updateDoc(docRef, updates);

    const updated = await getDoc(docRef);
    return mapDocToRequest(updated);
  }

  /**
   * Actualiza la ubicación de la entrega en tiempo real (usado durante "en_tránsito").
   */
  async updateDeliveryLocation(
    requestId: string,
    latitude: number,
    longitude: number,
    address?: string
  ): Promise<void> {
    const docRef = this.getDocRef(requestId);
    await updateDoc(docRef, {
      deliveryLocation: {
        latitude,
        longitude,
        address: address || null,
        updatedAt: Timestamp.now(),
      },
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Actualiza el tiempo estimado de llegada.
   */
  async updateEta(requestId: string, etaMinutes: number): Promise<void> {
    const docRef = this.getDocRef(requestId);
    await updateDoc(docRef, {
      etaMinutes,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Cuenta las solicitudes activas de un beneficiario en una semana específica.
   */
  async countActiveRequestsInWeek(beneficiaryId: string, weekStart: string): Promise<number> {
    const colRef = this.getCollection();
    const q = query(
      colRef,
      where('beneficiaryId', '==', beneficiaryId),
      where('weekStart', '==', weekStart),
      where('status', 'in', ['enviada', 'en_revision', 'aprobada', 'en_preparacion', 'en_transito'])
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  }
}
