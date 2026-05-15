import { useState, useEffect } from 'react';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import {
  Shield,
  RefreshCw,
  CheckCircle,
  XCircle,
  Search,
  Users,
  Clock,
  AlertTriangle,
  FileText,
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Camera,
} from 'lucide-react';
import { BeneficiaryDataSource } from '../../features/beneficiary/data/datasources/BeneficiaryDataSource';
import { BeneficiaryRepositoryImpl } from '../../features/beneficiary/data/repositories/BeneficiaryRepositoryImpl';
import { ListBeneficiaries } from '../../features/beneficiary/domain/usecases/ListBeneficiaries';
import { VerifyBeneficiary } from '../../features/beneficiary/domain/usecases/VerifyBeneficiary';
import type { Beneficiary, VerificationStatus, BeneficiaryDocument } from '../../features/beneficiary/domain/entities/Beneficiary';
import { DOCUMENT_TYPE_LABELS } from '../../features/beneficiary/domain/entities/Beneficiary';
import { ForcePasswordChange } from './components/ForcePasswordChange';

type TabType = 'pending' | 'verified' | 'rejected' | 'all';

const dataSource = new BeneficiaryDataSource();
const repository = new BeneficiaryRepositoryImpl(dataSource);
const listUseCase = new ListBeneficiaries(repository);
const verifyUseCase = new VerifyBeneficiary(repository);

const STATUS_CONFIG: Record<VerificationStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pendiente', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  verified: { label: 'Verificado', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  rejected: { label: 'Rechazado', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
};

export function SuperAdminDashboard({ onLogout }: { onLogout?: () => void }) {
  // ═══ TODOS LOS HOOKS AL INICIO (siempre mismo orden) ═══
  const [needsPasswordChange, setNeedsPasswordChange] = useState(true);
  const [checkingPassword, setCheckingPassword] = useState(true);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  // Leer desde Firestore si ya cambió la contraseña
  useEffect(() => {
    const checkPasswordChange = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setNeedsPasswordChange(false);
          setCheckingPassword(false);
          return;
        }
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Si passwordChange es true, ya cambió la contraseña antes
          setNeedsPasswordChange(data.passwordChange !== true);
        }
      } catch (err) {
        console.error('[SuperAdmin] Error al verificar passwordChange:', err);
        setNeedsPasswordChange(false);
      } finally {
        setCheckingPassword(false);
      }
    };
    checkPasswordChange();
  }, []);

  // Cargar beneficiarios
  useEffect(() => {
    loadBeneficiaries();
  }, []);

  // ═══ EARLY RETURNS (después de todos los hooks) ═══

  // Mostrar loading mientras verificamos
  if (checkingPassword) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-on-surface-variant">Verificando seguridad...</p>
        </div>
      </div>
    );
  }

  if (needsPasswordChange) {
    return (
      <ForcePasswordChange
        onComplete={() => setNeedsPasswordChange(false)}
      />
    );
  }
  async function loadBeneficiaries() {
    setLoading(true);
    setError('');
    try {
      // 1. Obtener beneficiarios con perfil completo desde /beneficiaries
      const list = await listUseCase.execute();
      const profileUserIds = new Set(list.map((b) => b.id));

      // 2. Obtener usuarios registrados como beneficiario desde /users
      //    que aun no tienen perfil en /beneficiaries
      const usersQuery = query(
        collection(db, 'users'),
        where('role', '==', 'beneficiario')
      );
      const usersSnapshot = await getDocs(usersQuery);

      const mergedList = [...list];

      for (const userDoc of usersSnapshot.docs) {
        const uid = userDoc.id;
        // Solo agregar si no tiene perfil en /beneficiaries
        if (!profileUserIds.has(uid)) {
          const userData = userDoc.data();
          mergedList.push({
            id: uid,
            userId: uid,
            fullName: userData.name || userData.fullName || '',
            documentId: userData.documentId || userData.cedula || '',
            address: userData.direccion || '',
            city: userData.ciudad || '',
            phone: userData.telefono || '',
            beneficiaryType: 'otro',
            documents: [],
            verificationStatus: 'pending',
            createdAt: userData.createdAt || new Date().toISOString(),
            updatedAt: userData.updatedAt || new Date().toISOString(),
          } as Beneficiary);
        }
      }

      // Ordenar por fecha de creacion descendente
      mergedList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setBeneficiaries(mergedList);
    } catch (err) {
      console.error('[SuperAdmin] Error al cargar beneficiarios:', err);
      setError('No se pudieron cargar los beneficiarios.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(userId: string, status: VerificationStatus, notes?: string) {
    setActionLoading(userId);
    try {
      const updated = await verifyUseCase.execute(userId, status, notes);
      setBeneficiaries((prev) =>
        prev.map((b) => (b.id === userId ? updated : b))
      );
    } catch (err) {
      console.error('[SuperAdmin] Error al verificar:', err);
      alert('Error al cambiar el estado del beneficiario.');
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = beneficiaries.filter((b) => {
    const matchesTab =
      activeTab === 'all' || b.verificationStatus === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.fullName.toLowerCase().includes(q) ||
      b.documentId.includes(q) ||
      b.city.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const counts = {
    all: beneficiaries.length,
    pending: beneficiaries.filter((b) => b.verificationStatus === 'pending').length,
    verified: beneficiaries.filter((b) => b.verificationStatus === 'verified').length,
    rejected: beneficiaries.filter((b) => b.verificationStatus === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Header */}
      <header className="bg-primary text-on-primary sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield size={28} className="text-on-primary" />
              <h1 className="text-xl font-bold">Super Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadBeneficiaries}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-on-primary/10 hover:bg-on-primary/20 rounded-xl text-sm font-medium transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Actualizar
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-on-primary/10 hover:bg-on-primary/20 rounded-xl text-sm font-medium transition cursor-pointer"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Vista detalle cuando se selecciona un beneficiario */}
        {selectedBeneficiary && (
          <BeneficiaryDetail
            beneficiary={selectedBeneficiary}
            onBack={() => setSelectedBeneficiary(null)}
            onVerify={handleVerify}
            actionLoading={actionLoading}
          />
        )}
        {/* Lista de beneficiarios (oculta cuando hay detalle) */}
        <div style={{ display: selectedBeneficiary ? 'none' : 'block' }}>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: counts.all, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Pendientes', value: counts.pending, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Verificados', value: counts.verified, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Rechazados', value: counts.rejected, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
                  <p className="text-xs text-on-surface-variant font-medium">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Tabs */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="p-4 border-b border-outline-variant">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, cédula o ciudad..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface text-on-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-surface-container-low rounded-xl p-1">
                {(['pending', 'verified', 'rejected', 'all'] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                      activeTab === tab
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab === 'pending' && 'Pendientes'}
                    {tab === 'verified' && 'Verificados'}
                    {tab === 'rejected' && 'Rechazados'}
                    {tab === 'all' && 'Todos'}
                    {tab !== 'all' && (
                      <span className="ml-1.5 opacity-70">({counts[tab]})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <RefreshCw size={32} className="text-primary animate-spin mb-4" />
                <p className="text-on-surface-variant">Cargando beneficiarios...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <AlertTriangle size={40} className="text-error mx-auto mb-4" />
                <p className="text-error font-medium">{error}</p>
                <button
                  onClick={loadBeneficiaries}
                  className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium cursor-pointer"
                >
                  Reintentar
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users size={40} className="text-outline mx-auto mb-4" />
                <p className="text-on-surface font-medium">
                  {searchQuery
                    ? 'No se encontraron beneficiarios con ese criterio'
                    : activeTab === 'pending'
                      ? 'No hay beneficiarios pendientes de verificación'
                      : 'No hay beneficiarios en esta categoría'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((beneficiary) => {
                  const statusCfg = STATUS_CONFIG[beneficiary.verificationStatus];
                  const docs = beneficiary.documents || [];
                  const hasDocuments = docs.length > 0;

                  return (
                    <div
                      key={beneficiary.id}
                      className="flex flex-col gap-4 p-4 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low transition"
                    >
                      {/* Fila superior: informacion + acciones */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-on-surface truncate">
                              {beneficiary.fullName || 'Sin nombre'}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.color}`}
                            >
                              {beneficiary.verificationStatus === 'pending' && <Clock size={12} />}
                              {beneficiary.verificationStatus === 'verified' && <CheckCircle size={12} />}
                              {beneficiary.verificationStatus === 'rejected' && <XCircle size={12} />}
                              {statusCfg.label}
                            </span>
                            {hasDocuments && (
                              <span className="text-xs text-on-surface-variant">
                                ({docs.length} doc{docs.length > 1 ? 's' : ''})
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-on-surface-variant">
                            <span>CC: {beneficiary.documentId || '—'}</span>
                            <span>{'📱'} {beneficiary.phone || '—'}</span>
                            <span>{'📍'} {beneficiary.city || '—'}</span>
                            {beneficiary.verificationNotes && (
                              <span className="text-error italic w-full mt-1">
                                Motivo: {beneficiary.verificationNotes}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Acciones segun estado */}
                        {beneficiary.verificationStatus === 'pending' && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleVerify(beneficiary.id, 'verified')}
                              disabled={actionLoading === beneficiary.id}
                              className="flex items-center gap-1.5 px-4 py-2 bg-success text-on-success rounded-xl text-sm font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                            >
                              <CheckCircle size={16} />
                              Aprobar
                            </button>
                            <button
                              onClick={() => {
                                const notes = prompt('Motivo del rechazo:');
                                if (notes && notes.trim()) {
                                  handleVerify(beneficiary.id, 'rejected', notes.trim());
                                }
                              }}
                              disabled={actionLoading === beneficiary.id}
                              className="flex items-center gap-1.5 px-4 py-2 bg-error text-on-error rounded-xl text-sm font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                            >
                              <XCircle size={16} />
                              Rechazar
                            </button>
                          </div>
                        )}

                        {beneficiary.verificationStatus === 'verified' && (
                          <button
                            onClick={() => {
                              const notes = prompt('Motivo del rechazo:');
                              if (notes && notes.trim()) {
                                handleVerify(beneficiary.id, 'rejected', notes.trim());
                              }
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-error/10 text-error rounded-xl text-sm font-semibold hover:bg-error/20 transition cursor-pointer shrink-0"
                          >
                            <XCircle size={16} />
                            Revocar
                          </button>
                        )}

                        {beneficiary.verificationStatus === 'rejected' && (
                          <button
                            onClick={() => handleVerify(beneficiary.id, 'verified')}
                            disabled={actionLoading === beneficiary.id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-success/10 text-success rounded-xl text-sm font-semibold hover:bg-success/20 transition cursor-pointer shrink-0"
                          >
                            <CheckCircle size={16} />
                            Re-verificar
                          </button>
                        )}
                      </div>

                      {/* Documentos subidos (solo si tiene) */}
                      {hasDocuments && (
                        <div className="border-t border-outline-variant/50 pt-3 mt-1">
                          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FileText size={12} />
                            Documentos de validacion
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {docs.map((doc) => (
                              <DocCard key={doc.id} doc={doc} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sin documentos (solo pendientes) */}
                      {!hasDocuments && beneficiary.verificationStatus === 'pending' && (
                        <div className="border-t border-outline-variant/50 pt-3 mt-1">
                          <p className="text-xs text-amber-600 flex items-center gap-1.5">
                            <AlertTriangle size={12} />
                            Este beneficiario aun no ha subido ningun documento de validacion.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  VISTA DETALLE DEL BENEFICIARIO
// ═══════════════════════════════════════════════════════════

interface BeneficiaryDetailProps {
  beneficiary: Beneficiary;
  onBack: () => void;
  onVerify: (userId: string, status: VerificationStatus, notes?: string) => Promise<void>;
  actionLoading: string | null;
}

/**
 * Vista detalle de un beneficiario con toda su información,
 * documentos subidos y botones para aprobar/rechazar.
 */
function BeneficiaryDetail({
  beneficiary,
  onBack,
  onVerify,
  actionLoading,
}: BeneficiaryDetailProps) {
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const statusCfg = STATUS_CONFIG[beneficiary.verificationStatus];
  const docs = beneficiary.documents || [];

  const typeLabels: Record<string, string> = {
    persona_natural: 'Persona Natural',
    cabeza_familia: 'Cabeza de Familia',
    adulto_mayor: 'Adulto Mayor',
    otro: 'Otro',
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant" aria-label="Volver">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-on-surface">{beneficiary.fullName}</h2>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.color}`}>
              {beneficiary.verificationStatus === 'pending' && <Clock size={12} />}
              {beneficiary.verificationStatus === 'verified' && <CheckCircle size={12} />}
              {beneficiary.verificationStatus === 'rejected' && <XCircle size={12} />}
              {statusCfg.label}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant">CC: {beneficiary.documentId || '\u2014'} &middot; {beneficiary.city || '\u2014'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-4 flex items-center gap-2"><ShieldCheck size={16} /> Informaci\u00f3n personal</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><p className="text-xs text-on-surface-variant">Nombre completo</p><p className="text-sm font-medium text-on-surface">{beneficiary.fullName || '\u2014'}</p></div>
              <div><p className="text-xs text-on-surface-variant">C\u00e9dula</p><p className="text-sm font-medium text-on-surface">{beneficiary.documentId || '\u2014'}</p></div>
              <div><p className="text-xs text-on-surface-variant">Tipo</p><p className="text-sm font-medium text-on-surface">{typeLabels[beneficiary.beneficiaryType] || beneficiary.beneficiaryType || '\u2014'}</p></div>
              <div><p className="text-xs text-on-surface-variant"><Phone size={12} className="inline mr-1" /> Tel\u00e9fono</p><p className="text-sm font-medium text-on-surface">{beneficiary.phone || '\u2014'}</p></div>
              <div className="sm:col-span-2"><p className="text-xs text-on-surface-variant"><MapPin size={12} className="inline mr-1" /> Direcci\u00f3n</p><p className="text-sm font-medium text-on-surface">{beneficiary.address || '\u2014'}</p></div>
              <div><p className="text-xs text-on-surface-variant"><MapPin size={12} className="inline mr-1" /> Ciudad</p><p className="text-sm font-medium text-on-surface">{beneficiary.city || '\u2014'}</p></div>
              <div><p className="text-xs text-on-surface-variant"><Calendar size={12} className="inline mr-1" /> Registro</p><p className="text-sm font-medium text-on-surface">{beneficiary.createdAt ? new Date(beneficiary.createdAt).toLocaleDateString('es-CO') : '\u2014'}</p></div>
            </div>
            {beneficiary.verificationNotes && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-700">Motivo de rechazo:</p>
                <p className="text-sm text-red-600">{beneficiary.verificationNotes}</p>
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-4 flex items-center gap-2"><FileText size={16} /> Documentos de validaci\u00f3n</h3>
            {docs.length === 0 ? (
              <div className="text-center py-6"><FileText size={28} className="text-outline/50 mx-auto mb-2" /><p className="text-sm text-on-surface-variant">No ha subido documentos a\u00fan.</p></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{docs.map((doc) => <DocCard key={doc.id} doc={doc} />)}</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-4">Acciones</h3>
            {beneficiary.verificationStatus === 'pending' && (
              <div className="space-y-3">
                <p className="text-sm text-on-surface-variant">Revisa los documentos antes de decidir.</p>
                <button onClick={() => onVerify(beneficiary.id, 'verified')} disabled={actionLoading === beneficiary.id} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success text-white rounded-xl text-sm font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50">
                  {actionLoading === beneficiary.id ? <RefreshCw size={16} className="animate-spin" /> : <CheckCircle size={18} />}
                  Aprobar beneficiario
                </button>
                <button onClick={() => { const notes = prompt('Motivo del rechazo (obligatorio):'); if (notes && notes.trim()) onVerify(beneficiary.id, 'rejected', notes.trim()); }} disabled={actionLoading === beneficiary.id} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error text-white rounded-xl text-sm font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50">
                  <XCircle size={18} />
                  Rechazar beneficiario
                </button>
              </div>
            )}
            {beneficiary.verificationStatus === 'verified' && (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2"><CheckCircle size={16} className="text-green-600 shrink-0" /><p className="text-sm text-green-700">Beneficiario verificado.</p></div>
                <button onClick={() => { const notes = prompt('Motivo de la revocaci\u00f3n (obligatorio):'); if (notes && notes.trim()) onVerify(beneficiary.id, 'rejected', notes.trim()); }} disabled={actionLoading === beneficiary.id} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error/10 text-error rounded-xl text-sm font-semibold hover:bg-error/20 transition cursor-pointer disabled:opacity-50">
                  <XCircle size={18} />
                  Revocar verificaci\u00f3n
                </button>
              </div>
            )}
            {beneficiary.verificationStatus === 'rejected' && (
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">{beneficiary.verificationNotes && <p className="text-sm text-red-600">{beneficiary.verificationNotes}</p>}</div>
                <button onClick={() => onVerify(beneficiary.id, 'verified')} disabled={actionLoading === beneficiary.id} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success/10 text-success rounded-xl text-sm font-semibold hover:bg-success/20 transition cursor-pointer disabled:opacity-50">
                  <CheckCircle size={18} />
                  Re-verificar
                </button>
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3">Documentos</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low p-3 rounded-lg text-center"><p className="text-lg font-bold text-primary">{docs.length}</p><p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Subidos</p></div>
              <div className="bg-surface-container-low p-3 rounded-lg text-center"><p className="text-lg font-bold text-primary">{docs.filter((d) => d.storageUrl).length}</p><p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Con imagen</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTE INTERNO: DocCard ───

/**
 * Tarjeta individual que muestra un documento subido con enlace directo a Firebase Storage.
 * Renderiza un icono segun el tipo de archivo (imagen con vista previa, PDF con icono).
 */
function DocCard({ doc }: { doc: BeneficiaryDocument }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const isImage = doc.storageUrl.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i);
  const docLabel = DOCUMENT_TYPE_LABELS[doc.type as keyof typeof DOCUMENT_TYPE_LABELS] || doc.type;
  const uploadedDate = new Date(doc.uploadedAt).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <div className="flex items-start gap-2 p-2 rounded-lg bg-surface-container-low border border-outline-variant/40 hover:border-primary/40 transition group">
        {/* Icono / miniatura */}
        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden">
          {isImage ? (
            <img
              src={doc.storageUrl}
              alt={docLabel}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setPreviewOpen(true)}
            />
          ) : (
            <FileText size={16} className="text-primary" />
          )}
        </div>

        {/* Info del documento */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-on-surface truncate" title={doc.fileName}>
            {docLabel}
          </p>
          <p className="text-[10px] text-on-surface-variant">{uploadedDate}</p>
        </div>

        {/* Enlace para abrir/descargar */}
        <a
          href={doc.storageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary-container transition opacity-0 group-hover:opacity-100"
          title="Abrir documento"
        >
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Modal de previsualizacion de imagen */}
      {previewOpen && isImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute -top-10 right-0 text-white text-sm font-medium hover:text-gray-300 cursor-pointer"
            >
              X Cerrar
            </button>
            <img
              src={doc.storageUrl}
              alt={docLabel}
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
            />
            <p className="text-white text-sm text-center mt-2">{docLabel} - {doc.fileName}</p>
          </div>
        </div>
      )}
    </>
  );
}
