/**
 * Componente que muestra el código único de una donación
 * con estilo visual destacado para presentar en el punto de acopio.
 *
 * @param {{ codigo: string, estado?: string, tamaño?: 'sm' | 'lg' }} props
 */
export default function CodeDisplay({ codigo, estado = 'pendiente', tamaño = 'lg' }) {
  const isLg = tamaño === 'lg';

  return (
    <div
      className={`
        inline-flex flex-col items-center gap-2 p-4 rounded-2xl border-2
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

      {/* Código */}
      <span
        className={`
          font-mono font-bold tracking-widest text-indigo-700
          ${isLg ? 'text-3xl' : 'text-xl'}
        `}
      >
        {codigo}
      </span>

      {/* Estado */}
      <span
        className={`
          text-xs font-semibold px-3 py-0.5 rounded-full
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
