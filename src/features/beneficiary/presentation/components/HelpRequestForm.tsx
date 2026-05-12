import { useState, useMemo } from 'react';
import {
  ProductCategory,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  URGENCY_LABELS,
  URGENCY_COLORS,
  CATEGORY_UNITS,
} from '../../domain/entities/HelpRequest';
import { BeneficiaryType } from '../../domain/entities/Beneficiary';
import { KG_LIMITS_BY_TYPE } from '../../domain/entities/HelpRequest';

/**
 * Props para el formulario de solicitud de ayuda.
 */
interface HelpRequestFormProps {
  /** Nombre de la organización beneficiaria */
  organizationName: string;
  /** Tipo de organización (para calcular límites) */
  beneficiaryType: BeneficiaryType;
  /** Función para enviar la solicitud */
  onSubmit: (data: {
    items: Array<{ category: string; quantity: number }>;
    urgency: string;
    justification: string;
  }) => Promise<void>;
  /** Indica si está enviando */
  isSubmitting?: boolean;
  /** Indica si se puede crear solicitud esta semana */
  canCreateThisWeek: boolean;
}

/**
 * Categorías de producto disponibles para seleccionar.
 */
const CATEGORIES: ProductCategory[] = ['no_perecederos', 'frescos', 'lacteos', 'panaderia'];

/**
 * Niveles de urgencia disponibles.
 */
const URGENCY_LEVELS = ['bajo', 'medio', 'alto', 'critico'] as const;

/**
 * Formulario de solicitud de donación de alimentos.
 * Permite seleccionar categorías, cantidades, nivel de urgencia y justificación.
 * Incluye validaciones de límite de kg según tipo de organización.
 */
export function HelpRequestForm({
  organizationName,
  beneficiaryType,
  onSubmit,
  isSubmitting = false,
  canCreateThisWeek,
}: HelpRequestFormProps) {
  // Estado del formulario
  const [items, setItems] = useState<Array<{ category: ProductCategory; quantity: number }>>(
    CATEGORIES.map((cat) => ({ category: cat, quantity: 0 }))
  );
  const [urgency, setUrgency] = useState<string>('medio');
  const [justification, setJustification] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /**
   * Límite máximo de kg para este tipo de organización.
   */
  const maxKg = KG_LIMITS_BY_TYPE[beneficiaryType] || 300;

  /**
   * Total de kg solicitados (solo categorías con unidad 'kg').
   */
  const totalKg = useMemo(() => {
    return items
      .filter((item) => CATEGORY_UNITS[item.category] === 'kg')
      .reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [items]);

  /**
   * Total de unidades solicitadas.
   */
  const totalUnits = useMemo(() => {
    return items
      .filter((item) => CATEGORY_UNITS[item.category] === 'unidades')
      .reduce((sum, item) => sum + (item.quantity || 0), 0);
  }, [items]);

  /**
   * Porcentaje del límite usado.
   */
  const kgPercent = Math.min(Math.round((totalKg / maxKg) * 100), 100);

  /**
   * Actualiza la cantidad de una categoría.
   */
  const handleQuantityChange = (category: ProductCategory, value: string) => {
    const num = parseInt(value, 10);
    const quantity = isNaN(num) ? 0 : Math.max(0, num);

    setItems((prev) =>
      prev.map((item) => (item.category === category ? { ...item, quantity } : item))
    );
    setFormError(null);
  };

  /**
   * Valida el formulario antes de enviar.
   */
  const validate = (): boolean => {
    const hasItems = items.some((item) => item.quantity > 0);
    if (!hasItems) {
      setFormError('Debe solicitar al menos un producto.');
      return false;
    }

    if (justification.trim().length < 20) {
      setFormError('La justificación debe tener al menos 20 caracteres.');
      return false;
    }

    if (totalKg > maxKg) {
      setFormError(
        `El límite máximo para su tipo de organización es ${maxKg} kg. Ha solicitado ${totalKg} kg.`
      );
      return false;
    }

    return true;
  };

  /**
   * Envía el formulario.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit({
        items: items.filter((item) => item.quantity > 0),
        urgency,
        justification,
      });
      setSuccessMsg('Solicitud creada exitosamente.');
      // Resetear formulario
      setItems(CATEGORIES.map((cat) => ({ category: cat, quantity: 0 })));
      setUrgency('medio');
      setJustification('');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch {
      // Error manejado por el hook padre
    }
  };

  // Si ya tiene una solicitud activa esta semana
  if (!canCreateThisWeek) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center animate-fade-in">
        <div className="text-4xl mb-3">⏳</div>
        <h3 className="text-lg font-semibold text-amber-900 mb-2">
          Ya tiene una solicitud activa esta semana
        </h3>
        <p className="text-sm text-amber-700">
          Solo puede tener una solicitud activa por semana. Espere a que su solicitud actual sea procesada
          o cancélela para crear una nueva.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      {/* Encabezado */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Nueva solicitud de donación</h2>
        <p className="text-sm text-gray-500 mt-1">
          {organizationName} · Límite: <strong>{maxKg} kg</strong> por solicitud
        </p>
      </div>

      {/* Mensajes */}
      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg flex items-center gap-2">
          <span>✅</span> {successMsg}
        </div>
      )}
      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center gap-2">
          <span>❌</span> {formError}
        </div>
      )}

      {/* ─── SECCIÓN: PRODUCTOS ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            🥫 Productos solicitados
          </h3>
          <div className="text-xs text-gray-400">
            Total: <strong>{totalKg} kg</strong> · {totalUnits} unidades
          </div>
        </div>

        {/* Barra de progreso de límite de kg */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Uso del límite ({maxKg} kg)</span>
            <span>{totalKg} kg ({kgPercent}%)</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                kgPercent > 90
                  ? 'bg-red-500'
                  : kgPercent > 70
                  ? 'bg-amber-500'
                  : 'bg-[var(--color-primary)]'
              }`}
              style={{ width: `${Math.min(kgPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => {
            const unit = CATEGORY_UNITS[item.category];
            return (
              <div
                key={item.category}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  item.quantity > 0
                    ? 'border-[var(--color-primary-fixed)] bg-[var(--color-surface-container-low)]'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{CATEGORY_ICONS[item.category]}</span>
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium text-gray-700 block truncate">
                    {CATEGORY_LABELS[item.category]}
                  </label>
                  <span className="text-xs text-gray-400">Unidad: {unit}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="9999"
                    value={item.quantity || ''}
                    onChange={(e) => handleQuantityChange(item.category, e.target.value)}
                    placeholder="0"
                    className="w-20 px-2 py-1.5 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
                  />
                  <span className="text-xs text-gray-400 w-8">{unit === 'kg' ? 'kg' : 'ud'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SECCIÓN: URGENCIA ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          🔴 Nivel de urgencia
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {URGENCY_LEVELS.map((level) => {
            const isSelected = urgency === level;
            const colors = URGENCY_COLORS[level];
            return (
              <button
                key={level}
                type="button"
                onClick={() => setUrgency(level)}
                className={`
                  px-3 py-3 rounded-lg text-sm font-medium transition-all border cursor-pointer text-center
                  ${isSelected
                    ? `${colors.bg} ${colors.text} border-current ring-2 ring-offset-1 ring-current`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  {URGENCY_LABELS[level]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── SECCIÓN: JUSTIFICACIÓN ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          📝 Justificación de la necesidad
        </h3>
        <p className="text-xs text-gray-500">
          Explique por qué su organización necesita estos alimentos. Mínimo 20 caracteres.
        </p>
        <textarea
          value={justification}
          onChange={(e) => {
            setJustification(e.target.value);
            setFormError(null);
          }}
          placeholder="Describa la situación actual, número de personas beneficiadas, frecuencia de las raciones, etc."
          rows={4}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition resize-y"
          required
        />
        <div className="text-xs text-gray-400 text-right">
          {justification.length} / 20 caracteres mínimos
        </div>
      </div>

      {/* ─── BOTÓN DE ENVÍO ─── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full py-3.5 px-6 rounded-xl text-base font-bold transition-all flex items-center justify-center gap-2
          ${isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] shadow-lg shadow-indigo-200 cursor-pointer'
          }
        `}
      >
        {isSubmitting ? (
          <>
            <span className="inline-block w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            Enviando solicitud...
          </>
        ) : (
          <>
            <span>🤝</span>
            Enviar solicitud de donación
          </>
        )}
      </button>
    </form>
  );
}
