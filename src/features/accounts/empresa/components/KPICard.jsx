export default function KPICard({ icon: Icon, label, value, trend, trendDir, color, bg }) {
  return (
    <div className="empresa-kpi-card">
      <div className="empresa-kpi-top">
        <div className="empresa-kpi-icon" style={{ background: bg }}>
          <Icon size={20} color={color} />
        </div>
        {trend && (
          <span className={`empresa-kpi-trend ${trendDir === 'up' ? 'up' : 'down'}`}>
            {trendDir === 'up' ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className="empresa-kpi-value">{value}</div>
      <div className="empresa-kpi-label">{label}</div>
    </div>
  );
}
