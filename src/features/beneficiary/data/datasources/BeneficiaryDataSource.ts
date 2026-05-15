import { db, storage } from '../../../../config/firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Beneficiary, BeneficiaryDocument, VerificationStatus } from '../../domain/entities/Beneficiary';

/**
 * Fuente de datos para beneficiarios usando Firebase Firestore + Storage.
 * Implementa todas las operaciones CRUD y manejo documental.
 *
 * Estructura en Firestore:
 *   /beneficiaries/{userId} → Beneficiary
 *
 * Estructura en Storage:
 *   /beneficiaries/{userId}/documents/{documentType}_{timestamp}_{fileName}
 *
 * NOTA: Los documentos existentes en Firestore aún usan los campos
 * `organizationName` y `nit` del modelo anterior. Este datasource maneja
 * la migración leyendo ambos nombres y priorizando los nuevos.
 */
export class BeneficiaryDataSource {

  /**
   * Obtiene un beneficiario por su userId desde Firestore.
   * Si no existe, retorna un objeto por defecto con estado "pending".
   * Compatible hacia atrás: si el documento guarda `organizationName`,
   * se mapea a `fullName`.
   */
  async getBeneficiary(userId: string): Promise<Beneficiary> {
    const docRef = doc(db, 'beneficiaries', userId);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return {
        id: userId,
        userId,
        fullName: '',
        documentId: '',
        address: '',
        city: '',
        phone: '',
        beneficiaryType: 'otro',
        documents: [],
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const data = snap.data();

    // Compatibilidad con datos legacy (organizationName → fullName, nit → documentId)
    const fullName = data.fullName || data.organizationName || '';
    const documentId = data.documentId || data.nit || '';

    return {
      id: snap.id,
      userId: data.userId || userId,
      fullName,
      documentId,
      address: data.address || '',
      city: data.city || '',
      phone: data.phone || '',
      beneficiaryType: data.beneficiaryType || 'otro',
      documents: data.documents || [],
      latitude: data.latitude,
      longitude: data.longitude,
      verificationStatus: data.verificationStatus || 'pending',
      verificationNotes: data.verificationNotes || '',
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    } as Beneficiary;
  }

  /**
   * Crea un nuevo registro de beneficiario en Firestore.
   * Si el documento ya existe, lanza un error.
   */
  async createBeneficiary(data: Partial<Beneficiary>): Promise<Beneficiary> {
    const userId = data.userId!;
    const docRef = doc(db, 'beneficiaries', userId);
    const existing = await getDoc(docRef);

    if (existing.exists()) {
      throw new Error('El beneficiario ya existe. Use updateBeneficiary para modificar.');
    }

    const now = new Date().toISOString();
    const beneficiaryData = {
      userId,
      fullName: data.fullName || '',
      documentId: data.documentId || '',
      address: data.address || '',
      city: data.city || '',
      phone: data.phone || '',
      beneficiaryType: data.beneficiaryType || 'otro',
      documents: [],
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      verificationStatus: 'pending' as VerificationStatus,
      verificationNotes: '',
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(docRef, beneficiaryData);

    return {
      id: userId,
      ...beneficiaryData,
    } as Beneficiary;
  }

  /**
   * Actualiza campos específicos de un beneficiario en Firestore.
   */
  async updateBeneficiary(userId: string, updates: Partial<Beneficiary>): Promise<Beneficiary> {
    const docRef = doc(db, 'beneficiaries', userId);
    const existing = await getDoc(docRef);

    if (!existing.exists()) {
      throw new Error('Beneficiario no encontrado.');
    }

    // Separar campos que no deben ir directo a Firestore
    const { id, userId: _, documents, createdAt, ...firestoreUpdates } = updates as any;

    const finalUpdates = {
      ...firestoreUpdates,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(docRef, finalUpdates);

    // Retornar el documento actualizado
    const updated = await getDoc(docRef);
    const data = updated.data()!;
    return {
      id: updated.id,
      userId: updated.id,
      ...data,
    } as Beneficiary;
  }

  /**
   * Cambia el estado de verificación de un beneficiario.
   */
  async verifyBeneficiary(userId: string, status: VerificationStatus, notes?: string): Promise<Beneficiary> {
    const docRef = doc(db, 'beneficiaries', userId);
    const existing = await getDoc(docRef);

    if (!existing.exists()) {
      throw new Error('Beneficiario no encontrado.');
    }

    const updateData: any = {
      verificationStatus: status,
      updatedAt: new Date().toISOString(),
    };

    if (notes !== undefined) {
      updateData.verificationNotes = notes;
    }

    await updateDoc(docRef, updateData);

    const updated = await getDoc(docRef);
    const data = updated.data()!;
    return {
      id: updated.id,
      userId: updated.id,
      ...data,
    } as Beneficiary;
  }

  /**
   * Sube un documento a Firebase Storage y registra su metadata en Firestore.
   */
  async uploadDocument(userId: string, file: File, docType: string): Promise<BeneficiaryDocument> {
    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `beneficiaries/${userId}/documents/${docType}_${timestamp}_${safeFileName}`;
    const storageRef = ref(storage, storagePath);

    // Subir archivo
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    // Crear metadata del documento
    const documentData: BeneficiaryDocument = {
      id: `${docType}_${timestamp}`,
      type: docType as BeneficiaryDocument['type'],
      fileName: file.name,
      storageUrl: downloadUrl,
      uploadedAt: new Date().toISOString(),
    };

    // Actualizar el arreglo de documentos en Firestore
    const docRef = doc(db, 'beneficiaries', userId);
    const existing = await getDoc(docRef);

    if (!existing.exists()) {
      throw new Error('Beneficiario no encontrado. Cree el perfil primero.');
    }

    const existingDocs = existing.data()?.documents || [];
    await updateDoc(docRef, {
      documents: [...existingDocs, documentData],
      updatedAt: new Date().toISOString(),
    });

    return documentData;
  }

  /**
   * Lista todos los beneficiarios registrados.
   */
  async listBeneficiaries(): Promise<Beneficiary[]> {
    const colRef = collection(db, 'beneficiaries');
    const snapshot = await getDocs(colRef);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: doc.id,
        ...data,
      } as Beneficiary;
    });
  }

  /**
   * Lista beneficiarios filtrados por estado de verificación.
   */
  async getBeneficiariesByStatus(status: VerificationStatus): Promise<Beneficiary[]> {
    const colRef = collection(db, 'beneficiaries');
    const q = query(colRef, where('verificationStatus', '==', status));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: doc.id,
        ...data,
      } as Beneficiary;
    });
  }
}
