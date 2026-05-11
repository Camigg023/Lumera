import { useState } from 'react';

/**
 * Campos iniciales vacíos para el formulario de producto.
 */
const initialState = {
  codigoBarras: '',
  nombre: '',
  pesoUnidad: '',
  cantidad: '',
};

/**
 * Formulario para agregar un producto a la donación.
 * 
 * @param {{ onAgregar: (producto: import('../../../services/donationService').Producto) => void }} props
 */
export default function ProductForm({ onAgregar }) {
  const [form, setForm] = useState({ ...initialState });
  const [error, setError] = useState('');

  /**
   * Maneja el cambio en cualquier campo del formulario.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  /**
   * Valida y agrega un producto a la lista.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const { codigoBarras, nombre, pesoUnidad, cantidad } = form;

    // Validaciones
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

    // Agregar producto
    onAgregar({
      codigoBarras: codigoBarras.trim(),
      nombre: nombre.trim(),
      pesoUnidad: peso,
      cantidad: cant,
    });

    // Resetear formulario
    setForm({ ...initialState });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 space-y-4 border border-gray-100">
      <h3 className="text-lg font-semibold text-[#2D2D2D] flex items-center gap-2">
        📦 Nuevo producto
      </h3>

      {/* Código de barras */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
          Código de barras
        </label>
        <input
          type="text"
          name="codigoBarras"
          value={form.codigoBarras}
          onChange={handleChange}
          placeholder="Ej. 7501234567890"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F28C33] focus:border-transparent transition"
        />
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
          Nombre del producto
        </label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej. Arroz blanco"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F28C33] focus:border-transparent transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Peso por unidad */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
            Peso por unidad (kg)
          </label>
          <input
            type="number"
            name="pesoUnidad"
            value={form.pesoUnidad}
            onChange={handleChange}
            placeholder="Ej. 1.5"
            step="0.01"
            min="0"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F28C33] focus:border-transparent transition"
          />
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
            Cantidad
          </label>
          <input
            type="number"
            name="cantidad"
            value={form.cantidad}
            onChange={handleChange}
            placeholder="Ej. 10"
            min="1"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F28C33] focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <p className="text-[#E53935] text-sm font-medium flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}

      {/* Botón agregar */}
      <button
        type="submit"
        className="w-full py-3 bg-[#FF8000] hover:bg-[#E67300] text-white font-semibold rounded-xl shadow-md shadow-orange-200 transition-all active:scale-[0.98] cursor-pointer"
      >
        ➕ Agregar producto
      </button>
    </form>
  );
}
