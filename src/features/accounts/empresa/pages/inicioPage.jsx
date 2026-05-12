import { Package, Gift, Users, MapPin, TrendingUp } from 'lucide-react';
import KPICard from '../components/KPICard';
import RecentDonationsTable from '../components/RecentDonationsTable';
import ActivityFeed from '../components/ActivityFeed';

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const BAR_DATA = [40, 65, 50, 80, 70, 90, 75, 85, 60, 95, 88, 72];
const BAR_PREV = [30, 55, 45, 70, 60, 75, 65, 70, 50, 80, 72, 60];

export default function InicioPage({ data }) {
  const { kpi, donations, activity, company } = data;

  return (
    <div>
      {/* Bienvenida */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="empresa-page-title">
          ¡Bienvenido, {company?.name?.split(' ')[0] || 'Empresa'}! 👋
        </h1>
        <p className="empresa-page-subtitle">
          Resumen de actividad y donaciones de tu empresa
        </p>
      </div>

      {/* KPIs */}
      <div className="empresa-kpis">
        <KPICard
          icon={Package}
          label="Toneladas donadas"
          value={`${kpi.toneladasDonadas} t`}
          trend="12%"
          trendDir="up"
          color="#3525cd"
          bg="#eaedff"
        />
        <KPICard
          icon={Gift}
          label="Donaciones activas"
          value={kpi.donacionesActivas}
          trend="3 nuevas"
          trendDir="up"
          color="#712ae2"
          bg="#f3e8ff"
        />
        <KPICard
          icon={Users}
          label="Beneficiarios alcanzados"
          value={kpi.beneficiarios}
          trend="8%"
          trendDir="up"
          color="#047857"
          bg="#ecfdf5"
        />
        <KPICard
          icon={MapPin}
          label="Puntos logísticos"
          value={kpi.puntosLogisticos}
          color="#854d0e"
          bg="#fef9c3"
        />
      </div>

      {/* Gráfica + Actividad */}
      <div className="empresa-grid-2">
        {/* Gráfica mensual */}
        <div className="empresa-card">
          <div className="empresa-card-header">
            <span className="empresa-card-title">Donaciones mensuales 2025</span>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: '#4f46e5' }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>2025</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: '#c7d2fe' }} />
                <span style={{ fontSize: 11, color: '#64748b' }}>2024</span>
              </div>
            </div>
          </div>
          {/* Chart */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 120, padding: '0 4px' }}>
            {BAR_DATA.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'flex-end', height: '100%' }}>
                  <div
                    style={{
                      height: `${(val / 100) * 100}%`,
                      background: 'linear-gradient(180deg, #4f46e5, #712ae2)',
                      borderRadius: '4px 4px 0 0',
                      opacity: 0.85,
                      minHeight: 4,
                      transition: 'height 0.5s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, padding: '6px 4px 0' }}>
            {MONTHS.map(m => (
              <div key={m} style={{ flex: 1, fontSize: 9, color: '#94a3b8', textAlign: 'center', fontWeight: 500 }}>
                {m}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, padding: '10px 0 0', borderTop: '1px solid #f2f3ff' }}>
            <TrendingUp size={14} color="#047857" />
            <span style={{ fontSize: 12, color: '#047857', fontWeight: 600 }}>+18% vs. año anterior</span>
            <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 4 }}>en toneladas donadas</span>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="empresa-card">
          <div className="empresa-card-header">
            <span className="empresa-card-title">Actividad reciente</span>
            <button className="empresa-card-action">Ver todo</button>
          </div>
          <ActivityFeed activity={activity} />
        </div>
      </div>

      {/* Últimas donaciones */}
      <div className="empresa-card">
        <div className="empresa-card-header">
          <span className="empresa-card-title">Últimas donaciones</span>
          <button className="empresa-card-action">Ver todas</button>
        </div>
        <RecentDonationsTable donations={donations} />
      </div>
    </div>
  );
}
