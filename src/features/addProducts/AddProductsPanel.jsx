import { useState } from 'react';
import { AlertCircle, CheckCircle, Share2, ClipboardCheck, List, Package, Trash2, PlusCircle } from 'lucide-react';
import ProductForm from './components/ProductForm';
import ProductListItem from './components/ProductListItem';
import { guardarDonacion } from '../../services/donationService';
import { auth } from '../../config/firebase';
import CodeDisplay from '../codeValidation/components/CodeDisplay';

/**
 * Panel principal para agregar productos a una donación.
 * Permite agregar productos uno por uno, ver la lista, eliminar productos
 * y enviar todo a Firebase.
 */
export default function AddProductsPanel({ onSuccess }) {
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
      const userId = auth.currentUser?.uid;
      const { id, codigoUnico } = await guardarDonacion(productos, userId);
      const donationSummary = { 
        totalProductos: productos.reduce((acc, p) => acc + p.cantidad, 0),
        items: [...productos]
      };

      // Navigate to the success/traceability screen immediately
      if (onSuccess) {
        onSuccess(codigoUnico, donationSummary);
      }
      
      // Reset local state (though the component will likely unmount)
      setProductos([]);
      setMensaje({ tipo: 'exito', texto: `Donación registrada exitosamente.`, codigo: codigoUnico });
    } catch (err) {
      console.error('[AddProductsPanel] Error al guardar:', err);
      setMensaje({ tipo: 'error', texto: err.message || 'Error al guardar la donación. Intenta de nuevo.' });
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
        <h1 className="font-h1 text-h1 mb-2 text-primary">
          Food Validator &amp; Registration
        </h1>
        <p className="text-body-md text-outline">
          Provide accurate details to ensure your donation reaches those in need safely.
        </p>
      </header>

      {/* Formulario para agregar producto */}
      <ProductForm onAgregar={agregarProducto} />

      {/* Mensaje de éxito/error */}
      {mensaje && mensaje.tipo === 'error' && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border bg-error-container text-on-error-container border-error-container">
          <AlertCircle size={20} className="text-error shrink-0" />
          <p className="text-sm font-medium">{mensaje.texto}</p>
        </div>
      )}

      {mensaje && mensaje.tipo === 'exito' && (
        <div className="bg-success-container rounded-2xl p-8 border border-success text-center animate-fade-in flex flex-col items-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-success mb-2">¡Donación registrada!</h2>
          <p className="text-success mb-6 max-w-md opacity-80">
            Lleva tus productos al centro de acopio más cercano y presenta este código.
          </p>
          
          <CodeDisplay codigo={mensaje.codigo} estado="pendiente" tamaño="lg" />
          
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Voy a realizar una donación en Lumera. Mi código único es: ${mensaje.codigo}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-12 px-6 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#128C7E] transition-colors w-full sm:w-auto"
            >
              <Share2 size={18} />
              Compartir por WhatsApp
            </a>
            <button
              onClick={() => setMensaje(null)}
              className="flex items-center justify-center h-12 px-6 bg-surface text-success font-bold rounded-xl border border-success hover:bg-success-container transition-colors w-full sm:w-auto cursor-pointer"
            >
              Nueva Donación
            </button>
          </div>
        </div>
      )}

      {/* Lista de productos agregados */}
      {productos.length > 0 && (
        <div className="space-y-5 animate-slide-up">
          {/* Header de la lista */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <List size={20} className="text-primary-container" />
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
                <Trash2 size={16} />
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
            className="w-full h-14 bg-primary hover:bg-primary-container text-white font-bold text-body-md rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
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
                <ClipboardCheck size={20} />
                Complete Registration
              </>
            )}
          </button>
        </div>
      )}

      {/* Estado vacío */}
      {productos.length === 0 && !mensaje && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-surface-container-low flex items-center justify-center mb-5">
            <Package size={36} className="text-outline/50" />
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
