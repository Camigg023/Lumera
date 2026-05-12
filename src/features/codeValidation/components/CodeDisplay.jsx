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
        inline-flex flex-col items-center gap-3 p-5 rounded-3xl border-2
        ${estado === 'entregado' || estado === 'validado'
          ? 'bg-green-50 border-green-300'
          : 'bg-indigo-50 border-indigo-200'
        }
      `}
    >
      {/* Label */}
      <span className={`font-medium ${isLg ? 'text-sm' : 'text-xs'} text-gray-500 uppercase tracking-wider`}>
        Código de donación
      </span>

      {/* QR Code (Solo para tamaño grande) */}
      {isLg && (
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-indigo-100">
          <QRCode 
            value={codigo} 
            size={160}
            fgColor={estado === 'entregado' || estado === 'validado' ? "#166534" : "#4338ca"}
            level="H"
          />
        </div>
      )}

      {/* Código en texto */}
      <span
        className={`
          font-mono font-bold tracking-widest text-indigo-700
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
            ? 'bg-green-200 text-green-800'
            : 'bg-amber-200 text-amber-800'
          }
        `}
      >
        {estado === 'entregado' || estado === 'validado' ? '✅ Entregado' : '⏳ Pendiente'}
      </span>
    </div>
  );
}
