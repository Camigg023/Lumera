import { useState } from 'react';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May'];
const DATA_2025 = [42, 68, 55, 82, 74];
const DATA_2024 = [35, 58, 48, 70, 62];

export default function ReportesPage({ data }) {
  const [toast, setToast] = useState(null);

  function handleExport(format) {
    setToast(`✓ Reporte exportado en formato ${format}`);
    setTimeout(() => setToast(null), 3000);
  }

  const totalDonaciones = data.donations.length;
  const entregadas = data.donations.filter(d => d.status === 'entregada').length;
  const tasaExito = totalDonaciones ? Math.round((entregadas / totalDonaciones) * 100) : 0;
  const totalKg = data.donations.reduce((acc, d) => acc + (d.unit === 'kg' ? d.quantity : 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 className="empresa-page-title">Reportes</h1>
          <p className="empresa-page-subtitle">Estadísticas y comparativas de donaciones</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="empresa-btn-secondary" onClick={() => handleExport('PDF')}>
            <Download size={14} /> PDF
          </button>
          <button className="empresa-btn-secondary" onClick={() => handleExport('Excel')}>
            <Download size={14} /> Excel
          </button>
        </div>
      </div>

      {/* Stats resumen */}
      <div className="empresa-kpis" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total donaciones', value: totalDonaciones, trend: '+18%', up: true },
          { label: 'Entregadas', value: entregadas, trend: '+12%', up: true },
          { label: 'Tasa de éxito', value: `${tasaExito}%`, trend: tasaExito > 70 ? '+5%' : '-3%', up: tasaExito > 70 },
          { label: 'Kg donados (registrados)', value: `${totalKg} kg`, trend: '+24%', up: true },
        ].map(s => (
          <div key={s.label} className="empresa-kpi-card">
            <div className="empresa-kpi-value">{s.value}</div>
            <div className="empresa-kpi-label">{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
              {s.up ? <TrendingUp size={12} color="#047857" /> : <TrendingDown size={12} color="#ba1a1a" />}
              <span style={{ fontSize: 11, color: s.up ? '#047857' : '#ba1a1a', fontWeight: 600 }}>{s.trend}</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>vs. mes anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="empresa-grid-2">
        {/* Comparativa mensual */}
        <div className="empresa-card">
          <div className="empresa-card-header">
            <span className="empresa-card-title">Comparativa mensual</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#4f46e5' }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>2025</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: '#c7d2fe' }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>2024</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 140, padding: '0 4px' }}>
            {DATA_2025.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'stretch', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    flex: 1, height: `${(DATA_2024[i] / 100) * 100}%`,
                    background: '#c7d2fe', borderRadius: '4px 4px 0 0', minHeight: 4
                  }} />
                  <div style={{
                    flex: 1, height: `${(val / 100) * 100}%`,
                    background: 'linear-gradient(180deg, #4f46e5, #712ae2)',
                    borderRadius: '4px 4px 0 0', minHeight: 4, opacity: 0.9
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, padding: '8px 4px 0' }}>
            {MONTHS.map(m => (
              <div key={m} style={{ flex: 1, fontSize: 11, color: '#94a3b8', textAlign: 'center', fontWeight: 500 }}>{m}</div>
            ))}
          </div>
        </div>

        {/* Estado de donaciones */}
        <div className="empresa-card">
          <div className="empresa-card-header">
            <span className="empresa-card-title">Estado de donaciones</span>
          </div>
          {[
            { label: 'Entregadas', status: 'entregada', color: '#047857', bg: '#ecfdf5' },
            { label: 'En tránsito', status: 'transito', color: '#3525cd', bg: '#eaedff' },
            { label: 'Pendientes', status: 'pendiente', color: '#854d0e', bg: '#fef9c3' },
            { label: 'Canceladas', status: 'cancelada', color: '#ba1a1a', bg: '#ffdad6' },
          ].map(s => {
            const count = data.donations.filter(d => d.status === s.status).length;
            const pct = totalDonaciones ? Math.round((count / totalDonaciones) * 100) : 0;
            return (
              <div key={s.status} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#131b2e' }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height: 8, background: '#f2f3ff', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 99, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabla por destino */}
      <div className="empresa-card" style={{ marginTop: 20 }}>
        <div className="empresa-card-header">
          <span className="empresa-card-title">Donaciones por destino</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="empresa-table">
            <thead>
              <tr>
                <th>Destino</th>
                <th>Donaciones</th>
                <th>Entregadas</th>
                <th>Tasa</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                data.donations.reduce((acc, d) => {
                  if (!acc[d.destination]) acc[d.destination] = { total: 0, entregadas: 0 };
                  acc[d.destination].total++;
                  if (d.status === 'entregada') acc[d.destination].entregadas++;
                  return acc;
                }, {})
              ).map(([dest, stats]) => {
                const tasa = Math.round((stats.entregadas / stats.total) * 100);
                return (
                  <tr key={dest}>
                    <td style={{ fontWeight: 600, color: '#131b2e' }}>{dest}</td>
                    <td>{stats.total}</td>
                    <td>{stats.entregadas}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: '#eaedff', borderRadius: 99, overflow: 'hidden', maxWidth: 80 }}>
                          <div style={{ height: '100%', width: `${tasa}%`, background: tasa > 60 ? '#047857' : '#854d0e', borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{tasa}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <div className="empresa-toast"><span style={{ color: '#86efac' }}>✓</span> {toast}</div>}
    </div>
  );
}
