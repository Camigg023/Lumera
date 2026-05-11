/**
 * Componente que renderiza un producto individual dentro de la lista.
 *
 * @param {{
 *   producto: import('../../../services/donationService').Producto,
 *   index: number,
 *   onEliminar: (index: number) => void
 * }} props
 */
export default function ProductListItem({ producto, index, onEliminar }) {
  const totalKg = (producto.pesoUnidad * producto.cantidad).toFixed(2);

  return (
    <div className="group flex items-center justify-between bg-surface-container-lowest border border-outline-variant/40 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:border-outline-variant transition-all duration-200">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Índice */}
        <div className="w-9 h-9 rounded-xl bg-primary-container/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary">{index + 1}</span>
        </div>

        {/* Info del producto */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-on-surface truncate text-sm">
            {producto.nombre}
          </h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">qr_code_scanner</span>
              {producto.codigoBarras}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">weight</span>
              {producto.pesoUnidad} kg/u
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">package</span>
              x{producto.cantidad}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="text-right flex-shrink-0 hidden sm:block">
          <p className="text-xs text-outline">Total</p>
          <p className="font-bold text-primary">{totalKg} kg</p>
        </div>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={() => onEliminar(index)}
        className="ml-3 w-9 h-9 rounded-xl bg-error-container/0 hover:bg-error-container text-outline hover:text-error flex items-center justify-center transition-all cursor-pointer flex-shrink-0 opacity-0 group-hover:opacity-100"
        title="Eliminar producto"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
}
