import { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductListItem from './components/ProductListItem';
import { guardarDonacion } from '../../services/donationService';

/**
 * Panel principal para agregar productos a una donación.
 *
 * @param {{ onDonacionGuardada?: () => void }} props
 *   - onDonacionGuardada: Callback opcional para navegar después de guardar
 */
export default function AddProductsPanel({ onDonacionGuardada }) {
  const [productos, setProductos] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [ultimaDonacion, setUltimaDonacion] = useState(null);

  const agregarProducto = (producto) => {
    setProductos((prev) => [...prev, producto]);
    setMensaje(null);
    setUltimaDonacion(null);
  };

  const eliminarProducto = (index) => {
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  const guardarProductos = async () => {
    if (productos.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Agrega al menos un producto antes de guardar la donación' });
      return;
    }

    setGuardando(true);
    setMensaje(null);

    try {
      const resultado = await guardarDonacion(productos);
      setUltimaDonacion(resultado);
      setMensaje({
        tipo: 'exito',
        texto: `Donación registrada exitosamente`,
        codigo: resultado.codigoUnico,
      });
      setProductos([]);
    } catch (err) {
      console.error('[AddProductsPanel] Error al guardar:', err);
      setMensaje({ tipo: 'error', texto: 'Error al guardar la donación. Intenta de nuevo.' });
    } finally {
      setGuardando(false);
    }
  };

  const totalUnidades = productos.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPeso = productos.reduce((acc, p) => acc + p.pesoUnidad * p.cantidad, 0);

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <header>
        <h1 className="font-h1 text-h1 text-on-surface mb-2">
          Food Validator &amp; Registration
        </h1>
        <p className="text-body-md text-outline">
          Provide accurate details to ensure your donation reaches those in need safely.
        </p>
      </header>

      {/* Formulario para agregar producto */}
      {!ultimaDonacion && <ProductForm onAgregar={agregarProducto} />}

      {/* Mensaje de éxito con código */}
      {mensaje?.tipo === 'exito' && (
        <div className="bg-green-50 rounded-3xl p-8 border border-green-200 space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-green-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
          </div>
          <div>
            <h3 className="text-h3 font-h3 text-green-800 mb-2">¡Donación registrada!</h3>
            <p className="text-sm text-green-700">Presenta este código en el centro de acopio:</p>
          </div>

          {/* Código destacado */}
          <div className="inline-block bg-white px-8 py-4 rounded-2xl border-2 border-green-300 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Código único</p>
            <p className="font-mono font-bold text-3xl tracking-[0.25em] text-indigo-700">
              {mensaje.codigo}
            </p>
          </div>

          <p className="text-xs text-green-600">
            Código guardado en tu historial de donaciones
          </p>

          {/* Acciones post-guardado */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setUltimaDonacion(null);
                setMensaje(null);
              }}
              className="flex-1 h-12 bg-white border-2 border-indigo-200 text-primary font-semibold rounded-2xl hover:bg-indigo-50 transition-all cursor-pointer"
            >
              Seguir agregando
            </button>
            {onDonacionGuardada && (
              <button
                onClick={onDonacionGuardada}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-primary-container text-white font-semibold rounded-2xl shadow-md shadow-indigo-200 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">home</span>
                Ir al inicio
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {mensaje?.tipo === 'error' && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border bg-error-container text-on-error-container border-error-container">
          <span className="material-symbols-outlined text-error">error</span>
          <p className="text-sm font-medium">{mensaje.texto}</p>
        </div>
      )}

      {/* Lista de productos (solo si no hay donación recién guardada) */}
      {productos.length > 0 && !ultimaDonacion && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">list_alt</span>
              <h3 className="font-h3 text-h3 text-on-surface">Productos agregados</h3>
              <span className="bg-primary-container/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {productos.length}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-outline">{totalUnidades} unidades</p>
                <p className="text-xs font-semibold text-primary">{totalPeso.toFixed(2)} kg total</p>
              </div>
              <button
                onClick={() => setProductos([])}
                className="text-xs text-outline hover:text-error flex items-center gap-1 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                Limpiar todo
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {productos.map((producto, index) => (
              <ProductListItem
                key={`${producto.codigoBarras}-${index}`}
                producto={producto}
                index={index}
                onEliminar={eliminarProducto}
              />
            ))}
          </div>

          <button
            onClick={guardarProductos}
            disabled={guardando}
            className="w-full h-14 bg-gradient-to-r from-primary-container to-secondary-container text-white font-bold text-body-md rounded-2xl shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {guardando ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">how_to_reg</span>
                Complete Registration
              </>
            )}
          </button>
        </div>
      )}

      {/* Estado vacío */}
      {productos.length === 0 && !mensaje && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-container-low flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-4xl text-outline/50">inventory</span>
          </div>
          <p className="font-h3 text-h3 text-on-surface">No hay productos agregados</p>
          <p className="text-body-md text-outline mt-1">
            Usa el formulario de arriba para agregar los productos que deseas donar
          </p>
        </div>
      )}
    </div>
  );
}
