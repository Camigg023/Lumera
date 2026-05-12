const STATUS_LABEL = {
  pendiente: 'Pendiente',
  transito: 'En tránsito',
  entregada: 'Entregada',
  cancelada: 'Cancelada',
};

export default function RecentDonationsTable({ donations = [] }) {
  const recent = donations.slice(0, 5);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="empresa-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Destino</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {recent.map(d => (
            <tr key={d.id}>
              <td style={{ fontWeight: 600, color: '#131b2e' }}>{d.productName}</td>
              <td>{d.quantity} {d.unit}</td>
              <td style={{ color: '#64748b', fontSize: 12 }}>{d.destination}</td>
              <td>
                <span className={`empresa-badge ${d.status}`}>
                  {STATUS_LABEL[d.status] || d.status}
                </span>
              </td>
              <td style={{ color: '#94a3b8', fontSize: 12 }}>
                {d.createdAt instanceof Date
                  ? d.createdAt.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
                  : String(d.createdAt).slice(0, 10)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
