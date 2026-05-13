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
import { LocationMap } from '../../beneficiary/presentation/components/LocationMap';
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

    // ─── VISTA DE INICIO: Layout 3 Columnas (diseño referencia) ───
  // Izquierda: Perfil (avatar, datos, stats, menú)
  // Centro: Contenido principal (solicitud activa / beneficios)
  // Derecha: Logística (ubicación, mapa, QR)

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
    const activeRequest = activeRequests.length > 0 ? activeRequests[0] : null;

    return (
      <div className={styles.layout} role="application" aria-label="Panel de beneficiario">
        {/* ═══ TOPBAR ═══ */}
        <header className={styles.topbar}>
          <div className="flex items-center gap-3">
            <h2 className={styles.logo}>LUMERA</h2>
            <span className={styles.roleBadge}>BENEFICIARIO</span>
          </div>

          {isVerified && (
            <nav className="hidden md:flex items-center gap-6">
              <button className="text-sm font-semibold" style={{color: 'var(--color-primary)'}} onClick={() => setView('inicio')}>Inicio</button>
              <button className="text-sm font-medium" style={{color: 'var(--color-on-surface-variant)'}} onClick={() => setView('solicitar')}>Solicitar</button>
              <button className="text-sm font-medium" style={{color: 'var(--color-on-surface-variant)'}} onClick={() => setView('mis-solicitudes')}>Mis Solicitudes</button>
              <button className="text-sm font-medium" style={{color: 'var(--color-on-surface-variant)'}} onClick={() => setView('historial')}>Historial</button>
            </nav>
          )}

          <div className="flex items-center gap-3">
            {isPending && <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{backgroundColor: 'var(--color-amber-50, #fffbeb)', color: 'var(--color-amber-700, #d97706)'}}>⏳ Pendiente</span>}
            {isRejected && <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{backgroundColor: '#fef2f2', color: '#dc2626'}}>❌ Rechazado</span>}
            {isVerified && <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{backgroundColor: '#ecfdf5', color: '#059669'}}>✅ Verificado</span>}
            <button className={styles.logoutIconBtn} onClick={onLogout} title="Cerrar sesión"><LogOut size={18} /></button>
          </div>
        </header>

        <main id="main-content" className={styles.contentWrapper} role="main">
          {error && (
            <div className="mb-6 p-3 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--color-error)', color: 'var(--color-on-error)' }} role="alert">
              <span>❌</span> <span>{error}</span>
            </div>
          )}

          {/* ═══ GRID 3 COLUMNAS ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ─── LEFT COLUMN: Perfil ─── */}
            <aside className="lg:col-span-3 space-y-6">
              <div className="rounded-3xl p-6 shadow-sm border overflow-hidden relative" style={{backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)'}}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full" style={{backgroundColor: 'var(--color-primary-fixed)', opacity: 0.3, marginRight: '-2rem', marginTop: '-2rem'}} />
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-md mb-4 border-2" style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
                    color: 'var(--color-on-primary)',
                    borderColor: 'var(--color-surface-container-lowest)'
                  }}>
                    {initials}
                  </div>
                  <h2 className="text-xl font-bold" style={{color: 'var(--color-on-surface)'}}>{beneficiary.fullName}</h2>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full mt-2" style={{backgroundColor: 'var(--color-surface-container)', color: 'var(--color-primary)'}}>
                    {isVerified && '✅ Verificado'}
                    {isPending && '⏳ Pendiente'}
                    {isRejected && '❌ Rechazado'}
                  </span>
                  <p className="text-xs mt-3 font-mono" style={{color: 'var(--color-outline)'}}>ID #{beneficiary.documentId?.slice(-6) || '---'}</p>
                </div>

                <hr className="my-6" style={{borderColor: 'var(--color-outline-variant)'}} />

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl text-center" style={{backgroundColor: 'var(--color-surface-container-low)'}}>
                    <p className="text-2xl font-bold" style={{color: 'var(--color-primary)'}}>{completedDeliveries.length}</p>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{color: 'var(--color-on-surface-variant)'}}>Entregas</p>
                  </div>
                  <div className="p-3 rounded-2xl text-center" style={{backgroundColor: 'var(--color-surface-container-low)'}}>
                    <p className="text-2xl font-bold" style={{color: 'var(--color-primary)'}}>{totalKgReceived} kg</p>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{color: 'var(--color-on-surface-variant)'}}>Recibido</p>
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  <button onClick={() => setView('mis-solicitudes')} className="w-full flex items-center justify-between p-3 rounded-xl transition-colors group" style={{color: 'var(--color-on-surface-variant)'}}>
                    <span className="flex items-center gap-3 text-sm font-medium">📋 Historial</span>
                    <span className="group-hover:text-primary" style={{color: 'var(--color-outline)'}}>›</span>
                  </button>
                  <button onClick={() => setView('perfil')} className="w-full flex items-center justify-between p-3 rounded-xl transition-colors group" style={{color: 'var(--color-on-surface-variant)'}}>
                    <span className="flex items-center gap-3 text-sm font-medium">⚙️ Preferencias</span>
                    <span className="group-hover:text-primary" style={{color: 'var(--color-outline)'}}>›</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* ─── CENTER COLUMN: Contenido Principal ─── */}
            <section className="lg:col-span-6 space-y-6">
              {/* Beneficio por reclamar */}
              {hasPendingClaim && (
                <div className="rounded-3xl p-6 border-2 shadow-lg animate-slide-up" style={{borderColor: '#4CAF50', backgroundColor: '#d4edda'}}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{backgroundColor: '#d4edda'}}>🎁</div>
                      <div>
                        <h3 className="text-lg font-bold" style={{color: 'var(--color-on-surface)'}}>¡Beneficio por reclamar!</h3>
                        <p className="text-sm" style={{color: 'var(--color-on-surface-variant)'}}>{pendingClaims.length} mercado{pendingClaims.length > 1 ? 's' : ''} listo{pendingClaims.length > 1 ? 's' : ''} para recoger</p>
                      </div>
                    </div>
                    <button onClick={() => { setSelectedDelivery(pendingClaims[0]); setView('detalle-entrega'); }}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 cursor-pointer"
                      style={{backgroundColor: '#4CAF50'}}>Ver detalle</button>
                  </div>
                </div>
              )}

              {/* Card principal */}
              <div className="rounded-3xl p-8 shadow-sm border relative overflow-hidden" style={{backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)'}}>
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" style={{color: 'var(--color-primary)'}}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div className="relative">
                  <span className="text-sm font-semibold px-4 py-1.5 rounded-full" style={{backgroundColor: 'var(--color-surface-container)', color: 'var(--color-primary)'}}>
                    {activeRequest ? '🚚 Solicitud Activa' : isVerified ? '✅ Beneficiario Verificado' : '⏳ Perfil en Revisión'}
                  </span>

                  <h2 className="text-3xl font-bold mt-4" style={{color: 'var(--color-on-surface)'}}>
                    {activeRequest ? `${activeRequest.totalKg}kg de Alimentos` : `Bienvenido, ${beneficiary.fullName.split(' ')[0]}`}
                  </h2>
                  <p className="mt-2" style={{color: 'var(--color-on-surface-variant)'}}>
                    {activeRequest
                      ? `Estado: ${activeRequest.status.replace('_', ' ')} · Creada el ${new Date(activeRequest.createdAt).toLocaleDateString()}`
                      : isVerified
                        ? 'Puedes solicitar ayuda cuando lo necesites. Tu próxima entrega aparecerá aquí.'
                        : 'Estamos revisando tu documentación. Pronto podrás acceder a todos los beneficios.'}
                  </p>

                  {activeRequest && activeRequest.items && (
                    <>
                      <h3 className="text-sm font-semibold uppercase tracking-widest mt-8 mb-4 pb-2 border-b" style={{color: 'var(--color-on-surface)', borderColor: 'var(--color-outline-variant)'}}>
                        Contenido del Paquete
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeRequest.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl border hover:shadow-md transition-shadow" style={{backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)'}}>
                            <div className="p-2 rounded-xl" style={{backgroundColor: 'var(--color-surface-container-high)'}}>
                              <span className="text-lg">{{
                                no_perecederos: '🥫',
                                frescos: '🥦',
                                lacteos: '🥛',
                                panaderia: '🥖'
                              }[item.category] || '📦'}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-sm" style={{color: 'var(--color-on-surface)'}}>{item.category}</h4>
                              <p className="text-xs" style={{color: 'var(--color-outline)'}}>{item.quantity} {item.unit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {totalKgReceived > 0 && (
                    <div className="mt-8 p-5 rounded-2xl flex items-center justify-between" style={{backgroundColor: 'var(--color-primary-container)'}}>
                      <div>
                        <p className="text-sm font-medium opacity-90" style={{color: 'var(--color-on-primary-fixed)'}}>Impacto Total</p>
                        <p className="text-xl font-bold" style={{color: 'var(--color-on-primary-fixed)'}}>~{Math.round(totalKgReceived * 3.5)} kg CO₂ Ahorrados</p>
                      </div>
                      <span className="text-4xl opacity-50" style={{color: 'var(--color-on-primary-fixed)'}}>🌱</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats rápidas para no verificados */}
              {!isVerified && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl text-center" style={{backgroundColor: 'var(--color-surface-container-high)'}}>
                    <p className="text-2xl font-bold" style={{color: 'var(--color-primary)'}}>{completedDeliveries.length}</p>
                    <p className="text-xs mt-1" style={{color: 'var(--color-outline)'}}>Entregas</p>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{backgroundColor: 'var(--color-surface-container-high)'}}>
                    <p className="text-2xl font-bold" style={{color: 'var(--color-primary)'}}>{totalKgReceived} kg</p>
                    <p className="text-xs mt-1" style={{color: 'var(--color-outline)'}}>Recibido</p>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{backgroundColor: 'var(--color-surface-container-high)'}}>
                    <p className="text-2xl font-bold" style={{color: 'var(--color-primary)'}}>{helpRequests.length}</p>
                    <p className="text-xs mt-1" style={{color: 'var(--color-outline)'}}>Solicitudes</p>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{backgroundColor: 'var(--color-surface-container-high)'}}>
                    <p className="text-2xl font-bold" style={{color: 'var(--color-primary)'}}>{activeRequests.length}</p>
                    <p className="text-xs mt-1" style={{color: 'var(--color-outline)'}}>Activas</p>
                  </div>
                </div>
              )}
            </section>

            {/* ─── RIGHT COLUMN: Logística ─── */}
            <aside className="lg:col-span-3 space-y-6">
              {/* Datos de logística */}
              <div className="rounded-3xl p-6 shadow-sm border" style={{backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)'}}>
                <h3 className="font-bold mb-4" style={{color: 'var(--color-on-surface)'}}>Datos de Entrega</h3>
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor: 'var(--color-surface-container-high)'}}>
                      <svg className="w-5 h-5" style={{color: 'var(--color-primary)'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{color: 'var(--color-outline)'}}>Fecha</p>
                      <p className="text-sm font-bold" style={{color: 'var(--color-on-surface)'}}>
                        {activeRequest ? new Date(activeRequest.createdAt).toLocaleDateString('es', {weekday: 'long', month: 'long', day: 'numeric'}) : '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{backgroundColor: 'var(--color-surface-container-high)'}}>
                      <svg className="w-5 h-5" style={{color: 'var(--color-primary)'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider" style={{color: 'var(--color-outline)'}}>Dirección</p>
                      <p className="text-sm font-bold" style={{color: 'var(--color-on-surface)'}}>{beneficiary.address || '—'}</p>
                      <p className="text-xs" style={{color: 'var(--color-on-surface-variant)'}}>{beneficiary.city || ''}</p>
                    </div>
                  </div>
                </div>

                {/* Mapa */}
                {beneficiary.latitude && beneficiary.longitude ? (
                  <div className="mt-4 rounded-2xl overflow-hidden h-32">
                    <LocationMap
                      latitude={beneficiary.latitude}
                      longitude={beneficiary.longitude}
                      height={128}
                      label={beneficiary.address}
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl h-32 flex items-center justify-center" style={{backgroundColor: 'var(--color-surface-container-high)'}}>
                    <span className="text-3xl">📍</span>
                  </div>
                )}

                <button className="w-full py-3.5 rounded-2xl mt-4 font-bold text-sm transition-all active:scale-95 cursor-pointer" style={{backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-primary)'}}>
                  Ver información de recogida
                </button>
              </div>

              {/* Card QR */}
              <div className="rounded-3xl p-6 text-center shadow-lg relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-container))',
              }}>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                  </svg>
                </div>
                <h4 className="font-bold mb-4 relative z-10" style={{color: 'var(--color-on-primary)'}}>Código de Entrega</h4>
                <div className="bg-white p-3 rounded-2xl inline-block shadow-xl relative z-10">
                  <div className="w-28 h-28 flex items-center justify-center">
                    <span className="text-6xl">📱</span>
                  </div>
                </div>
                <p className="text-xs mt-4 opacity-90 font-medium px-4 relative z-10 leading-relaxed" style={{color: 'var(--color-on-primary)'}}>
                  Presenta este código al coordinador para un check-in rápido.
                </p>
              </div>

              {/* Estado del perfil para no verificados */}
              {!isVerified && (
                <div className="rounded-3xl p-5 shadow-sm border" style={{backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)'}}>
                  {isPending && (
                    <div className="flex items-start gap-3">
                      <span className="text-lg">⏳</span>
                      <div>
                        <p className="font-semibold text-sm" style={{color: '#d97706'}}>Perfil en revisión</p>
                        <p className="text-xs mt-1" style={{color: 'var(--color-on-surface-variant)'}}>Estamos verificando tus datos.</p>
                      </div>
                    </div>
                  )}
                  {isRejected && (
                    <div className="flex items-start gap-3">
                      <span className="text-lg">❌</span>
                      <div>
                        <p className="font-semibold text-sm" style={{color: 'var(--color-error)'}}>Perfil rechazado</p>
                        <p className="text-xs mt-1" style={{color: 'var(--color-on-surface-variant)'}}>{beneficiary.verificationNotes}</p>
                        <button onClick={() => setView('registro')} className="mt-2 px-4 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer" style={{backgroundColor: 'var(--color-error)'}}>Editar perfil</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Acciones para verificado */}
              {isVerified && (
                <button onClick={() => setView('solicitar')} className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 cursor-pointer" style={{backgroundColor: 'var(--color-primary)'}}>
                  <span>➕</span> Solicitar ayuda
                </button>
              )}
            </aside>
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
