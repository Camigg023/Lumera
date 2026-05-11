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
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
          <h4 className="font-semibold text-[#2D2D2D] truncate">{producto.nombre}</h4>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
          <span>🔲 {producto.codigoBarras}</span>
          <span>⚖️ {producto.pesoUnidad} kg</span>
          <span>📦 x{producto.cantidad}</span>
          <span className="font-medium text-[#F28C33]">
            Total: {(producto.pesoUnidad * producto.cantidad).toFixed(2)} kg
          </span>
        </div>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={() => onEliminar(index)}
        className="ml-3 px-3 py-1.5 bg-red-50 text-[#E53935] text-sm font-medium rounded-lg hover:bg-red-100 transition cursor-pointer flex-shrink-0"
        title="Eliminar producto"
      >
        ✕
      </button>
    </div>
  );
}
