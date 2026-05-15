import { useState } from 'react';
import { BeneficiaryType, BENEFICIARY_TYPE_LABELS } from '../../domain/entities/Beneficiary';
import { DocumentUploader } from './DocumentUploader';
import { LocationPicker } from './LocationPicker';
import {
  validName,
  validDocumentId,
  validPhone,
  validAddress,
  required,
} from '../../../../utils/validators';

/**
 * Props para el formulario de registro de beneficiario (persona natural).
 */
interface BeneficiaryRegisterFormProps {
  /** Función para guardar el perfil completo */
  onSave: (data: {
    fullName: string;
    documentId: string;
    address: string;
    city: string;
    phone: string;
    beneficiaryType: BeneficiaryType;
    latitude?: number;
    longitude?: number;
  }) => Promise<void>;
  /** Función para subir un documento */
  onUploadDocument: (file: File, docType: string) => Promise<void>;
  /** Indica si está guardando */
  isSaving?: boolean;
  /** Indica si está subiendo un documento */
  isUploading?: boolean;
  /** Si el perfil ya existe (es edición, no registro nuevo) */
  isEditMode?: boolean;
  /** Datos iniciales para modo edición */
  initialData?: {
    fullName: string;
    documentId: string;
    address: string;
    city: string;
    phone: string;
    beneficiaryType: BeneficiaryType;
    latitude?: number;
    longitude?: number;
  };
  /** Documentos ya subidos para mostrar estado */
  existingDocuments?: any[];
}

/**
 * Formulario de registro de beneficiario como persona natural.
 *
 * Layout en grid de 2 columnas:
 *   Izquierda → Datos personales (nombre, cédula, dirección, etc.)
 *   Derecha   → Arriba: Geolocalización / Abajo: Subida de documentos
 */
export function BeneficiaryRegisterForm({
  onSave,
  onUploadDocument,
  isSaving = false,
  isUploading = false,
  isEditMode = false,
  initialData,
  existingDocuments = [],
}: BeneficiaryRegisterFormProps) {
  // Estado del formulario principal
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    documentId: initialData?.documentId || '',
    address: initialData?.address || '',
    city: initialData?.city || '',
    phone: initialData?.phone || '',
    beneficiaryType: (initialData?.beneficiaryType || 'persona_natural') as BeneficiaryType,
  });

  // Estado de geolocalización
  const [location, setLocation] = useState<{ lat?: number; lng?: number }>({
    lat: initialData?.latitude,
    lng: initialData?.longitude,
  });

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({
    fullName: null,
    documentId: null,
    address: null,
    city: null,
    phone: null,
  });

  // Lista de ciudades comunes de Colombia
  const CITIES = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
    'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué',
    'Manizales', 'Pasto', 'Neiva', 'Villavicencio', 'Armenia',
    'Montería', 'Sincelejo', 'Valledupar', 'Popayán', 'Quibdó',
  ];

  /**
   * Actualiza un campo del formulario.
   */
  /** Validación en tiempo real por campo */
  const validateField = (field: string, value: string): string | null => {
    const validators: Record<string, (v: string) => string | null> = {
      fullName: (v) => validName(v, 'El nombre completo'),
      documentId: (v) => validDocumentId(v, 'La cédula'),
      address: (v) => validAddress(v),
      city: (v) => required(v, 'La ciudad'),
      phone: (v) => validPhone(v),
    };
    return validators[field]?.(value) ?? null;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);

    // Validar en tiempo real cuando el campo tiene valor
    if (value.trim()) {
      const error = validateField(field, value);
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  /**
   * Maneja el cambio de ubicación desde el LocationPicker.
   */
  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  /**
   * Valida los campos obligatorios antes de guardar.
   */
  const validateForm = (): boolean => {
    // Validar todos los campos
    const newErrors: Record<string, string | null> = {
      fullName: validateField('fullName', formData.fullName),
      documentId: validateField('documentId', formData.documentId),
      address: validateField('address', formData.address),
      city: validateField('city', formData.city),
      phone: validateField('phone', formData.phone),
    };

    setFieldErrors(newErrors);

    const firstError = Object.values(newErrors).find((v) => v !== null);
    if (firstError) {
      setFormError(firstError);
      return false;
    }
    return true;
  };

  /**
   * Guarda el formulario completo.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSave({
        ...formData,
        latitude: location.lat,
        longitude: location.lng,
      });
      setSuccessMsg(
        isEditMode
          ? 'Perfil actualizado correctamente.'
          : 'Registro completado correctamente.'
      );
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      setFormError('Error al guardar. Intente de nuevo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in">
      {/* Título */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {isEditMode ? 'Editar mi Perfil' : 'Completa tu registro como Beneficiario'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Diligencia tus datos personales, ubica tu residencia y sube los documentos
          para validar tu identidad. Una vez verificado podrás reclamar mercados.
        </p>
      </div>

      {/* Mensajes de éxito/error */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg flex items-center gap-2">
          <span>✅</span> {successMsg}
        </div>
      )}
      {formError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg flex items-center gap-2">
          <span>❌</span> {formError}
        </div>
      )}

      {/* ─── GRID: IZQUIERDA (DATOS) + DERECHA (UBICACIÓN + DOCS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ═══════ COLUMNA IZQUIERDA: DATOS PERSONALES ═══════ */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 h-fit">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
            <span>👤</span> Datos personales
          </h3>

          {/* Nombre completo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Ej: María Andrea López Gómez"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition ${
                fieldErrors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {fieldErrors.fullName && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.fullName}
              </p>
            )}
          </div>

          {/* Número de cédula */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de cédula <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.documentId}
              onChange={(e) => handleChange('documentId', e.target.value)}
              placeholder="Ej: 1.234.567.890"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition ${
                fieldErrors.documentId ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {fieldErrors.documentId ? (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.documentId}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                Ingrese su número de documento sin espacios.
              </p>
            )}
          </div>

          {/* Tipo de beneficiario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ¿A qué grupo pertenece? <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.beneficiaryType}
              onChange={(e) => handleChange('beneficiaryType', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition bg-white"
              required
            >
              {Object.entries(BENEFICIARY_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Dirección de residencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de residencia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Ej: Carrera 50 # 25-30, Centro"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition ${
                fieldErrors.address ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {fieldErrors.address && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.address}
              </p>
            )}
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition bg-white ${
                fieldErrors.city ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Seleccione una ciudad</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
              <option value="otra">Otra (especifique abajo)</option>
            </select>
            {fieldErrors.city && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.city}
              </p>
            )}
            {formData.city === 'otra' && (
              <input
                type="text"
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Escriba el nombre de la ciudad"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition mt-2"
                required
              />
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de contacto <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Ej: 300 123 4567"
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition ${
                fieldErrors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {fieldErrors.phone && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <span>⚠️</span> {fieldErrors.phone}
              </p>
            )}
          </div>
        </div>

        {/* ═══════ COLUMNA DERECHA: UBICACIÓN + DOCUMENTOS ═══════ */}
        <div className="space-y-6">
          {/* ─── UBICACIÓN ─── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
              <span>📍</span> Ubicación de residencia
            </h3>
            <LocationPicker
              latitude={location.lat}
              longitude={location.lng}
              onLocationChange={handleLocationChange}
            />
          </div>

          {/* ─── DOCUMENTOS DE VALIDACIÓN ─── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
              <span>📄</span> Documentos de validación
            </h3>
            <p className="text-xs text-gray-500">
              Sube los siguientes documentos para validar tu identidad y domicilio.
              Formatos: JPG, PNG, PDF. Máx. 10 MB c/u.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <DocumentUploader
                docType="cedula_frontal"
                label="Cédula (Parte Frontal)"
                description="Foto legible de la parte frontal de tu cédula"
                existingDoc={existingDocuments.find(d => d.type === 'cedula_frontal')}
                onUpload={(file) => onUploadDocument(file, 'cedula_frontal')}
                isUploading={isUploading}
              />
              <DocumentUploader
                docType="cedula_posterior"
                label="Cédula (Parte Posterior)"
                description="Foto legible de la parte posterior de tu cédula"
                existingDoc={existingDocuments.find(d => d.type === 'cedula_posterior')}
                onUpload={(file) => onUploadDocument(file, 'cedula_posterior')}
                isUploading={isUploading}
              />
              <DocumentUploader
                docType="cuenta_servicios"
                label="Cuenta de Servicios"
                description="Recibo de luz, agua o gas (últimos 3 meses)"
                existingDoc={existingDocuments.find(d => d.type === 'cuenta_servicios')}
                onUpload={(file) => onUploadDocument(file, 'cuenta_servicios')}
                isUploading={isUploading}
              />
              <DocumentUploader
                docType="foto_perfil"
                label="Foto de Perfil"
                description="Selfie o foto tipo documento"
                existingDoc={existingDocuments.find(d => d.type === 'foto_perfil')}
                onUpload={(file) => onUploadDocument(file, 'foto_perfil')}
                isUploading={isUploading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botón de guardar (ocupa todo el ancho) */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSaving}
          className={`
            w-full py-3 px-6 rounded-xl text-base font-bold transition-all
            ${isSaving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] shadow-lg shadow-primary/20 cursor-pointer'
            }
          `}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Guardando...
            </span>
          ) : isEditMode ? (
            'Actualizar Perfil'
          ) : (
            'Guardar mis datos'
          )}
        </button>
      </div>
    </form>
  );
}
