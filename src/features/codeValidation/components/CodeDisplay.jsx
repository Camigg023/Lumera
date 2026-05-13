import QRCode from 'react-qr-code';

/**
 * Componente que muestra el código único de una donación
 * con estilo visual destacado para presentar en el punto de acopio.
 *
 * @param {{ codigo: string, estado?: string, tamaño?: 'sm' | 'lg' }} props
 */
export default function CodeDisplay({ codigo, estado = 'pendiente', tamaño = 'lg' }) {
  const isLg = tamaño === 'lg';

  if (!codigo) return null;

  return (
    <div
      className={`
        inline-flex flex-col items-center gap-3 p-5 rounded-2xl border-2
        ${estado === 'entregado' || estado === 'validado'
          ? 'bg-success-container border-success'
          : 'bg-surface-container-low border-outline-variant'
        }
      `}
    >
      {/* Label */}
      <span className={`font-medium ${isLg ? 'text-sm' : 'text-xs'} text-on-surface-variant uppercase tracking-wider`}>
        Código de donación
      </span>

      {/* QR Code (Solo para tamaño grande) */}
      {isLg && (
        <div className="bg-surface p-3 rounded-2xl shadow-sm border border-outline-variant">
          <QRCode 
            value={codigo} 
            size={160}
            fgColor={estado === 'entregado' || estado === 'validado' ? "#1b5e20" : "#3525cd"}
            level="H"
          />
        </div>
      )}

      {/* Código en texto */}
      <span
        className={`
          font-mono font-bold tracking-widest text-primary
          ${isLg ? 'text-3xl mt-2' : 'text-xl'}
        `}
      >
        {codigo}
      </span>

      {/* Estado */}
      <span
        className={`
          text-xs font-semibold px-4 py-1 rounded-full mt-1
          ${estado === 'entregado' || estado === 'validado'
            ? 'bg-success-container text-success'
            : 'bg-accent-bg text-accent'
          }
        `}
      >
        {estado === 'entregado' || estado === 'validado' ? '✅ Entregado' : '⏳ Pendiente'}
      </span>
    </div>
  );
}
