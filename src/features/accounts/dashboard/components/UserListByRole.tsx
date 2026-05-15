import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../config/firebase';
import { VerifyBeneficiary } from '../../../beneficiary/domain/usecases/VerifyBeneficiary';
import { BeneficiaryDataSource } from '../../../beneficiary/data/datasources/BeneficiaryDataSource';
import { BeneficiaryRepositoryImpl } from '../../../beneficiary/data/repositories/BeneficiaryRepositoryImpl';
import {
  Search,
  Users,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  FileText,
} from 'lucide-react';

type UserRole = 'donador' | 'beneficiario' | 'empresa';

interface UserData {
  id: string;
  uid?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  role?: string;
  createdAt?: string;
  verificationStatus?: string;
  documents?: any[];
  [key: string]: any;
}

interface UserListByRoleProps {
  role: UserRole;
  onBack: () => void;
}

const ROLE_CONFIG: Record<UserRole, { title: string; icon: any; color: string; bgColor: string }> = {
  donador: {
    title: 'Donadores',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  beneficiario: {
    title: 'Beneficiarios',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  empresa: {
    title: 'Empresas',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
};

/**
 * Componente que lista todos los usuarios de un rol específico.
 * Para beneficiarios, permite seleccionar y ver detalle con aprobación/rechazo.
 * Para donadores y empresas, muestra información básica.
 */
export function UserListByRole({ role, onBack }: UserListByRoleProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const config = ROLE_CONFIG[role];
  const Icon = config.icon;

  useEffect(() => {
    loadUsers();
  }, [role]);

  /**
   * Carga usuarios desde Firestore filtrados por rol.
   * Busca en la colección 'users' donde role === role.
   * Adicionalmente, para beneficiarios busca datos complementarios
   * en la colección 'beneficiaries'.
   */
  async function loadUsers() {
    setLoading(true);
    setError('');
    try {
      const q = query(collection(db, 'users'), where('role', '==', role));
      const snapshot = await getDocs(q);
      const userList: UserData[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as UserData;
        const baseUser: UserData = {
          id: docSnap.id,
          uid: docSnap.id,
          ...data,
        };

        // Para beneficiarios, enriquecer con datos del perfil en /beneficiaries/{uid}
        if (role === 'beneficiario') {
          try {
            const benRef = doc(db, 'beneficiaries', docSnap.id);
            const benSnap = await getDoc(benRef);
            if (benSnap.exists()) {
              const benData = benSnap.data();
              Object.assign(baseUser, {
                fullName: benData.fullName || baseUser.name || baseUser.fullName,
                documentId: benData.documentId,
                address: benData.address,
                city: benData.city || baseUser.city,
                phone: benData.phone || baseUser.phone,
                verificationStatus: benData.verificationStatus || 'pending',
                documents: benData.documents || [],
                beneficiaryType: benData.beneficiaryType,
                latitude: benData.latitude,
                longitude: benData.longitude,
                verificationNotes: benData.verificationNotes,
                createdAt: benData.createdAt || baseUser.createdAt,
                updatedAt: benData.updatedAt,
              });
            }
          } catch (e) {
            // Si no existe perfil extendido, usar datos base
          }
        }

        userList.push(baseUser);
      }

      // Ordenar por fecha de creación descendente
      userList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setUsers(userList);
    } catch (err) {
      console.error(`[UserListByRole] Error al cargar ${role}:`, err);
      setError(`No se pudieron cargar los ${config.title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }

  // Usuarios filtrados por búsqueda
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        (u.fullName || u.name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q) ||
        (u.city || '').toLowerCase().includes(q) ||
        (u.documentId || '').includes(q) ||
        (u.phone || '').includes(q)
    );
  }, [users, searchQuery]);

  // ─── VISTA DETALLE (solo para beneficiarios) ───
  if (selectedUser && role === 'beneficiario') {
    return (
      <BeneficiaryDetailView
        user={selectedUser}
        onBack={() => setSelectedUser(null)}
        onStatusChange={(newStatus, notes) => {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === selectedUser.id
                ? { ...u, verificationStatus: newStatus, verificationNotes: notes }
                : u
            )
          );
          setSelectedUser((prev) =>
            prev ? { ...prev, verificationStatus: newStatus, verificationNotes: notes } : prev
          );
        }}
      />
    );
  }

  // ─── VISTA LISTA ───
  return (
    <div className="animate-fade-in">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
          aria-label="Volver"
        >
          <ArrowLeft size={20} className="text-on-surface-variant" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-on-surface">
            {config.title}
          </h2>
          <p className="text-sm text-on-surface-variant">
            {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}>
              <Icon size={20} className={config.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{users.length}</p>
              <p className="text-xs text-on-surface-variant font-medium">Total</p>
            </div>
          </div>
        </div>
        {role === 'beneficiario' && (
          <>
            <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Clock size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-on-surface">
                    {users.filter((u) => u.verificationStatus === 'pending').length}
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium">Pendientes</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-on-surface">
                    {users.filter((u) => u.verificationStatus === 'verified').length}
                  </p>
                  <p className="text-xs text-on-surface-variant font-medium">Verificados</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Búsqueda */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-3 border-b border-outline-variant">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Buscar ${config.title.toLowerCase()}...`}
              className="w-full pl-9 pr-3 py-2 bg-surface text-on-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="p-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw size={28} className="text-primary animate-spin mb-3" />
              <p className="text-sm text-on-surface-variant">Cargando usuarios...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle size={36} className="text-error mx-auto mb-3" />
              <p className="text-error font-medium text-sm">{error}</p>
              <button
                onClick={loadUsers}
                className="mt-3 px-5 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users size={36} className="text-outline mx-auto mb-3" />
              <p className="text-on-surface font-medium text-sm">
                {searchQuery
                  ? `No se encontraron ${config.title.toLowerCase()} con ese criterio`
                  : `No hay ${config.title.toLowerCase()} registrados`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container-low transition cursor-pointer"
                  onClick={() => role === 'beneficiario' && setSelectedUser(user)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        role === 'donador'
                          ? 'bg-blue-100 text-blue-600'
                          : role === 'beneficiario'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-purple-100 text-purple-600'
                      }`}
                    >
                      <span className="font-bold text-sm">
                        {(user.fullName || user.name || '?').charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-on-surface truncate">
                          {user.fullName || user.name || 'Sin nombre'}
                        </p>
                        {role === 'beneficiario' && user.verificationStatus && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${
                              user.verificationStatus === 'verified'
                                ? 'bg-green-50 text-green-600 border-green-200'
                                : user.verificationStatus === 'rejected'
                                  ? 'bg-red-50 text-red-600 border-red-200'
                                  : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                            }`}
                          >
                            {user.verificationStatus === 'verified'
                              ? 'Verificado'
                              : user.verificationStatus === 'rejected'
                                ? 'Rechazado'
                                : 'Pendiente'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant truncate flex items-center gap-2">
                        <span>{user.email || '—'}</span>
                        {user.city && <><span className="text-outline">·</span><span>{user.city}</span></>}
                      </p>
                    </div>
                  </div>

                  {role === 'beneficiario' && (
                    <span className="text-on-surface-variant text-lg shrink-0">&rsaquo;</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  VISTA DETALLE DE BENEFICIARIO
// ═══════════════════════════════════════════════════════════

interface BeneficiaryDetailViewProps {
  user: UserData;
  onBack: () => void;
  onStatusChange: (status: string, notes?: string) => void;
}

// ═══════════════════════════════════════════════════════════
//  CHECKLIST DE COMPLETITUD
// ═══════════════════════════════════════════════════════════

function BeneficiaryDetailView({ user, onBack, onStatusChange }: BeneficiaryDetailViewProps) {
  const [updating, setUpdating] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const statusCfg = {
    verified: { label: 'Verificado', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
    rejected: { label: 'Rechazado', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    pending: { label: 'Pendiente', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
  }[user.verificationStatus || 'pending'] || {
    label: 'Pendiente',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 border-yellow-200',
  };

  const typeLabels: Record<string, string> = {
    persona_natural: 'Persona Natural',
    cabeza_familia: 'Cabeza de Familia',
    adulto_mayor: 'Adulto Mayor',
    otro: 'Otro',
  };

  const docLabels: Record<string, string> = {
    cedula_frontal: 'Cédula (Frontal)',
    cedula_posterior: 'Cédula (Posterior)',
    cuenta_servicios: 'Cuenta de Servicios',
    foto_perfil: 'Foto de Perfil',
  };

  const documents = user.documents || [];

  /**
   * Actualiza el estado de verificación del beneficiario en Firestore.
   */
  const updateStatus = async (newStatus: string, notes?: string) => {
    setUpdating(true);
    try {
      const ds = new BeneficiaryDataSource();
      const repo = new BeneficiaryRepositoryImpl(ds);
      const useCase = new VerifyBeneficiary(repo);

      await useCase.execute(user.id, newStatus as any, notes);
      onStatusChange(newStatus, notes);
    } catch (err) {
      console.error('[BeneficiaryDetailView] Error al actualizar estado:', err);
      alert('Error al actualizar el estado del beneficiario.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Encabezado */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
          aria-label="Volver a la lista"
        >
          <ArrowLeft size={20} className="text-on-surface-variant" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-on-surface">
              {user.fullName || user.name || 'Sin nombre'}
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.bg} ${statusCfg.color}`}
            >
              {statusCfg.label}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant">
            {user.email} {user.documentId && `· CC: ${user.documentId}`}
          </p>
        </div>
      </div>

      {/* Checklist de completitud */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ═══ COLUMNA IZQUIERDA: DATOS + DOCUMENTOS ═══ */}
        <div className="lg:col-span-2 space-y-5">
          {/* Datos personales */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-4 flex items-center gap-2">
              <ShieldCheck size={16} />
              Información personal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-on-surface-variant">Nombre</p>
                <p className="text-sm font-medium text-on-surface">
                  {user.fullName || user.name || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Cédula</p>
                <p className="text-sm font-medium text-on-surface">{user.documentId || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Tipo</p>
                <p className="text-sm font-medium text-on-surface">
                  {typeLabels[user.beneficiaryType] || user.beneficiaryType || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">
                  <Phone size={12} className="inline mr-1" />
                  Teléfono
                </p>
                <p className="text-sm font-medium text-on-surface">{user.phone || '—'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-on-surface-variant">
                  <MapPin size={12} className="inline mr-1" />
                  Dirección
                </p>
                <p className="text-sm font-medium text-on-surface">{user.address || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">
                  <MapPin size={12} className="inline mr-1" />
                  Ciudad
                </p>
                <p className="text-sm font-medium text-on-surface">{user.city || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">
                  <Calendar size={12} className="inline mr-1" />
                  Registro
                </p>
                <p className="text-sm font-medium text-on-surface">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('es-CO')
                    : '—'}
                </p>
              </div>
            </div>
            {user.verificationNotes && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-700">Motivo de rechazo:</p>
                <p className="text-sm text-red-600">{user.verificationNotes}</p>
              </div>
            )}
          </div>

          {/* Documentos */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-4 flex items-center gap-2">
              <FileText size={16} />
              Documentos de validación
            </h3>
            {documents.length === 0 ? (
              <div className="text-center py-6">
                <FileText size={28} className="text-outline/50 mx-auto mb-2" />
                <p className="text-sm text-on-surface-variant">
                  No ha subido documentos aún.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documents.map((doc: any, idx: number) => {
                  const isImage = doc.storageUrl?.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i);
                  return (
                    <div
                      key={doc.id || idx}
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 hover:border-primary/40 transition group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden">
                        {isImage ? (
                          <img
                            src={doc.storageUrl}
                            alt={doc.type}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setPreviewDoc(doc.storageUrl)}
                          />
                        ) : (
                          <FileText size={18} className="text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-on-surface truncate">
                          {docLabels[doc.type] || doc.type || 'Documento'}
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          {doc.uploadedAt
                            ? new Date(doc.uploadedAt).toLocaleDateString('es-CO')
                            : '—'}
                        </p>
                      </div>
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
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ═══ COLUMNA DERECHA: ACCIONES ═══ */}
        <div className="space-y-4">
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-4">
              Acciones
            </h3>

            {(!user.verificationStatus || user.verificationStatus === 'pending') && (
              <div className="space-y-3">
                <p className="text-sm text-on-surface-variant">
                  Revisa los documentos del beneficiario antes de aprobar o rechazar.
                </p>
                <button
                  onClick={() => updateStatus('verified')}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success text-white rounded-xl text-sm font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                >
                  {updating ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  Aprobar beneficiario
                </button>
                <button
                  onClick={() => {
                    const notes = prompt('Motivo del rechazo (obligatorio):');
                    if (notes && notes.trim()) {
                      updateStatus('rejected', notes.trim());
                    }
                  }}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error text-white rounded-xl text-sm font-semibold hover:brightness-110 transition cursor-pointer disabled:opacity-50"
                >
                  <XCircle size={18} />
                  Rechazar beneficiario
                </button>
              </div>
            )}

            {user.verificationStatus === 'verified' && (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600 shrink-0" />
                  <p className="text-sm text-green-700">Beneficiario verificado.</p>
                </div>
                <button
                  onClick={() => {
                    const notes = prompt('Motivo de la revocación (obligatorio):');
                    if (notes && notes.trim()) {
                      updateStatus('rejected', notes.trim());
                    }
                  }}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error/10 text-error rounded-xl text-sm font-semibold hover:bg-error/20 transition cursor-pointer disabled:opacity-50"
                >
                  <XCircle size={18} />
                  Revocar verificación
                </button>
              </div>
            )}

            {user.verificationStatus === 'rejected' && (
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  {user.verificationNotes && (
                    <p className="text-sm text-red-600">{user.verificationNotes}</p>
                  )}
                </div>
                <button
                  onClick={() => updateStatus('verified')}
                  disabled={updating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success/10 text-success rounded-xl text-sm font-semibold hover:bg-success/20 transition cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  Re-verificar
                </button>
              </div>
            )}
          </div>

          {/* Stats rápidas */}
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3">
              Documentos
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-container-low p-3 rounded-lg text-center">
                <p className="text-lg font-bold text-primary">{documents.length}</p>
                <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                  Subidos
                </p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg text-center">
                <p className="text-lg font-bold text-primary">
                  {documents.filter((d: any) => d.storageUrl).length}
                </p>
                <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
                  Con imagen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal preview de documento */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPreviewDoc(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute -top-10 right-0 text-white text-sm font-medium hover:text-gray-300 cursor-pointer"
            >
              ✕ Cerrar
            </button>
            <img
              src={previewDoc}
              alt="Documento"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
