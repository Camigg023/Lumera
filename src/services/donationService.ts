import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
  updateDoc,
  doc as firestoreDoc,
} from 'firebase/firestore';
import { storageService } from './storageService';

/**
 * Interfaz que representa un producto individual dentro de una donacion.
 */
export interface Producto {
  codigoBarras: string;
  nombre: string;
  pesoUnidad: number;   // en kg o unidad de medida
  cantidad: number;
}

/**
 * Interfaz que representa una donacion completa, incluyendo evidencia de entrega.
 */
export interface Donacion {
  id?: string;
  productos: Producto[];
  createdAt?: any;
  totalProductos: number;
  codigoUnico?: string;
  estado?: string;
  userId?: string;
  /** URL de la foto de evidencia de recepcion (Firebase Storage) */
  evidenciaFotoUrl?: string;
  /** URL de la firma digital de recepcion (Firebase Storage) */
  evidenciaFirmaUrl?: string;
  /** Ruta en Storage de la foto (para eliminacion) */
  evidenciaFotoPath?: string;
  /** Ruta en Storage de la firma (para eliminacion) */
  evidenciaFirmaPath?: string;
  /** Marca de tiempo de cuando se entrego */
  entregadoAt?: any;
}

/**
 * Genera un codigo unico alfanumerico para la donacion.
 * Formato: LMR-XXXX-XXXX
 */
const generarCodigoUnico = (): string => {
  const segment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const segment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LMR-${segment1}-${segment2}`;
};

/**
 * Guarda una lista de productos como una nueva donacion en Firestore.
 * Aplica rate limiting (maximo 10 donaciones por hora).
 */
export const guardarDonacion = async (
  productos: Producto[],
  userId?: string
): Promise<{ id: string; codigoUnico: string }> => {
  if (userId) {
    // Validar rate limiting: maximo 10 en la ultima hora
    const haceUnaHora = new Date();
    haceUnaHora.setHours(haceUnaHora.getHours() - 1);

    const q = query(
      collection(db, 'donations'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    
    const recentCount = snapshot.docs.filter(doc => {
      const data = doc.data();
      if (!data.createdAt) return false;
      const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      return date >= haceUnaHora;
    }).length;

    if (recentCount >= 10) {
      throw new Error('Has alcanzado el limite de 10 donaciones por hora. Intenta mas tarde.');
    }
  }

  const codigoUnico = generarCodigoUnico();

  const donacion: Donacion = {
    productos,
    createdAt: serverTimestamp(),
    totalProductos: productos.reduce((acc, p) => acc + p.cantidad, 0),
    codigoUnico,
    estado: 'pendiente',
  };

  const dataToSave: any = { ...donacion };
  if (userId) {
    dataToSave.userId = userId;
  }

  const docRef = await addDoc(collection(db, 'donations'), dataToSave);
  return { id: docRef.id, codigoUnico };
};

/**
 * Obtiene el historial de donaciones de un usuario especifico.
 */
export const obtenerDonacionesPorUsuario = async (userId: string): Promise<Donacion[]> => {
  try {
    const q = query(
      collection(db, 'donations'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Donacion[];

    // Sort by createdAt descending
    docs.sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
      return timeB - timeA;
    });

    return docs.slice(0, 50);
  } catch (error) {
    console.error('[donationService] Error al obtener donaciones:', error);
    throw error;
  }
};

/**
 * Busca una donacion por su codigo unico (LMR-XXXX-XXXX).
 */
export const buscarDonacionPorCodigo = async (codigo: string): Promise<Donacion | null> => {
  const q = query(collection(db, 'donations'), where('codigoUnico', '==', codigo), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Donacion;
};

/**
 * Marca una donacion como entregada y guarda la evidencia (foto + firma).
 * 
 * @param id - ID del documento en Firestore
 * @param evidencePhoto - Archivo de foto de evidencia (opcional)
 * @param evidenceSignature - Archivo de firma digital (opcional)
 */
export const marcarDonacionComoEntregada = async (
  id: string,
  evidencePhoto?: File,
  evidenceSignature?: File
): Promise<void> => {
  const updateData: any = {
    estado: 'entregado',
    entregadoAt: serverTimestamp(),
  };

  // Subir foto de evidencia a Firebase Storage si se proporciona
  if (evidencePhoto) {
    try {
      const result = await storageService.upload({
        folder: 'donations',
        ownerId: id,
        docType: 'evidence_photo',
        file: evidencePhoto,
      });
      updateData.evidenciaFotoUrl = result.downloadUrl;
      updateData.evidenciaFotoPath = result.storagePath;
    } catch (error) {
      console.error('[donationService] Error al subir foto de evidencia:', error);
      throw new Error('Error al subir la foto de evidencia. Intente de nuevo.');
    }
  }

  // Subir firma digital a Firebase Storage si se proporciona
  if (evidenceSignature) {
    try {
      const result = await storageService.upload({
        folder: 'donations',
        ownerId: id,
        docType: 'evidence_signature',
        file: evidenceSignature,
      });
      updateData.evidenciaFirmaUrl = result.downloadUrl;
      updateData.evidenciaFirmaPath = result.storagePath;
    } catch (error) {
      console.error('[donationService] Error al subir firma digital:', error);
      throw new Error('Error al subir la firma digital. Intente de nuevo.');
    }
  }

  // Actualizar en Firestore
  const docRef = firestoreDoc(db, 'donations', id);
  await updateDoc(docRef, updateData);
};

/**
 * Valida una donacion en el centro de acopio (cambia estado a "validado").
 */
export const validarDonacion = async (id: string): Promise<void> => {
  const docRef = firestoreDoc(db, 'donations', id);
  await updateDoc(docRef, {
    estado: 'validado',
    validadoAt: serverTimestamp(),
  });
};
