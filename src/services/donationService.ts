import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  limit,
} from 'firebase/firestore';

/**
 * Interfaz que representa un producto individual dentro de una donación.
 */
export interface Producto {
  codigoBarras: string;
  nombre: string;
  pesoUnidad: number;
  cantidad: number;
}

/**
 * Interfaz que representa una donación completa almacenada en Firestore.
 */
export interface Donacion {
  id?: string;
  codigoUnico: string;
  productos: Producto[];
  createdAt: any;
  totalProductos: number;
  totalKg: number;
  userId?: string;
  estado: 'pendiente' | 'entregado' | 'validado';
}

/**
 * Resultado al guardar una donación.
 */
export interface ResultadoGuardar {
  id: string;
  codigoUnico: string;
}

/**
 * Genera un código único legible para humanos: LMR-XXXX-XXXX
 */
function generarCodigoUnico(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rand = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `LMR-${rand(4)}-${rand(4)}`;
}

/**
 * Genera un código único verificando que no exista en Firestore.
 */
async function generarCodigoUnicoSeguro(): Promise<string> {
  let codigo: string;
  let existe = true;
  do {
    codigo = generarCodigoUnico();
    const q = query(collection(db, 'donations'), where('codigoUnico', '==', codigo), limit(1));
    const snap = await getDocs(q);
    existe = !snap.empty;
  } while (existe);
  return codigo;
}

/**
 * Guarda una lista de productos como una nueva donación en Firestore
 * con un código único de validación.
 *
 * @param productos - Lista de productos a guardar
 * @param userId - (Opcional) ID del usuario que realiza la donación
 * @returns Objeto con id del documento y código único generado
 */
export const guardarDonacion = async (
  productos: Producto[],
  userId?: string
): Promise<ResultadoGuardar> => {
  const codigoUnico = await generarCodigoUnicoSeguro();
  const totalKg = productos.reduce((acc, p) => acc + p.pesoUnidad * p.cantidad, 0);

  const donacion = {
    codigoUnico,
    productos,
    createdAt: serverTimestamp(),
    totalProductos: productos.reduce((acc, p) => acc + p.cantidad, 0),
    totalKg: Math.round(totalKg * 100) / 100,
    estado: 'pendiente' as const,
  };

  const dataToSave: any = { ...donacion };
  if (userId) {
    dataToSave.userId = userId;
  }

  const docRef = await addDoc(collection(db, 'donations'), dataToSave);

  return {
    id: docRef.id,
    codigoUnico,
  };
};

/**
 * Busca una donación por su código único.
 */
export const buscarDonacionPorCodigo = async (codigo: string): Promise<Donacion | null> => {
  const codigoLimpio = codigo.trim().toUpperCase();
  const q = query(
    collection(db, 'donations'),
    where('codigoUnico', '==', codigoLimpio),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Donacion;
};

/**
 * Obtiene todas las donaciones de un usuario.
 */
export const obtenerDonacionesPorUsuario = async (userId: string): Promise<Donacion[]> => {
  const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore');
  const q = query(
    collection(db, 'donations'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Donacion));
};
