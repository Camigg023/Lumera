import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
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
  productos: Producto[];
  createdAt?: any;
  totalProductos: number;
}

/**
 * Guarda una lista de productos como una nueva donación en Firestore.
 * 
 * @param productos - Lista de productos a guardar
 * @param userId - (Opcional) ID del usuario que realiza la donación
 * @returns El ID del documento creado en Firestore
 * 
 * @example
 * ```ts
 * const id = await guardarDonacion([{ codigoBarras: '123', nombre: 'Arroz', pesoUnidad: 1, cantidad: 5 }]);
 * console.log('Donación guardada con ID:', id);
 * ```
 */
export const guardarDonacion = async (
  productos: Producto[],
  userId?: string
): Promise<string> => {
  const donacion: Donacion = {
    productos,
    createdAt: serverTimestamp(),
    totalProductos: productos.reduce((acc, p) => acc + p.cantidad, 0),
  };

  // Si hay userId, lo agregamos opcionalmente
  const dataToSave: any = { ...donacion };
  if (userId) {
    dataToSave.userId = userId;
  }

  const docRef = await addDoc(collection(db, 'donations'), dataToSave);
  return docRef.id;
};
