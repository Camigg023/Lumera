import { useState, useRef } from 'react';
import { buscarPorCodigoBarras } from '../../../services/openFoodFactsService';

/**
 * Componente de búsqueda de productos por código de barras usando Open Food Facts.
 * Muestra una tarjeta con los datos del producto encontrado y permite
 * seleccionarlo para auto-completar el formulario.
 *
 * @param {{
 *   onSeleccionar: (producto: { nombre: string, codigoBarras: string, pesoUnidad: number|null }) => void
 * }} props
 */
export default function BarcodeSearch({ onSeleccionar }) {
  const [barcode, setBarcode] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultado, setResultado] = useState(null); // { encontrado, producto, error }
  const [mostrarCard, setMostrarCard] = useState(false);
  const inputRef = useRef(null);

  /**
   * Ejecuta la búsqueda del código de barras en Open Food Facts.
   */
  const handleBuscar = async () => {
    const codigo = barcode.trim();
    if (!codigo) return;

    setBuscando(true);
    setResultado(null);
    setMostrarCard(false);

    const res = await buscarPorCodigoBarras(codigo);

    setResultado(res);
    setMostrarCard(true);
    setBuscando(false);
  };

  /**
   * Maneja el evento de tecla Enter en el input.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBuscar();
    }
  };

  /**
   * Maneja la selección del producto sugerido.
   * Llama al callback del padre con los datos mapeados.
   */
  const handleSeleccionar = () => {
    if (!resultado?.encontrado || !resultado.producto) return;

    onSeleccionar({
      nombre: resultado.producto.nombre,
      codigoBarras: resultado.producto.codigoBarras,
      pesoUnidad: resultado.producto.pesoUnidad,
    });

    // Limpiar estado local
    setBarcode('');
    setResultado(null);
    setMostrarCard(false);
    inputRef.current?.focus();
  };

  /**
   * Cierra la tarjeta de resultado y limpia la búsqueda.
   */
  const cerrar = () => {
    setMostrarCard(false);
    setResultado(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-600 text-left">
        Código de barras
      </label>

      {/* Input + Botón buscar */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={barcode}
          onChange={(e) => {
            setBarcode(e.target.value);
            if (mostrarCard) cerrar();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Escanea o escribe el código..."
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F28C33] focus:border-transparent transition"
        />
        <button
          type="button"
          onClick={handleBuscar}
          disabled={buscando || !barcode.trim()}
          className="px-4 py-2.5 bg-[#F28C33] hover:bg-[#D97706] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
        >
          {buscando ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Buscando...
            </>
          ) : (
            <>
              <span>🔍</span> Buscar
            </>
          )}
        </button>
      </div>

      {/* Tarjeta de resultado de la búsqueda */}
      {mostrarCard && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg animate-fade-in">
          {resultado?.encontrado && resultado.producto ? (
            <div className="space-y-3">
              {/* Header del producto encontrado */}
              <div className="flex items-start gap-3">
                {/* Imagen del producto */}
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                  {resultado.producto.imagen ? (
                    <img
                      src={resultado.producto.imagen}
                      alt={resultado.producto.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full items-center justify-center text-2xl text-gray-300 ${resultado.producto.imagen ? 'hidden' : 'flex'}`}
                  >
                    📦
                  </div>
                </div>

                {/* Información del producto */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#2D2D2D] text-sm leading-tight truncate">
                    {resultado.producto.nombre}
                  </h4>
                  {resultado.producto.marca && (
                    <p className="text-xs text-gray-400 mt-0.5">{resultado.producto.marca}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      🔲 {resultado.producto.codigoBarras}
                    </span>
                    {resultado.producto.cantidadTexto && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        ⚖️ {resultado.producto.cantidadTexto}
                      </span>
                    )}
                    {resultado.producto.pesoUnidad && (
                      <span className="text-xs bg-[#F28C33]/10 text-[#F28C33] px-2 py-0.5 rounded-full font-medium">
                        {resultado.producto.pesoUnidad} kg/unidad
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSeleccionar}
                  className="flex-1 py-2 bg-[#4CAF50] hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  ✅ Usar este producto
                </button>
                <button
                  type="button"
                  onClick={cerrar}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-lg transition cursor-pointer"
                >
                  Ignorar
                </button>
              </div>
            </div>
          ) : resultado?.error ? (
            /* Error de conexión */
            <div className="text-center py-2">
              <p className="text-[#E53935] text-sm font-medium">⚠️ {resultado.error}</p>
              <button
                type="button"
                onClick={cerrar}
                className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          ) : (
            /* Producto no encontrado */
            <div className="text-center py-2">
              <p className="text-gray-500 text-sm">
                ❌ Producto no encontrado en Open Food Facts
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Puedes ingresar los datos manualmente en el formulario
              </p>
              <button
                type="button"
                onClick={cerrar}
                className="mt-2 text-xs text-[#F28C33] hover:text-[#D97706] underline cursor-pointer"
              >
                Entendido
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sugerencia cuando no hay nada */}
      {!mostrarCard && !barcode && (
        <p className="text-xs text-gray-400 text-left">
          💡 Ingresa un código de barras y presiona "Buscar" o Enter para consultar Open Food Facts
        </p>
      )}
    </div>
  );
}
