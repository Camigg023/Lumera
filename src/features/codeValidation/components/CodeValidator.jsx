import { useState } from 'react';
import { validarCodigoDonacion, marcarDonacionEntregada } from '../../../services/donationService';

/**
 * Componente para validar códigos de donación en el punto de acopio.
 * El personal ingresa el código, el sistema lo busca y permite marcarlo como entregado.
 */
export default function CodeValidator() {
  const [codigo, setCodigo] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [donacion, setDonacion] = useState(null);
  const [error, setError] = useState('');
  const [marcando, setMarcando] = useState(false);
  const [exito, setExito] = useState('');

  const handleBuscar = async () => {
    const cod = codigo.trim().toUpperCase();
    if (!cod) {
      setError('Ingresa un código de donación');
      return;
    }

    setBuscando(true);
    setError('');
    setDonacion(null);
    setExito('');

    try {
      const resultado = await validarCodigoDonacion(cod);
      if (!resultado) {
        setError('Código no encontrado. Verifica e intenta de nuevo.');
      } else {
        setDonacion(resultado);
      }
    } catch (err) {
      console.error('[CodeValidator] Error:', err);
      setError('Error al consultar. Verifica tu conexión.');
    } finally {
      setBuscando(false);
    }
  };

  const handleMarcarEntregado = async () => {
    if (!donacion?.id) return;

    setMarcando(true);
    setError('');

    try {
      await marcarDonacionEntregada(donacion.id, 'Punto de acopio');
      setExito(`✅ Donación ${donacion.codigoUnico} marcada como entregada`);
      setDonacion((prev) => ({ ...prev, estado: 'entregado' }));
    } catch (err) {
      console.error('[CodeValidator] Error al marcar:', err);
      setError('Error al actualizar. Intenta de nuevo.');
    } finally {
      setMarcando(false);
    }
  };

  const totalKg = donacion?.productos?.reduce(
    (acc, p) => acc + p.pesoUnidad * p.cantidad, 0
  ).toFixed(2) || '0';

  return (
    <div className="space-y-6">
      {/* Input de búsqueda */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-50 space-y-6">
        <div>
          <h2 className="text-h3 font-h3 text-on-surface mb-2">
            Validar código de donación
          </h2>
          <p className="text-body-md text-outline">
            Ingresa el código que el donador presenta para verificar su donación.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value.toUpperCase());
              setError('');
              setDonacion(null);
              setExito('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleBuscar();
              }
            }}
            placeholder="Ej. LMR-A7X9-K2M1"
            className="flex-1 h-12 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface font-mono tracking-widest text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
          />
          <button
            onClick={handleBuscar}
            disabled={buscando || !codigo.trim()}
            className="h-12 px-6 bg-primary hover:bg-primary-container disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 shadow-md shadow-indigo-200"
          >
            {buscando ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                <span className="material-symbols-outlined">search</span>
                Validar
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-error-container rounded-xl">
            <span className="material-symbols-outlined text-error">error</span>
            <p className="text-on-error-container text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Éxito al marcar */}
        {exito && (
          <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-xl border border-green-200">
            <span className="material-symbols-outlined text-green-600">check_circle</span>
            <p className="text-green-700 text-sm font-medium">{exito}</p>
          </div>
        )}
      </div>

      {/* Resultado de la búsqueda */}
      {donacion && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-indigo-50 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-h3 font-h3 text-on-surface">Donación encontrada</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              donacion.estado === 'entregado' || donacion.estado === 'validado'
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {donacion.estado === 'entregado' || donacion.estado === 'validado' ? '✅ Entregado' : '⏳ Pendiente'}
            </span>
          </div>

          {/* Código destacado */}
          <div className="text-center py-4 bg-indigo-50 rounded-2xl border-2 border-indigo-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Código único</p>
            <p className="font-mono font-bold text-3xl tracking-[0.25em] text-indigo-700">
              {donacion.codigoUnico}
            </p>
          </div>

          {/* Detalles de la donación */}
          <div className="space-y-3">
            <h4 className="font-semibold text-on-surface">Productos</h4>
            <div className="divide-y divide-gray-100">
              {donacion.productos?.map((producto, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-on-surface">{producto.nombre}</p>
                    <p className="text-xs text-outline">Código: {producto.codigoBarras}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-on-surface">x{producto.cantidad}</p>
                    <p className="text-xs text-outline">{producto.pesoUnidad} kg/u</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-2xl">
            <div>
              <p className="text-xs text-outline">Total productos</p>
              <p className="font-bold text-on-surface">{donacion.totalProductos} und</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-outline">Peso total</p>
              <p className="font-bold text-on-surface">{totalKg} kg</p>
            </div>
          </div>

          {/* Botón marcar entregado */}
          {donacion.estado === 'pendiente' && (
            <button
              onClick={handleMarcarEntregado}
              disabled={marcando}
              className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-body-md rounded-2xl shadow-lg shadow-green-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {marcando ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Actualizando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">how_to_reg</span>
                  Marcar como entregado
                </>
              )}
            </button>
          )}

          {donacion.estado !== 'pendiente' && (
            <div className="text-center py-4 bg-green-50 rounded-2xl border border-green-200">
              <p className="text-green-700 font-semibold">
                ✅ Esta donación ya fue entregada
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
