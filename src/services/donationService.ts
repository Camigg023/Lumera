import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from 'firebase/firestore';

/**
 * Interfaz que representa un producto individual dentro de una donación.
 */
export interface Producto {
  codigoBarras: string;
  nombre: string;
  pesoUnidad: number;   // en kg o unidad de medida
  cantidad: number;
}

/**
 * Interfaz que representa una donación completa.
 */
export interface Donacion {
  id?: string;
  productos: Producto[];
  createdAt?: any;
  totalProductos: number;
  codigoUnico?: string;
  estado?: string;
  userId?: string;
}

/**
 * Genera un código único alfanumérico para la donación.
 * Formato: LMR-XXXX-XXXX
 */
const generarCodigoUnico = (): string => {
  const segment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const segment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LMR-${segment1}-${segment2}`;
};

/**
 * Guarda una lista de productos como una nueva donación en Firestore.
 * Aplica rate limiting (máximo 10 donaciones por hora).
 */
export const guardarDonacion = async (
  productos: Producto[],
  userId?: string
): Promise<{ id: string; codigoUnico: string }> => {
  if (userId) {
    // Validar rate limiting: máximo 10 en la última hora
    const haceUnaHora = new Date();
    haceUnaHora.setHours(haceUnaHora.getHours() - 1);

    // Bypassing composite index by filtering in-memory
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
      throw new Error('Has alcanzado el límite de 10 donaciones por hora. Intenta más tarde.');
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
 * Obtiene el historial de donaciones de un usuario específico.
 */
export const obtenerDonacionesPorUsuario = async (userId: string): Promise<Donacion[]> => {
  try {
    // Bypassing composite index by sorting in-memory
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
 * Busca una donación por su código único (LMR-XXXX-XXXX).
 */
export const buscarDonacionPorCodigo = async (codigo: string): Promise<Donacion | null> => {
  const q = query(collection(db, 'donations'), where('codigoUnico', '==', codigo), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Donacion;
};

/**
 * Actualiza el estado de una donación a 'entregado'.
 */
import { updateDoc, doc as firestoreDoc } from 'firebase/firestore';

export const marcarDonacionComoEntregada = async (id: string): Promise<void> => {
  const docRef = firestoreDoc(db, 'donations', id);
  await updateDoc(docRef, {
    estado: 'entregado',
    entregadoAt: serverTimestamp()
  });
};
