import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { BeneficiaryDataSource } from '../../features/beneficiary/data/datasources/BeneficiaryDataSource';
import { BeneficiaryRepositoryImpl } from '../../features/beneficiary/data/repositories/BeneficiaryRepositoryImpl';
import { ListBeneficiaries } from '../../features/beneficiary/domain/usecases/ListBeneficiaries';
import { VerifyBeneficiary } from '../../features/beneficiary/domain/usecases/VerifyBeneficiary';
import type { Beneficiary, VerificationStatus } from '../../features/beneficiary/domain/entities/Beneficiary';

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
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  async function loadBeneficiaries() {
    setLoading(true);
    setError('');
    try {
      const list = await listUseCase.execute();
      setBeneficiaries(list);
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
                  return (
                    <div
                      key={beneficiary.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low transition"
                    >
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
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-on-surface-variant">
                          <span>CC: {beneficiary.documentId || '—'}</span>
                          <span>📱 {beneficiary.phone || '—'}</span>
                          <span>📍 {beneficiary.city || '—'}</span>
                          {beneficiary.verificationNotes && (
                            <span className="text-error italic w-full mt-1">
                              Motivo: {beneficiary.verificationNotes}
                            </span>
                          )}
                        </div>
                      </div>

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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
