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

  // Si necesita configurar perfil, mostramos vista informativa en lugar de redirigir
  useEffect(() => {
    if (beneficiary && needsProfileSetup && view !== 'registro' && view !== 'perfil' && view !== 'inicio') {
      setView('inicio');
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

  // ─── VISTA DE INICIO UNIFICADA ───
  // Misma vista para todos los estados del beneficiario (pendiente, rechazado, verificado)
  // Layout: centro (beneficio por reclamar), 2 columnas (info + ubicación), abajo (beneficios)

  if (view === 'inicio' && beneficiary) {
    const isVerified = beneficiary.verificationStatus === 'verified';
    const isRejected = beneficiary.verificationStatus === 'rejected';
    const isPending = beneficiary.verificationStatus === 'pending';

    // Obtener iniciales para el avatar
    const initials = beneficiary.fullName
      ? beneficiary.fullName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()
      : '??';

    // Etiqueta del tipo de beneficiario
    const typeLabel = (() => {
      const labels = { persona_natural: 'Persona Natural', cabeza_familia: 'Cabeza de Familia', adulto_mayor: 'Adulto Mayor', otro: 'Otro' };
      return labels[beneficiary.beneficiaryType] || beneficiary.beneficiaryType;
    })();

    // Buscar solicitudes entregadas pendientes de reclamar
    const pendingClaims = helpRequests.filter(r => r.status === 'entregada');
    const hasPendingClaim = pendingClaims.length > 0;

    return (
      <div className={styles.layout} role="application" aria-label="Panel de beneficiario">
        <header className={styles.topbar}>
          <div className={styles.logoSection}>
            <h2 className={styles.logo}>LUMERA</h2>
            <span className={styles.roleBadge}>BENEFICIARIO</span>
          </div>

          {/* Navegación para usuarios verificados */}
          {isVerified && (
            <div className={styles.topMenu}>
              <button
                className={`${styles.topMenuItem} ${styles.active}`}
                onClick={() => setView('inicio')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Inicio</span>
              </button>
              <button
                className={styles.topMenuItem}
                onClick={() => setView('solicitar')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Solicitar</span>
              </button>
              <button
                className={styles.topMenuItem}
                onClick={() => setView('mis-solicitudes')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>Mis solicitudes</span>
              </button>
              <button
                className={styles.topMenuItem}
                onClick={() => setView('historial')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Historial</span>
              </button>
            </div>
          )}

          <div className={styles.topActions}>
            {isRejected && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
                <span className="w-2 h-2 rounded-full bg-[var(--color-error)]" />
                <span className="text-xs font-medium text-red-700">Rechazado</span>
              </div>
            )}
            {isPending && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-amber-700">Pendiente</span>
              </div>
            )}
            {isVerified && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700">Verificado</span>
              </div>
            )}
            <button className={styles.logoutIconBtn} onClick={onLogout} title="Cerrar sesión">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main id="main-content" className={styles.contentWrapper} role="main">
          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' }} role="alert">
              <span>❌</span> <span>{error}</span>
            </div>
          )}

          {/* ─── BLOQUE: BENEFICIO / MERCADO POR RECLAMAR (CENTRO) ─── */}
          {hasPendingClaim && (
            <div className="mb-6 animate-slide-up">
              <div className="p-6 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg shadow-emerald-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">🎁</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-emerald-900">¡Tienes un beneficio por reclamar!</h3>
                    <p className="text-sm text-emerald-700 mt-1">
                      {pendingClaims.length === 1
                        ? 'Una de tus solicitudes ha sido entregada. Acércate al punto de acopio para reclamar tu mercado.'
                        : `${pendingClaims.length} de tus solicitudes están listas para reclamar.`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const first = pendingClaims[0];
                      setSelectedDelivery(first);
                      setView('detalle-entrega');
                    }}
                    className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-md shadow-emerald-200 whitespace-nowrap cursor-pointer"
                  >
                    Ver detalle
                  </button>
                </div>
                {pendingClaims.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-emerald-200">
                    <p className="text-xs font-medium text-emerald-600 mb-2">MERCADOS PENDIENTES:</p>
                    <div className="space-y-2">
                      {pendingClaims.map((claim, idx) => (
                        <div key={claim.id} className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-700">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-emerald-900">{claim.totalKg} kg · {claim.items?.length || 0} productos</p>
                              <p className="text-xs text-emerald-600">Código: {claim.deliveryCode || '---'}</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                            {new Date(claim.receivedAt || claim.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── BLOQUE SUPERIOR: DOS COLUMNAS ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* COLUMNA IZQUIERDA: Avatar + Información personal */}
            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)' }}>
              <div className="flex items-start gap-5">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
                    color: 'var(--color-on-primary)',
                  }}
                >
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold truncate" style={{ color: 'var(--color-on-surface)' }}>
                    {beneficiary.fullName}
                  </h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.468.767 2.943 1.868m-2.943-1.868A2.5 2.5 0 0010 16.5V17" />
                      </svg>
                      <span className="truncate">{beneficiary.documentId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{beneficiary.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{typeLabel}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado de verificación */}
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>Estado de verificación</span>
                  {isPending && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Pendiente
                    </span>
                  )}
                  {isRejected && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Rechazado
                    </span>
                  )}
                  {isVerified && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Verificado
                    </span>
                  )}
                </div>
                {isRejected && beneficiary.verificationNotes && (
                  <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                    Motivo: {beneficiary.verificationNotes}
                  </p>
                )}
              </div>
            </div>

            {/* COLUMNA DERECHA: Ubicación */}
            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)' }}>
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Ubicación de residencia
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>Dirección</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--color-on-surface)' }}>{beneficiary.address}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>Ciudad</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--color-on-surface)' }}>{beneficiary.city}</p>
                </div>
                {beneficiary.latitude && beneficiary.longitude && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>Coordenadas</p>
                    <p className="text-sm font-medium mt-0.5 font-mono" style={{ color: 'var(--color-on-surface)' }}>
                      {beneficiary.latitude.toFixed(4)}, {beneficiary.longitude.toFixed(4)}
                    </p>
                    <div
                      className="mt-3 h-28 rounded-xl flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: 'var(--color-surface-container-high)' }}
                    >
                      <div className="text-center">
                        <span className="text-2xl">📍</span>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-outline)' }}>
                          {beneficiary.latitude.toFixed(4)}, {beneficiary.longitude.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── BLOQUE INFERIOR: BENEFICIOS OBTENIDOS ─── */}
          <div className="p-6 rounded-2xl" style={{ backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)' }}>
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-on-surface-variant)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Beneficios obtenidos
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--color-surface-container-high)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {completedDeliveries.length}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-outline)' }}>Entregas recibidas</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--color-surface-container-high)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {totalKgReceived} kg
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-outline)' }}>Total recibido</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--color-surface-container-high)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {helpRequests.length}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-outline)' }}>Solicitudes totales</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: 'var(--color-surface-container-high)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {activeRequests.length}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-outline)' }}>Solicitudes activas</p>
              </div>
            </div>

            {/* Barra de progreso de beneficios */}
            {totalKgReceived > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <span>Progreso de beneficios</span>
                  <span>{totalKgReceived} kg</span>
                </div>
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--color-surface-container-high)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((totalKgReceived / 100) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                    }}
                  />
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--color-outline)' }}>
                  Meta: 100 kg
                </p>
              </div>
            )}

            {/* Banner informativo según estado (solo si no está verificado) */}
            {isPending && (
              <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-start gap-3">
                <span className="text-lg flex-shrink-0">⏳</span>
                <div>
                  <p className="font-semibold">Perfil en revisión</p>
                  <p className="mt-0.5 text-amber-700">
                    Tus datos están siendo verificados por nuestro equipo. Mientras tanto puedes ver tu información y dar seguimiento a tus beneficios.
                  </p>
                </div>
              </div>
            )}
            {isRejected && (
              <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800 flex items-start gap-3">
                <span className="text-lg flex-shrink-0">❌</span>
                <div>
                  <p className="font-semibold">Perfil rechazado</p>
                  <p className="mt-0.5 text-red-700">
                    {beneficiary.verificationNotes && <span>Motivo: {beneficiary.verificationNotes}. </span>}
                    Para volver a enviar tu solicitud, corrige tus datos y sube los documentos requeridos.
                  </p>
                  <button
                    onClick={() => setView('registro')}
                    className="mt-3 px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
                  >
                    Editar perfil
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Acciones según estado */}
          <div className="mt-6">
            {!isVerified && (
              <div className="text-center">
                <button
                  onClick={() => setView('registro')}
                  className="px-8 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                  }}
                >
                  <span className="flex items-center gap-2 justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {isProfileComplete ? 'Editar mi perfil' : 'Completar mi perfil'}
                  </span>
                </button>
              </div>
            )}
            {isVerified && canCreateThisWeek && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setView('solicitar')}
                  className="px-8 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Solicitar ayuda
                </button>
                <button
                  onClick={() => setView('mis-solicitudes')}
                  className="px-8 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-primary)',
                    border: '2px solid var(--color-primary)',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Ver mis solicitudes
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ─── VISTAS SECUNDARIAS (registro, perfil, solicitar, etc.) ───
  // Muestran solo el contenido con topbar y botón de volver al inicio

  return (
    <div className={styles.layout} role="application" aria-label="Panel de beneficiario">
      <header className={styles.topbar}>
        <div className={styles.logoSection}>
          <h2 className={styles.logo}>LUMERA</h2>
          <span className={styles.roleBadge}>BENEFICIARIO</span>
        </div>

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
