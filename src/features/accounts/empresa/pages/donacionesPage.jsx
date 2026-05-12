import { useState } from 'react';
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_LABEL = { pendiente: 'Pendiente', transito: 'En tránsito', entregada: 'Entregada', cancelada: 'Cancelada' };
const FILTERS = ['Todos', 'Pendiente', 'En tránsito', 'Entregada', 'Cancelada'];

export default function DonacionesPage({ data }) {
  const { donations } = data;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ product: '', quantity: '', unit: 'kg', destination: '' });
  const [toast, setToast] = useState(null);
  const PER_PAGE = 5;

  const filtered = donations.filter(d => {
    const matchSearch = d.productName.toLowerCase().includes(search.toLowerCase()) ||
      d.destination.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Todos' || STATUS_LABEL[d.status] === filter;
    return matchSearch && matchFilter;
  });

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleSubmit() {
    if (!form.product || !form.quantity || !form.destination) return;
    setShowModal(false);
    setToast('✓ Donación registrada correctamente');
    setTimeout(() => setToast(null), 3000);
    setForm({ product: '', quantity: '', unit: 'kg', destination: '' });
  }

  return (
    <div>
      <h1 className="empresa-page-title">Donaciones</h1>
      <p className="empresa-page-subtitle">Gestiona y da seguimiento a tus donaciones</p>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="empresa-search-bar" style={{ flex: 1, minWidth: 200, margin: 0 }}>
          <Search />
          <input
            placeholder="Buscar producto o destino…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                border: '1px solid',
                cursor: 'pointer',
                borderColor: filter === f ? '#4f46e5' : '#e2e7ff',
                background: filter === f ? '#eaedff' : 'white',
                color: filter === f ? '#3525cd' : '#64748b',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="empresa-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Nueva donación
        </button>
      </div>

      {/* Tabla */}
      <div className="empresa-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="empresa-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 20 }}>#</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Destino</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    No se encontraron donaciones
                  </td>
                </tr>
              ) : visible.map((d, idx) => (
                <tr key={d.id}>
                  <td style={{ paddingLeft: 20, color: '#94a3b8', fontWeight: 600, fontSize: 12 }}>
                    {(page - 1) * PER_PAGE + idx + 1}
                  </td>
                  <td style={{ fontWeight: 600, color: '#131b2e' }}>{d.productName}</td>
                  <td>{d.quantity} {d.unit}</td>
                  <td style={{ color: '#64748b', fontSize: 12 }}>{d.destination}</td>
                  <td><span className={`empresa-badge ${d.status}`}>{STATUS_LABEL[d.status]}</span></td>
                  <td style={{ color: '#94a3b8', fontSize: 12 }}>
                    {d.createdAt instanceof Date
                      ? d.createdAt.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
                      : String(d.createdAt).slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="empresa-pagination" style={{ padding: '12px 20px' }}>
            <button className="empresa-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                className={`empresa-page-btn ${page === i + 1 ? 'active' : ''}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button className="empresa-page-btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Modal nueva donación */}
      {showModal && (
        <div className="empresa-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="empresa-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#131b2e' }}>
              Nueva donación
            </h2>
            <div className="empresa-form-group">
              <label className="empresa-label">Producto</label>
              <input className="empresa-input" placeholder="Ej: Arroz, Aceite, Leche…" value={form.product}
                onChange={e => setForm(p => ({ ...p, product: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="empresa-form-group">
                <label className="empresa-label">Cantidad</label>
                <input className="empresa-input" type="number" placeholder="0" value={form.quantity}
                  onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} />
              </div>
              <div className="empresa-form-group">
                <label className="empresa-label">Unidad</label>
                <select className="empresa-input" value={form.unit}
                  onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}>
                  <option>kg</option><option>litros</option><option>cajas</option><option>unidades</option>
                </select>
              </div>
            </div>
            <div className="empresa-form-group">
              <label className="empresa-label">Destino</label>
              <input className="empresa-input" placeholder="Fundación / Comedor…" value={form.destination}
                onChange={e => setForm(p => ({ ...p, destination: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button className="empresa-btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="empresa-btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
                Registrar donación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="empresa-toast">
          <span style={{ color: '#86efac' }}>✓</span> {toast}
        </div>
      )}
    </div>
  );
}
