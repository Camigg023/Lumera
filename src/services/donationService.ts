import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
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
  validadoEn?: any;
  validadoPor?: string;
}

/**
 * Genera un código único legible para humanos.
 * Formato: LMR-XXXX-XXXX (ej: LMR-A7X9-K2M1)
 */
function generarCodigoUnico(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin I, O, 0, 1 para evitar confusiones
  const rand = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `LMR-${rand(4)}-${rand(4)}`;
}

/**
 * Busca en Firestore para asegurarse de que el código no exista ya.
 * Si existe (muy improbable), genera otro.
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
 * Guarda una lista de productos como una nueva donación en Firestore,
 * con un código único de validación.
 *
 * @param productos - Lista de productos a guardar
 * @param userId - (Opcional) ID del usuario que realiza la donación
 * @returns La donación guardada con su ID y código único
 */
export async function guardarDonacion(
  productos: Producto[],
  userId?: string
): Promise<Donacion> {
  const codigoUnico = await generarCodigoUnicoSeguro();
  const totalKg = productos.reduce((acc, p) => acc + p.pesoUnidad * p.cantidad, 0);

  const donacion: Donacion = {
    codigoUnico,
    productos,
    createdAt: serverTimestamp(),
    totalProductos: productos.reduce((acc, p) => acc + p.cantidad, 0),
    totalKg: Math.round(totalKg * 100) / 100,
    estado: 'pendiente',
  };

  const dataToSave: any = { ...donacion };
  if (userId) {
    dataToSave.userId = userId;
  }

  const docRef = await addDoc(collection(db, 'donations'), dataToSave);

  return {
    ...donacion,
    id: docRef.id,
    createdAt: new Date().toISOString(), // fallback local para respuesta inmediata
  };
}

/**
 * Obtiene todas las donaciones de un usuario.
 */
export async function obtenerDonacionesPorUsuario(userId: string): Promise<Donacion[]> {
  const q = query(
    collection(db, 'donations'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Donacion));
}

/**
 * Valida un código de donación y devuelve los datos de la donación si existe.
 *
 * @param codigo - Código único de la donación (ej. "LMR-A7X9-K2M1")
 * @returns La donación encontrada o null si no existe
 */
export async function validarCodigoDonacion(codigo: string): Promise<Donacion | null> {
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
}

/**
 * Marca una donación como entregada/validada en el punto de acopio.
 */
export async function marcarDonacionEntregada(
  donationId: string,
  validadoPor: string
): Promise<void> {
  const { doc, updateDoc } = await import('firebase/firestore');
  const ref = doc(db, 'donations', donationId);
  await updateDoc(ref, {
    estado: 'entregado',
    validadoEn: serverTimestamp(),
    validadoPor,
  });
}
