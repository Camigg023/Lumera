import { useState, useRef } from 'react';
import { Scan, Search, Package, CheckCircle, AlertCircle, SearchX, X } from 'lucide-react';
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
  const [resultado, setResultado] = useState(null);
  const [mostrarCard, setMostrarCard] = useState(false);
  const inputRef = useRef(null);

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleBuscar();
    }
  };

  const handleSeleccionar = () => {
    if (!resultado?.encontrado || !resultado.producto) return;
    onSeleccionar({
      nombre: resultado.producto.nombre,
      codigoBarras: resultado.producto.codigoBarras,
      pesoUnidad: resultado.producto.pesoUnidad,
    });
    setBarcode('');
    setResultado(null);
    setMostrarCard(false);
    inputRef.current?.focus();
  };

  const cerrar = () => {
    setMostrarCard(false);
    setResultado(null);
  };

  return (
    <div className="space-y-2">
      <label className="font-label-sm text-label-sm text-outline uppercase tracking-[0.05em] block mb-1">
        1. Código de barras
      </label>

      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
        <div className="relative flex-1">
          <Scan size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={barcode}
            onChange={(e) => {
              setBarcode(e.target.value);
              if (mostrarCard) cerrar();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ej. 7501234567890"
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all placeholder:text-outline/60"
          />
        </div>
        <button
          type="button"
          onClick={handleBuscar}
          disabled={buscando || !barcode.trim()}
          className="h-12 px-5 bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 shadow-md"
        >
          {buscando ? (
            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <>
              <Search size={18} />
              Buscar
            </>
          )}
        </button>
      </form>

      {/* Tarjeta de resultado */}
      {mostrarCard && (
        <div className="bg-surface border border-outline-variant rounded-2xl p-5 shadow-lg animate-fade-in">
          {resultado?.encontrado && resultado.producto ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex-shrink-0 overflow-hidden border border-outline-variant">
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
                  <div className={`w-full h-full items-center justify-center text-2xl text-outline/40 ${resultado.producto.imagen ? 'hidden' : 'flex'}`}>
                    <Package size={28} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-on-surface text-sm leading-tight truncate">
                    {resultado.producto.nombre}
                  </h4>
                  {resultado.producto.marca && (
                    <p className="text-xs text-outline mt-0.5">{resultado.producto.marca}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-surface-container-low text-on-surface-variant px-2.5 py-0.5 rounded-full">
                      🔲 {resultado.producto.codigoBarras}
                    </span>
                    {resultado.producto.cantidadTexto && (
                      <span className="text-xs bg-surface-container-low text-on-surface-variant px-2.5 py-0.5 rounded-full">
                        ⚖️ {resultado.producto.cantidadTexto}
                      </span>
                    )}
                    {resultado.producto.pesoUnidad && (
                      <span className="text-xs bg-primary-container/10 text-primary px-2.5 py-0.5 rounded-full font-medium">
                        {resultado.producto.pesoUnidad} kg/unidad
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSeleccionar}
                  className="flex-1 h-10 bg-primary hover:bg-primary-container text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  Usar este producto
                </button>
                <button
                  type="button"
                  onClick={cerrar}
                  className="px-5 h-10 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant text-sm font-medium rounded-xl transition cursor-pointer"
                >
                  Ignorar
                </button>
              </div>
            </div>
          ) : resultado?.error ? (
            <div className="text-center py-3">
              <AlertCircle size={28} className="text-error mx-auto mb-2" />
              <p className="text-error text-sm font-medium">{resultado.error}</p>
              {resultado.statusVerbose && (
                <p className="text-xs text-outline mt-1">Detalle: {resultado.statusVerbose}</p>
              )}
              <button type="button" onClick={cerrar} className="mt-3 text-xs text-primary hover:text-primary-container underline cursor-pointer">
                Cerrar
              </button>
            </div>
          ) : (
            <div className="text-center py-3">
              <SearchX size={28} className="text-outline mx-auto mb-2" />
              <p className="text-on-surface-variant text-sm font-medium">Producto no encontrado en Open Food Facts</p>
              {resultado?.statusVerbose && (
                <p className="text-xs text-outline mt-1">API dice: &ldquo;{resultado.statusVerbose}&rdquo;</p>
              )}
              <p className="text-xs text-outline mt-1">Puedes ingresar los datos manualmente</p>
              <button type="button" onClick={cerrar} className="mt-3 text-xs text-primary hover:text-primary-container underline cursor-pointer">
                Entendido
              </button>
            </div>
          )}
        </div>
      )}

      {!mostrarCard && !barcode && (
        <p className="text-xs text-on-surface-variant/60">
          💡 Ingresa un código de barras y presiona &ldquo;Buscar&rdquo; o Enter para consultar Open Food Facts
        </p>
      )}
    </div>
  );
}
