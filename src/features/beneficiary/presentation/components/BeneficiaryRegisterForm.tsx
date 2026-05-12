import { useState } from 'react';
import { BeneficiaryType, BENEFICIARY_TYPE_LABELS } from '../../domain/entities/Beneficiary';
import { DocumentUploader } from './DocumentUploader';
import { LocationPicker } from './LocationPicker';

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
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
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
    if (!formData.fullName.trim()) {
      setFormError('El nombre completo es obligatorio.');
      return false;
    }
    if (!formData.documentId.trim()) {
      setFormError('El número de cédula es obligatorio.');
      return false;
    }
    const cedulaClean = formData.documentId.replace(/[.\s-]/g, '');
    if (!/^\d{6,10}$/.test(cedulaClean)) {
      setFormError('La cédula debe tener entre 6 y 10 dígitos.');
      return false;
    }
    if (!formData.address.trim()) {
      setFormError('La dirección es obligatoria.');
      return false;
    }
    if (!formData.city.trim()) {
      setFormError('La ciudad es obligatoria.');
      return false;
    }
    if (!formData.phone.trim()) {
      setFormError('El teléfono es obligatorio.');
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
              required
            />
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Ingrese su número de documento sin espacios.
            </p>
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
              required
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition bg-white"
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition"
              required
            />
          </div>
        </div>

        {/* ═══════ COLUMNA DERECHA: UBICACIÓN + DOCUMENTOS ═══════ */}
        <div className="space-y-6">
          {/* ─── UBICACIÓN ─── */}
          {!isEditMode && (
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
          )}

          {/* ─── DOCUMENTOS DE VALIDACIÓN ─── */}
          {!isEditMode && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <span>📄</span> Documentos de validación
              </h3>
              <p className="text-xs text-gray-500">
                Sube los siguientes documentos para validar tu identidad y domicilio.
                Formatos: JPG, PNG. Máx. 10 MB c/u.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <DocumentUploader
                  docType="cedula_frontal"
                  label="Cédula (Parte Frontal)"
                  description="Foto legible de la parte frontal de tu cédula"
                  onUpload={(file) => onUploadDocument(file, 'cedula_frontal')}
                  isUploading={isUploading}
                />
                <DocumentUploader
                  docType="cedula_posterior"
                  label="Cédula (Parte Posterior)"
                  description="Foto legible de la parte posterior de tu cédula"
                  onUpload={(file) => onUploadDocument(file, 'cedula_posterior')}
                  isUploading={isUploading}
                />
                <DocumentUploader
                  docType="cuenta_servicios"
                  label="Cuenta de Servicios"
                  description="Recibo de luz, agua o gas (últimos 3 meses)"
                  onUpload={(file) => onUploadDocument(file, 'cuenta_servicios')}
                  isUploading={isUploading}
                />
                <DocumentUploader
                  docType="foto_perfil"
                  label="Foto de Perfil"
                  description="Selfi o foto tipo documento"
                  onUpload={(file) => onUploadDocument(file, 'foto_perfil')}
                  isUploading={isUploading}
                />
              </div>
            </div>
          )}
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
