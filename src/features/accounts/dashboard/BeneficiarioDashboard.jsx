import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { useBeneficiary } from '../../beneficiary/presentation/hooks/useBeneficiary';
import { useHelpRequest } from '../../beneficiary/presentation/hooks/useHelpRequest';
import { BeneficiaryRegisterForm } from '../../beneficiary/presentation/components/BeneficiaryRegisterForm';
import { BeneficiaryHome } from '../../beneficiary/presentation/components/BeneficiaryHome';
import { BeneficiaryProfile } from '../../beneficiary/presentation/components/BeneficiaryProfile';
import { HelpRequestForm } from '../../beneficiary/presentation/components/HelpRequestForm';
import { HelpRequestList } from '../../beneficiary/presentation/components/HelpRequestList';
import { TrackingView } from '../../beneficiary/presentation/components/TrackingView';
import { useDeliveryHistory } from '../../beneficiary/presentation/hooks/useDeliveryHistory';
import { DeliveryHistoryList } from '../../beneficiary/presentation/components/DeliveryHistoryList';
import { DeliveryDetailView } from '../../beneficiary/presentation/components/DeliveryDetailView';
import { LogOut } from "lucide-react";
import styles from "./BeneficiarioDashboard.module.css";

/**
 * Dashboard principal del rol Beneficiario.
 * Maneja la navegación interna entre vistas: inicio, registro, perfil, solicitar, mis-solicitudes.
 *
 * Flujo esperado:
 * 1. Al ingresar, verifica si el beneficiario tiene perfil completo.
 * 2. Si no tiene perfil → muestra formulario de registro.
 * 3. Si tiene perfil → muestra dashboard con inicio y opciones.
 * 4. Solicitud de ayudas con límite de 1 activa por semana.
 */
export function BeneficiarioDashboard({ onLogout }) {
  const [view, setView] = useState('inicio');
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [trackingRequestId, setTrackingRequestId] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // Hook de historial de entregas recibidas
  const {
    deliveries: completedDeliveries,
    isLoading: deliveriesLoading,
    totalKgReceived,
  } = useDeliveryHistory(userId || '');

  // Hook de beneficiario (se activa cuando userId esté disponible)
  const {
    beneficiary,
    isLoading: beneficiaryLoading,
    error: beneficiaryError,
    isProfileComplete,
    canRequestHelp,
    createBeneficiaryProfile,
    updateBeneficiaryProfile,
    uploadBeneficiaryDocument,
    reloadBeneficiary,
  } = useBeneficiary(userId || '');

  // Hook de solicitudes de ayuda
  const {
    requests: helpRequests,
    activeRequests,
    isLoading: requestsLoading,
    error: requestsError,
    canCreateThisWeek,
    create,
    cancel: cancelRequest,
    reloadRequests,
  } = useHelpRequest(userId || '');

  // Obtener el userId del usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  /**
   * Determina si el usuario necesita completar/configurar su perfil.
   * Aplica cuando: no tiene perfil completo, está pendiente de verificación,
   * o su verificación fue rechazada.
   */
  const needsProfileSetup = useMemo(() => {
    if (!beneficiary) return true;
    return (
      !isProfileComplete ||
      beneficiary.verificationStatus === 'pending' ||
      beneficiary.verificationStatus === 'rejected'
    );
  }, [beneficiary, isProfileComplete]);

  // Redirigir al registro si necesita configurar el perfil
  useEffect(() => {
    if (beneficiary && needsProfileSetup && view !== 'registro' && view !== 'perfil') {
      setView('registro');
    }
  }, [beneficiary, needsProfileSetup, view]);

  // ─── HANDLERS ───

  /**
   * Guarda el perfil del beneficiario (crea o actualiza).
   */
  const handleSaveProfile = async (data) => {
    if (isProfileComplete) {
      await updateBeneficiaryProfile(data);
    } else {
      await createBeneficiaryProfile(data);
    }
    await reloadBeneficiary();
    setView('inicio');
  };

  /**
   * Sube un documento de validación.
   */
  const handleUploadDocument = async (file, docType) => {
    await uploadBeneficiaryDocument(file, docType);
  };

  /**
   * Crea una nueva solicitud de donación.
   */
  const handleCreateRequest = async (data) => {
    await create({
      beneficiaryId: userId,
      beneficiaryName: beneficiary?.fullName || '',
      beneficiaryType: beneficiary?.beneficiaryType || 'otro',
      ...data,
    });
    // Volver al inicio después de crear
    setView('inicio');
  };

  /**
   * Cancela una solicitud activa.
   */
  const handleCancelRequest = async (requestId) => {
    if (window.confirm('¿Está seguro de cancelar esta solicitud?')) {
      await cancelRequest(requestId);
    }
  };

  /**
   * Abre la vista de seguimiento en tiempo real para una solicitud.
   */
  const handleViewTracking = (requestId) => {
    setTrackingRequestId(requestId);
    setView('tracking');
  };

  /**
   * Cierra la vista de seguimiento y vuelve a la lista.
   */
  const handleCloseTracking = () => {
    setTrackingRequestId(null);
    setView('mis-solicitudes');
  };

  /**
   * Abre el detalle de una entrega del historial.
   */
  const handleViewDeliveryDetail = (delivery) => {
    setSelectedDelivery(delivery);
    setView('detalle-entrega');
  };

  /**
   * Cierra el detalle y vuelve al historial.
   */
  const handleCloseDeliveryDetail = () => {
    setSelectedDelivery(null);
    setView('historial');
  };

  // Error combinado
  const error = beneficiaryError || requestsError;

  // ─── LOADING INICIAL ───

  if (!authReady || (beneficiaryLoading && !beneficiary)) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen p-4"
        style={{ backgroundColor: 'var(--color-background)' }}
        role="status"
        aria-label="Cargando"
      >
        <div
          className="w-12 h-12 border-4 rounded-full mb-4"
          style={{
            borderColor: 'var(--color-primary)',
            borderTopColor: 'transparent',
          }}
          aria-hidden="true"
        />
        <p className="font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
          Cargando perfil de beneficiario...
        </p>
      </div>
    );
  }

  // ─── VISTA: CONFIGURACIÓN DE PERFIL (PENDIENTE/RECHAZADO) ───
  // Muestra el formulario en grid: izquierda datos, derecha ubicación + docs

  if (needsProfileSetup && beneficiary) {
    return (
      <div className={styles.layout} role="application" aria-label="Configuración de perfil">
        <header className={styles.topbar}>
          <div className={styles.logoSection}>
            <h2 className={styles.logo}>LUMERA</h2>
            <span className={styles.roleBadge}>BENEFICIARIO</span>
          </div>

          <div className={styles.topActions}>
            {beneficiary.verificationStatus === 'rejected' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
                <span className="w-2 h-2 rounded-full bg-[var(--color-error)]" />
                <span className="text-xs font-medium text-red-700">Rechazado</span>
              </div>
            )}
            {beneficiary.verificationStatus === 'pending' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-amber-700">Pendiente</span>
              </div>
            )}
            <button className={styles.logoutIconBtn} onClick={onLogout} title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main id="main-content" className={styles.contentWrapper} role="main">
          {/* Banner según estado */}
          {beneficiary.verificationStatus === 'rejected' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
              <strong>❌ Perfil rechazado.</strong>
              {beneficiary.verificationNotes && (
                <span className="block mt-1">Motivo: {beneficiary.verificationNotes}</span>
              )}
              <span className="block mt-1">Corrige tus datos y sube los documentos requeridos para volver a enviar tu solicitud.</span>
            </div>
          )}
          {beneficiary.verificationStatus === 'pending' && beneficiary.documents.length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              ⏳ Tus datos están siendo revisados por nuestro equipo. Mientras tanto puedes editar tu información si es necesario.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' }} role="alert">
              <span>❌</span> <span>{error}</span>
            </div>
          )}

          {/* Formulario en grid */}
          <BeneficiaryRegisterForm
            onSave={handleSaveProfile}
            onUploadDocument={handleUploadDocument}
            isSaving={beneficiaryLoading}
            isUploading={beneficiaryLoading}
            isEditMode={isProfileComplete}
            initialData={
              isProfileComplete
                ? {
                    fullName: beneficiary.fullName,
                    documentId: beneficiary.documentId,
                    address: beneficiary.address,
                    city: beneficiary.city,
                    phone: beneficiary.phone,
                    beneficiaryType: beneficiary.beneficiaryType,
                    latitude: beneficiary.latitude,
                    longitude: beneficiary.longitude,
                  }
                : undefined
            }
          />
        </main>
      </div>
    );
  }

  // ─── VISTA: DASHBOARD VERIFICADO (BeneficiaryHome) ───
  // Cuando el usuario está verificado, mostramos el nuevo layout de 3 columnas
  // SIN la barra de navegación anterior (Explore/Donate/Impact ni Inicio/Solicitar/Historial)

  if (view === 'inicio' && beneficiary && canRequestHelp) {
    return (
      <BeneficiaryHome
        beneficiary={beneficiary}
        activeRequests={activeRequests}
        totalKgReceived={totalKgReceived}
        onNavigate={(v) => setView(v)}
        onLogout={onLogout}
      />
    );
  }

  // ─── VISTAS SECUNDARIAS (verificado, sin topbar de navegación) ───
  // Muestran solo el contenido, con un botón de volver al inicio

  return (
    <div className={styles.layout} role="application" aria-label="Panel de beneficiario">
      <header className={styles.topbar}>
        <div className={styles.logoSection}>
          <h2 className={styles.logo}>LUMERA</h2>
          <span className={styles.roleBadge}>BENEFICIARIO</span>
        </div>

        {/* Solo botón de volver al inicio y cerrar sesión */}
        <div className={styles.topActions}>
          <button
            onClick={() => setView('inicio')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary-fixed transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Inicio
          </button>
          <button className={styles.logoutIconBtn} onClick={onLogout} title="Cerrar sesión">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main id="main-content" className={styles.contentWrapper} role="main">
        {error && (
          <div className="mb-6 p-3 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' }} role="alert" aria-live="assertive">
            <span>❌</span><span>{error}</span>
          </div>
        )}

        {/* ─── VISTA: REGISTRO ─── */}
        {view === 'registro' && (
          <div className="max-w-2xl mx-auto" role="region" aria-label="Formulario de registro">
            <BeneficiaryRegisterForm
              onSave={handleSaveProfile}
              onUploadDocument={handleUploadDocument}
              isSaving={beneficiaryLoading}
              isEditMode={isProfileComplete}
              initialData={
                beneficiary
                  ? {
                      fullName: beneficiary.fullName,
                      documentId: beneficiary.documentId,
                      address: beneficiary.address,
                      city: beneficiary.city,
                      phone: beneficiary.phone,
                      beneficiaryType: beneficiary.beneficiaryType,
                      latitude: beneficiary.latitude,
                      longitude: beneficiary.longitude,
                    }
                  : undefined
              }
            />
          </div>
        )}

        {/* ─── VISTA: PERFIL ─── */}
        {view === 'perfil' && beneficiary && isProfileComplete && (
          <div className="max-w-3xl mx-auto" role="region" aria-label="Mi perfil">
            <BeneficiaryProfile
              beneficiary={beneficiary}
              onUploadDocument={handleUploadDocument}
              isUploading={beneficiaryLoading}
            />
            <div className="mt-6 text-center">
              <button
                onClick={() => setView('registro')}
                className="btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              >
                Editar perfil
              </button>
            </div>
          </div>
        )}

        {/* ─── VISTA: SOLICITAR AYUDA ─── */}
        {view === 'solicitar' && beneficiary && (
          <div role="region" aria-label="Formulario de solicitud">
            <HelpRequestForm
              fullName={beneficiary.fullName}
              beneficiaryType={beneficiary.beneficiaryType}
              onSubmit={handleCreateRequest}
              isSubmitting={requestsLoading}
              canCreateThisWeek={canCreateThisWeek}
            />
          </div>
        )}

        {/* ─── VISTA: MIS SOLICITUDES ─── */}
        {view === 'mis-solicitudes' && (
          <div className="max-w-4xl mx-auto" role="region" aria-label="Lista de solicitudes">
            <div className="mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>Mis solicitudes</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--color-outline)' }}>
                Historial completo de solicitudes de donación.
              </p>
            </div>
            <HelpRequestList
              requests={helpRequests}
              onCancelRequest={handleCancelRequest}
              onViewTracking={handleViewTracking}
              isLoading={requestsLoading}
            />
          </div>
        )}

        {/* ─── VISTA: TRACKING ─── */}
        {view === 'tracking' && trackingRequestId && (
          <TrackingView
            requestId={trackingRequestId}
            onBack={handleCloseTracking}
          />
        )}

        {/* ─── VISTA: HISTORIAL ─── */}
        {view === 'historial' && (
          <div className="max-w-4xl mx-auto" role="region" aria-label="Historial de entregas">
            <div className="mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>📦 Historial de entregas</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--color-on-surface-variant)' }}>
                Todas las donaciones recibidas.
                {totalKgReceived > 0 && ` Total acumulado: ${totalKgReceived} kg.`}
              </p>
            </div>
            <DeliveryHistoryList
              deliveries={completedDeliveries}
              onViewDetail={handleViewDeliveryDetail}
              isLoading={deliveriesLoading}
            />
          </div>
        )}

        {/* ─── VISTA: DETALLE DE ENTREGA ─── */}
        {view === 'detalle-entrega' && selectedDelivery && (
          <div role="region" aria-label="Detalle de la entrega">
            <DeliveryDetailView
              delivery={selectedDelivery}
              onBack={handleCloseDeliveryDetail}
            />
          </div>
        )}
      </main>
    </div>
  );
}
