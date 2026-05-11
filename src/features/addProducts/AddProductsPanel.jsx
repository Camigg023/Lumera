import { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductListItem from './components/ProductListItem';
import { guardarDonacion } from '../../services/donationService';

/**
 * Panel principal para agregar productos a una donación.
 * Permite agregar productos uno por uno, ver la lista, eliminar productos
 * y enviar todo a Firebase.
 */
export default function AddProductsPanel() {
  const [productos, setProductos] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'exito' | 'error', texto: string }

  const agregarProducto = (producto) => {
    setProductos((prev) => [...prev, producto]);
    setMensaje(null);
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
      const id = await guardarDonacion(productos);
      setMensaje({ tipo: 'exito', texto: `Donación registrada exitosamente (ID: ${id.slice(0, 8)}...)` });
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
      <ProductForm onAgregar={agregarProducto} />

      {/* Mensaje de éxito/error */}
      {mensaje && (
        <div
          className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${
            mensaje.tipo === 'exito'
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-error-container text-on-error-container border-error-container'
          }`}
        >
          <span className={`material-symbols-outlined text-lg ${mensaje.tipo === 'exito' ? 'text-green-600' : 'text-error'}`}>
            {mensaje.tipo === 'exito' ? 'check_circle' : 'error'}
          </span>
          <p className="text-sm font-medium">{mensaje.texto}</p>
        </div>
      )}

      {/* Lista de productos agregados */}
      {productos.length > 0 && (
        <div className="space-y-5 animate-slide-up">
          {/* Header de la lista */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">list_alt</span>
              <h3 className="font-h3 text-h3 text-on-surface">
                Productos agregados
              </h3>
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

          {/* Items de la lista */}
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

          {/* Resumen móvil */}
          <div className="sm:hidden flex items-center justify-between px-4 py-3 bg-surface-container-low rounded-2xl">
            <p className="text-sm text-on-surface-variant">
              <span className="font-semibold text-on-surface">{productos.length}</span> productos
            </p>
            <p className="text-sm font-semibold text-primary">
              {totalUnidades} und · {totalPeso.toFixed(2)} kg
            </p>
          </div>

          {/* Botón guardar en Firebase */}
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
