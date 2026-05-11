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

  /**
   * Agrega un producto a la lista local.
   * @param {import('../../services/donationService').Producto} producto
   */
  const agregarProducto = (producto) => {
    setProductos((prev) => [...prev, producto]);
    setMensaje(null);
  };

  /**
   * Elimina un producto de la lista por su índice.
   * @param {number} index
   */
  const eliminarProducto = (index) => {
    setProductos((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Guarda todos los productos en Firebase como una donación.
   * Muestra mensaje de éxito o error según el resultado.
   */
  const guardarProductos = async () => {
    if (productos.length === 0) {
      setMensaje({ tipo: 'error', texto: 'Agrega al menos un producto antes de guardar' });
      return;
    }

    setGuardando(true);
    setMensaje(null);

    try {
      const id = await guardarDonacion(productos);
      setMensaje({ tipo: 'exito', texto: `✅ Donación guardada con éxito (ID: ${id.slice(0, 8)}...)` });
      setProductos([]);
    } catch (err) {
      console.error('Error al guardar donación:', err);
      setMensaje({ tipo: 'error', texto: '❌ Error al guardar la donación. Intenta de nuevo.' });
    } finally {
      setGuardando(false);
    }
  };

  /** Cantidad total de productos (sumando cantidades) */
  const totalUnidades = productos.reduce((acc, p) => acc + p.cantidad, 0);
  const totalPeso = productos.reduce((acc, p) => acc + p.pesoUnidad * p.cantidad, 0);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2D2D2D]">Registrar donación</h2>
          <p className="text-gray-500 text-sm mt-1">
            Agrega los productos que deseas donar
          </p>
        </div>
        {productos.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-[#2D2D2D]">{productos.length}</span> productos distintos
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-[#F28C33]">{totalUnidades}</span> unidades ·{' '}
              <span className="font-semibold text-[#F28C33]">{totalPeso.toFixed(2)} kg</span>
            </p>
          </div>
        )}
      </div>

      {/* Formulario para agregar producto */}
      <ProductForm onAgregar={agregarProducto} />

      {/* Mensaje de éxito/error */}
      {mensaje && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium ${
            mensaje.tipo === 'exito'
              ? 'bg-green-50 text-[#4CAF50] border border-green-200'
              : 'bg-red-50 text-[#E53935] border border-red-200'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Lista de productos agregados */}
      {productos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#2D2D2D]">
              📋 Productos agregados ({productos.length})
            </h3>
            <button
              onClick={() => setProductos([])}
              className="text-sm text-gray-400 hover:text-[#E53935] transition cursor-pointer"
            >
              Limpiar todo
            </button>
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

          {/* Botón guardar en Firebase */}
          <button
            onClick={guardarProductos}
            disabled={guardando}
            className="w-full py-3.5 bg-[#4CAF50] hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-[0.98] cursor-pointer"
          >
            {guardando ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </span>
            ) : (
              '💾 Guardar donación en Firebase'
            )}
          </button>
        </div>
      )}

      {/* Estado vacío */}
      {productos.length === 0 && !mensaje && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-medium">No hay productos agregados aún</p>
          <p className="text-sm mt-1">Usa el formulario de arriba para agregar productos</p>
        </div>
      )}
    </div>
  );
}
