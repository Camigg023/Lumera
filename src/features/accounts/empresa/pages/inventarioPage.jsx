import { useState } from 'react';
import { Search, Package } from 'lucide-react';

const LEVEL_COLORS = {
  bajo: { fill: '#ba1a1a', bg: '#ffdad6' },
  normal: { fill: '#854d0e', bg: '#fef9c3' },
  alto: { fill: '#047857', bg: '#ecfdf5' },
};

const CATEGORIES = ['Todos', 'Cereales', 'Grasas', 'Lácteos', 'Legumbres', 'Harinas', 'Endulzantes', 'Condimentos', 'Conservas'];

export default function InventarioPage({ data }) {
  const { inventory } = data;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const filtered = inventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todos' || item.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <h1 className="empresa-page-title">Inventario</h1>
      <p className="empresa-page-subtitle">Control de stock y vencimiento de productos</p>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="empresa-search-bar" style={{ flex: 1, minWidth: 200, margin: 0 }}>
          <Search />
          <input placeholder="Buscar producto…" value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                border: '1px solid', cursor: 'pointer',
                borderColor: category === cat ? '#4f46e5' : '#e2e7ff',
                background: category === cat ? '#eaedff' : 'white',
                color: category === cat ? '#3525cd' : '#64748b',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Stock bajo', count: inventory.filter(i => i.level === 'bajo').length, color: '#ba1a1a', bg: '#ffdad6' },
          { label: 'Stock normal', count: inventory.filter(i => i.level === 'normal').length, color: '#854d0e', bg: '#fef9c3' },
          { label: 'Stock alto', count: inventory.filter(i => i.level === 'alto').length, color: '#047857', bg: '#ecfdf5' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.count}</span>
            <span style={{ fontSize: 12, color: s.color, fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="empresa-inventory-grid">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#94a3b8' }}>
            <Package size={36} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
            <p>No se encontraron productos</p>
          </div>
        ) : filtered.map(item => {
          const pct = Math.round((item.stock / item.maxStock) * 100);
          const { fill, bg } = LEVEL_COLORS[item.level] || LEVEL_COLORS.normal;
          return (
            <div key={item.id} className="empresa-inventory-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#131b2e', margin: 0 }}>{item.name}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>{item.category}</p>
                </div>
                <span className={`empresa-badge ${item.level}`}>{item.level}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#131b2e' }}>
                  {item.stock} <span style={{ fontSize: 11, color: '#64748b', fontWeight: 400 }}>{item.unit}</span>
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{pct}%</span>
              </div>
              <div className="empresa-stock-bar">
                <div className="empresa-stock-fill" style={{ width: `${pct}%`, background: fill }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 10, color: '#94a3b8' }}>Máx: {item.maxStock} {item.unit}</span>
                <span style={{ fontSize: 10, color: item.level === 'bajo' ? '#ba1a1a' : '#94a3b8' }}>
                  Vence: {item.expiry}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
