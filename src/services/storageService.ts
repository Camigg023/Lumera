import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

/**
 * Opciones para la subida de archivos a Firebase Storage.
 */
interface UploadOptions {
  /** Prefijo de carpeta raíz (ej: "beneficiaries", "donations", "deliveries") */
  folder: string;
  /** ID del usuario o entidad propietaria */
  ownerId: string;
  /** Subtipo de documento (ej: "cedula_frontal", "evidence_photo", "signature") */
  docType: string;
  /** Archivo a subir */
  file: File;
}

/**
 * Resultado de una subida exitosa a Storage.
 */
interface UploadResult {
  /** URL pública de descarga */
  downloadUrl: string;
  /** Ruta completa en Storage */
  storagePath: string;
  /** Nombre del archivo */
  fileName: string;
}

/**
 * Servicio centralizado para operaciones con Firebase Storage.
 * Todas las subidas, descargas y eliminaciones de archivos pasan por aquí.
 *
 * Estructura de almacenamiento:
 *   /{folder}/{ownerId}/{docType}/{timestamp}_{safeFileName}
 *
 * Ejemplo:
 *   /beneficiaries/abc123/cedula_frontal/1700000000_cedula.jpg
 *   /donations/def456/evidence_photo/1700000000_foto.jpg
 */
export const storageService = {
  /**
   * Sube un archivo a Firebase Storage.
   * Valida tipo de archivo y tamaño antes de subir.
   *
   * @param options - Opciones de subida (carpeta, ownerId, tipo, archivo)
   * @returns Promise con la URL de descarga y metadata
   * @throws Error si el archivo excede 10MB o formato no permitido
   */
  async upload(options: UploadOptions): Promise<UploadResult> {
    const { folder, ownerId, docType, file } = options;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        'Formato de archivo no permitido. Use JPG, PNG, WEBP o PDF.'
      );
    }

    // Validar tamaño máximo (10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Tamaño máximo: 10 MB.');
    }

    // Generar nombre único: timestamp + nombre saneado
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${folder}/${ownerId}/${docType}/${timestamp}_${safeFileName}`;
    const storageRef = ref(storage, storagePath);

    // Subir archivo
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      downloadUrl,
      storagePath,
      fileName: file.name,
    };
  },

  /**
   * Elimina un archivo de Firebase Storage por su ruta.
   *
   * @param storagePath - Ruta completa del archivo en Storage
   */
  async delete(storagePath: string): Promise<void> {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  },

  /**
   * Obtiene todos los archivos de un directorio específico.
   * Útil para listar documentos de un usuario.
   *
   * @param folder - Carpeta raíz
   * @param ownerId - ID del propietario
   * @returns Lista de referencias a archivos
   */
  async listFiles(folder: string, ownerId: string) {
    const folderRef = ref(storage, `${folder}/${ownerId}`);
    const result = await listAll(folderRef);
    return result.items;
  },

  /**
   * Obtiene la URL de descarga de un archivo por su ruta.
   *
   * @param storagePath - Ruta completa del archivo
   * @returns URL pública firmada
   */
  async getDownloadUrl(storagePath: string): Promise<string> {
    const storageRef = ref(storage, storagePath);
    return getDownloadURL(storageRef);
  },
};
