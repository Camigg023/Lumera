import { HelpRequest } from '../../domain/entities/HelpRequest';
import { Beneficiary } from '../../domain/entities/Beneficiary';
import {
  TRACKING_STATUS_LABELS,
  TRACKING_STATUS_ICONS,
} from '../../domain/entities/HelpRequest';

/**
 * Props para el dashboard de beneficiario verificado.
 */
interface BeneficiaryHomeProps {
  /** Datos del beneficiario */
  beneficiary: Beneficiary;
  /** Solicitudes activas del beneficiario */
  activeRequests: HelpRequest[];
  /** Total de kg recibidos */
  totalKgReceived: number;
  /** Navegación a vistas */
  onNavigate: (view: string) => void;
  /** Cerrar sesión */
  onLogout: () => void;
}

/**
 * Dashboard principal del beneficiario verificado.
 * Layout de 3 columnas:
 *   Izquierda  → Perfil del usuario (avatar, nombre, stats)
 *   Centro     → Próximo mercado / paquete disponible
 *   Derecha    → Logística de recolección + QR
 *
 * Usa los colores de Lumera (naranja) definidos en Tailwind @theme y CSS vars.
 */
export function BeneficiaryHome({
  beneficiary,
  activeRequests,
  totalKgReceived,
  onNavigate,
  onLogout,
}: BeneficiaryHomeProps) {
  const nextRequest = activeRequests.length > 0 ? activeRequests[activeRequests.length - 1] : null;
  const cyclesCompleted = totalKgReceived > 0 ? Math.floor(totalKgReceived / 12) + 1 : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* ═══════ TOP BAR (sin navbar) ═══════ */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-outline-variant/50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary tracking-tight">Lumera</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('historial')}
              className="p-2 text-outline hover:text-primary hover:bg-primary-container rounded-full transition-colors"
              title="Historial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-primary/20 bg-primary-container flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {beneficiary.fullName?.charAt(0) || 'B'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-outline hover:text-error hover:bg-error-container rounded-full transition-colors"
              title="Cerrar sesión"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════ CONTENIDO PRINCIPAL: GRID 3 COLUMNAS ═══════ */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* ═══ COLUMNA IZQUIERDA (3/12): PERFIL ═══ */}
          <aside className="md:col-span-3 space-y-6">
            <div className="bg-surface rounded-3xl p-6 shadow-sm border border-primary/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/30 rounded-bl-full -mr-8 -mt-8" />

              <div className="relative flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-2xl overflow-hidden mb-4 shadow-md border-2 border-white bg-primary-container flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {beneficiary.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'B'}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-on-surface">{beneficiary.fullName}</h2>

                <span className="inline-flex items-center gap-1 bg-primary-container text-primary text-xs font-semibold px-3 py-1 rounded-full mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Beneficiario Verificado
                </span>

                <p className="text-outline text-xs mt-3 font-mono">
                  CC #{beneficiary.documentId}
                </p>
              </div>

              <hr className="my-6 border-primary/10" />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-2xl text-center">
                  <p className="text-primary text-2xl font-bold">{cyclesCompleted}</p>
                  <p className="text-on-surface-variant text-[11px] font-medium uppercase tracking-wider">Entregas</p>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl text-center">
                  <p className="text-primary text-2xl font-bold">{totalKgReceived.toFixed(0)}</p>
                  <p className="text-on-surface-variant text-[11px] font-medium uppercase tracking-wider">Kg Recibidos</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => onNavigate('historial')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary-container transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-outline group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-on-surface-variant">Historial</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-outline/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => onNavigate('perfil')}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary-container transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-outline group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-on-surface-variant">Mi Perfil</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-outline/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </aside>

          {/* ═══ COLUMNA CENTRO (6/12): PRÓXIMO MERCADO ═══ */}
          <section className="md:col-span-6 space-y-6">
            {nextRequest ? (
              <div className="bg-surface rounded-3xl p-8 shadow-sm border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>

                <div className="relative">
                  <span className="bg-primary-container text-primary text-sm font-semibold px-4 py-1.5 rounded-full">
                    {TRACKING_STATUS_ICONS[nextRequest.status] || '📦'} {TRACKING_STATUS_LABELS[nextRequest.status] || 'Próxima entrega'}
                  </span>

                  <h2 className="text-3xl font-bold text-on-surface mt-4">
                    {nextRequest.totalKg.toFixed(1)} kg — Mercado de alimentos
                  </h2>

                  <p className="text-on-surface-variant mt-2 text-lg">
                    Creado el {new Date(nextRequest.createdAt).toLocaleDateString('es-CO', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>

                  {nextRequest.items && nextRequest.items.length > 0 && (
                    <div className="mt-10">
                      <h3 className="text-sm font-semibold text-on-surface uppercase tracking-widest mb-6 border-b border-primary/10 pb-2">
                        Contenido del Mercado
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {nextRequest.items.map((item, idx) => {
                          const categoryConfig: Record<string, { bg: string; icon: string }> = {
                            no_perecederos: { bg: 'bg-green-50', icon: '🥫' },
                            frescos: { bg: 'bg-green-50', icon: '🥦' },
                            lacteos: { bg: 'bg-blue-50', icon: '🥛' },
                            panaderia: { bg: 'bg-amber-50', icon: '🥖' },
                          };
                          const cfg = categoryConfig[item.category] || { bg: 'bg-gray-50', icon: '📦' };

                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-4 p-4 rounded-2xl bg-surface border border-primary/10 hover:shadow-md transition-shadow"
                            >
                              <div className={`p-2 ${cfg.bg} rounded-xl`}>
                                <span className="text-xl">{cfg.icon}</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-on-surface capitalize">
                                  {item.category.replace('_', ' ')}
                                </h4>
                                <p className="text-sm text-outline">
                                  {item.quantity} {item.unit}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-10 p-6 bg-primary-container rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-70 font-medium text-on-surface">Impacto de Redistribución</p>
                      <p className="text-xl font-bold text-primary">
                        ~{(nextRequest.totalKg * 3.4).toFixed(0)} kg CO₂ Ahorrados
                      </p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface rounded-3xl p-8 shadow-sm border border-primary/10 text-center">
                <div className="w-20 h-20 mx-auto bg-primary-container rounded-2xl flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-on-surface">No tienes solicitudes activas</h2>
                <p className="text-on-surface-variant mt-2">
                  Puedes solicitar un nuevo mercado cuando esté disponible.
                </p>
                <button
                  onClick={() => onNavigate('solicitar')}
                  className="mt-6 px-6 py-3 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container active:scale-[0.98] transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  Solicitar mercado
                </button>
              </div>
            )}
          </section>

          {/* ═══ COLUMNA DERECHA (3/12): LOGÍSTICA ═══ */}
          <aside className="md:col-span-3 space-y-6">
            <div className="bg-surface rounded-3xl p-6 shadow-sm border border-primary/10">
              <h3 className="font-bold text-lg mb-4 text-on-surface">Punto de Recolección</h3>

              {nextRequest ? (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-outline font-semibold uppercase">Fecha</p>
                      <p className="text-sm font-bold text-on-surface">
                        {new Date(nextRequest.updatedAt || nextRequest.createdAt).toLocaleDateString('es-CO', {
                          weekday: 'long', month: 'long', day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-on-surface-variant">Horario por confirmar</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-outline font-semibold uppercase">Dirección</p>
                      <p className="text-sm font-bold text-on-surface">
                        {nextRequest.deliveryAddress || 'Centro de Acopio Central'}
                      </p>
                      <p className="text-sm text-on-surface-variant">
                        {beneficiary.address || 'Dirección pendiente'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-outline">
                  No hay recolección programada. Solicita un mercado para ver los detalles.
                </p>
              )}

              <div className="mt-6 rounded-2xl overflow-hidden h-32 relative bg-primary-container flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="ml-2 text-sm text-outline">Mapa interactivo</span>
              </div>

              {nextRequest && (
                <button
                  onClick={() => onNavigate(`tracking-${nextRequest.id}`)}
                  className="w-full bg-surface-container-low text-primary font-bold py-4 rounded-2xl mt-6 hover:bg-primary-container transition-colors active:scale-95 duration-200 cursor-pointer"
                >
                  Ver información de recolección
                </button>
              )}
            </div>

            {/* Tarjeta QR */}
            <div className="rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)' }}>
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
                  <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
              </div>

              <h4 className="font-bold mb-4 relative z-10">Código de Entrega</h4>

              <div className="bg-white p-3 rounded-2xl inline-block shadow-xl relative z-10">
                <div className="w-32 h-32 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-28 w-28 text-on-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>

              {nextRequest?.deliveryCode && (
                <p className="text-sm mt-4 font-bold tracking-widest relative z-10">
                  {nextRequest.deliveryCode}
                </p>
              )}

              <p className="text-[11px] mt-3 opacity-90 font-medium px-4 relative z-10 leading-relaxed">
                Presenta este código al coordinador para el registro rápido de tu entrega.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
