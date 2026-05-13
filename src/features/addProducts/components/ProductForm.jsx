import { useState } from 'react';
import { Package, Scale, Box, PlusCircle, AlertCircle } from 'lucide-react';
import BarcodeSearch from './BarcodeSearch';

const initialState = {
  codigoBarras: '',
  nombre: '',
  pesoUnidad: '',
  cantidad: '',
};

/**
 * Formulario para agregar un producto a la donación.
 * Incluye búsqueda por código de barras vía Open Food Facts.
 *
 * @param {{ onAgregar: (producto: import('../../../services/donationService').Producto) => void }} props
 */
export default function ProductForm({ onAgregar }) {
  const [form, setForm] = useState({ ...initialState });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSeleccionarProducto = (producto) => {
    setForm((prev) => ({
      ...prev,
      codigoBarras: producto.codigoBarras,
      nombre: producto.nombre,
      pesoUnidad: producto.pesoUnidad ? String(producto.pesoUnidad) : '',
    }));
    setError('');
  };

  const handleSubmit = () => {
    const { codigoBarras, nombre, pesoUnidad, cantidad } = form;

    if (!codigoBarras.trim() || !nombre.trim() || !pesoUnidad || !cantidad) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const peso = parseFloat(pesoUnidad);
    const cant = parseInt(cantidad, 10);

    if (isNaN(peso) || peso <= 0) {
      setError('El peso debe ser un número mayor a 0');
      return;
    }

    if (isNaN(cant) || cant <= 0) {
      setError('La cantidad debe ser un número mayor a 0');
      return;
    }

    onAgregar({
      codigoBarras: codigoBarras.trim(),
      nombre: nombre.trim(),
      pesoUnidad: peso,
      cantidad: cant,
    });

    setForm({ ...initialState });
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/40 space-y-8">
      {/* Sección: Código de barras */}
      <section>
        <BarcodeSearch onSeleccionar={handleSeleccionarProducto} />
      </section>

      {/* Sección: Nombre del producto */}
      <section className="space-y-2">
        <label className="font-label-sm text-label-sm text-outline uppercase tracking-[0.05em] block">
          2. Nombre del producto
        </label>
        <div className="relative">
          <Package size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Arroz blanco"
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all placeholder:text-outline/60"
          />
        </div>
      </section>

      {/* Sección: Peso y Cantidad */}
      <section className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="font-label-sm text-label-sm text-outline uppercase tracking-[0.05em] block">
            <span className="tracking-[0.7px]">3. Peso por unidad (kg)</span>
          </label>
          <div className="relative">
            <Scale size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
            <input
              type="number"
              name="pesoUnidad"
              value={form.pesoUnidad}
              onChange={handleChange}
              placeholder="Ej. 1.5"
              step="0.01"
              min="0"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all placeholder:text-outline/60"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-label-sm text-label-sm text-outline uppercase tracking-[0.05em] block">
            4. Cantidad
          </label>
          <div className="relative">
            <Box size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
            <input
              type="number"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              placeholder="Ej. 10"
              min="1"
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all placeholder:text-outline/60"
            />
          </div>
        </div>
      </section>

      {/* Mensaje de error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-error-container rounded-xl">
          <AlertCircle size={18} className="text-error shrink-0" />
          <p className="text-on-error-container text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Botón: Agregar producto */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full h-14 bg-primary hover:bg-primary-container text-white font-bold text-body-md rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <PlusCircle size={20} />
        Agregar producto
      </button>
    </div>
  );
}
