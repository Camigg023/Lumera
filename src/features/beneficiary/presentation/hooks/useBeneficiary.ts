import { useMemo, useState, useEffect, useCallback } from 'react';
import { BeneficiaryDataSource } from '../../data/datasources/BeneficiaryDataSource';
import { BeneficiaryRepositoryImpl } from '../../data/repositories/BeneficiaryRepositoryImpl';
import { GetBeneficiary } from '../../domain/usecases/GetBeneficiary';
import { CreateBeneficiary } from '../../domain/usecases/CreateBeneficiary';
import { UpdateBeneficiary } from '../../domain/usecases/UpdateBeneficiary';
import { VerifyBeneficiary } from '../../domain/usecases/VerifyBeneficiary';
import { UploadDocument } from '../../domain/usecases/UploadDocument';
import { Beneficiary, BeneficiaryDocument, VerificationStatus } from '../../domain/entities/Beneficiary';

/**
 * Hook personalizado para gestionar el perfil de beneficiario.
 * Encapsula la inyección de dependencias, carga de datos y operaciones CRUD.
 *
 * @param userId - ID del usuario autenticado en Firebase
 */
export const useBeneficiary = (userId: string) => {
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar casos de uso con memoización (solo una vez)
  const useCases = useMemo(() => {
    const ds = new BeneficiaryDataSource();
    const repo = new BeneficiaryRepositoryImpl(ds);
    return {
      getBeneficiary: new GetBeneficiary(repo),
      createBeneficiary: new CreateBeneficiary(repo),
      updateBeneficiary: new UpdateBeneficiary(repo),
      verifyBeneficiary: new VerifyBeneficiary(repo),
      uploadDocument: new UploadDocument(repo),
    };
  }, []);

  /**
   * Carga el perfil de beneficiario desde Firestore.
   */
  const loadBeneficiary = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await useCases.getBeneficiary.execute(userId);
      setBeneficiary(data);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar el perfil de beneficiario.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, useCases.getBeneficiary]);

  // Cargar datos al montar el hook
  useEffect(() => {
    loadBeneficiary();
  }, [loadBeneficiary]);

  /**
   * Crea un nuevo perfil de beneficiario en Firestore.
   * @param data - Datos del beneficiario a registrar
   * @returns Promise con el beneficiario creado
   */
  const createBeneficiaryProfile = async (data: Partial<Beneficiary>): Promise<Beneficiary> => {
    setIsLoading(true);
    setError(null);
    try {
      const created = await useCases.createBeneficiary.execute({ ...data, userId });
      setBeneficiary(created);
      return created;
    } catch (e: any) {
      const msg = e?.message ?? 'Error al crear el perfil.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Actualiza campos del perfil de beneficiario.
   * @param updates - Campos a actualizar
   * @returns Promise con el beneficiario actualizado
   */
  const updateBeneficiaryProfile = async (updates: Partial<Beneficiary>): Promise<Beneficiary> => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await useCases.updateBeneficiary.execute(userId, updates);
      setBeneficiary(updated);
      return updated;
    } catch (e: any) {
      const msg = e?.message ?? 'Error al actualizar el perfil.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cambia el estado de verificación del beneficiario (admin).
   * @param status - Estado: 'verified' | 'rejected'
   * @param notes - Motivo opcional (requerido si es 'rejected')
   * @returns Promise con el beneficiario actualizado
   */
  const verifyBeneficiaryProfile = async (status: VerificationStatus, notes?: string): Promise<Beneficiary> => {
    setIsLoading(true);
    setError(null);
    try {
      const verified = await useCases.verifyBeneficiary.execute(userId, status, notes);
      setBeneficiary(verified);
      return verified;
    } catch (e: any) {
      const msg = e?.message ?? 'Error al verificar el perfil.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sube un documento de validación a Firebase Storage.
   * @param file - Archivo a subir (PDF, JPG, PNG)
   * @param docType - Tipo de documento
   * @returns Promise con el documento creado
   */
  const uploadBeneficiaryDocument = async (file: File, docType: string): Promise<BeneficiaryDocument> => {
    setError(null);
    try {
      const doc = await useCases.uploadDocument.execute(userId, file, docType);
      // Recargar perfil completo para tener la lista actualizada de documentos
      await loadBeneficiary();
      return doc;
    } catch (e: any) {
      const msg = e?.message ?? 'Error al subir el documento.';
      setError(msg);
      throw new Error(msg);
    }
  };

  /**
   * Verifica si el beneficiario está completamente registrado (tiene datos básicos).
   */
  const isProfileComplete = useMemo(() => {
    if (!beneficiary) return false;
    return (
      beneficiary.fullName.trim() !== '' &&
      beneficiary.documentId.trim() !== '' &&
      beneficiary.address.trim() !== '' &&
      beneficiary.city.trim() !== '' &&
      beneficiary.phone.trim() !== ''
    );
  }, [beneficiary]);

  /**
   * Verifica si el beneficiario puede solicitar ayudas (debe estar verificado).
   */
  const canRequestHelp = useMemo(() => {
    if (!beneficiary) return false;
    return beneficiary.verificationStatus === 'verified' && isProfileComplete;
  }, [beneficiary, isProfileComplete]);

  return {
    beneficiary,
    isLoading,
    error,
    isProfileComplete,
    canRequestHelp,
    createBeneficiaryProfile,
    updateBeneficiaryProfile,
    verifyBeneficiaryProfile,
    uploadBeneficiaryDocument,
    reloadBeneficiary: loadBeneficiary,
  };
};
