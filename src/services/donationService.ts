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

    const q = query(
      collection(db, 'donations'),
      where('userId', '==', userId),
      where('createdAt', '>=', haceUnaHora)
    );
    const recentDocs = await getDocs(q);

    if (recentDocs.size >= 10) {
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
    const q = query(
      collection(db, 'donations'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Donacion[];
  } catch (error) {
    console.error('[donationService] Error al obtener donaciones:', error);
    // Si falta el índice compuesto en Firestore, Firebase arrojará un error con un link para crearlo.
    throw error;
  }
};
