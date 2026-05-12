import { Beneficiary } from '../../domain/entities/Beneficiary';
import { VerificationBadge } from './VerificationBadge';
import { DocumentUploader } from './DocumentUploader';

/**
 * Props para el componente de perfil de beneficiario.
 */
interface BeneficiaryProfileProps {
  /** Datos del beneficiario */
  beneficiary: Beneficiary;
  /** Función para subir un documento adicional */
  onUploadDocument: (file: File, docType: string) => Promise<void>;
  /** Indica si está subiendo */
  isUploading?: boolean;
}

/**
 * Vista de perfil de beneficiario (persona natural).
 * Muestra datos personales, documentos de validación y estado de verificación.
 */
export function BeneficiaryProfile({
  beneficiary,
  onUploadDocument,
  isUploading = false,
}: BeneficiaryProfileProps) {
  // Mapeo de tipos a español
  const typeLabels: Record<string, string> = {
    persona_natural: 'Persona Natural',
    cabeza_familia: 'Cabeza de Familia',
    adulto_mayor: 'Adulto Mayor',
    otro: 'Otro',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mi Perfil</h2>
          <p className="text-sm text-gray-500 mt-1">
            Información personal y documentos de validación.
          </p>
        </div>
        <VerificationBadge status={beneficiary.verificationStatus} size="lg" />
      </div>

      {/* Mensaje según estado de verificación */}
      {beneficiary.verificationStatus === 'pending' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          ⏳ Su perfil está pendiente de verificación. Una vez verificado podrá reclamar mercados disponibles.
        </div>
      )}
      {beneficiary.verificationStatus === 'rejected' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
          ❌ Su perfil ha sido rechazado.
          {beneficiary.verificationNotes && (
            <span className="block mt-1 font-medium">Motivo: {beneficiary.verificationNotes}</span>
          )}
          <span className="block mt-1">Corrija la información y suba los documentos requeridos.</span>
        </div>
      )}
      {beneficiary.verificationStatus === 'verified' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
          ✅ Su perfil está verificado. Ya puede reclamar mercados en los puntos de entrega más cercanos.
        </div>
      )}

      {/* ─── DATOS PERSONALES ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          👤 Datos personales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500">Nombre completo</p>
            <p className="text-sm font-medium text-gray-900">{beneficiary.fullName || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Cédula</p>
            <p className="text-sm font-medium text-gray-900">{beneficiary.documentId || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Tipo</p>
            <p className="text-sm font-medium text-gray-900">
              {typeLabels[beneficiary.beneficiaryType] || beneficiary.beneficiaryType || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Teléfono</p>
            <p className="text-sm font-medium text-gray-900">{beneficiary.phone || '—'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500">Dirección</p>
            <p className="text-sm font-medium text-gray-900">{beneficiary.address || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Ciudad</p>
            <p className="text-sm font-medium text-gray-900">{beneficiary.city || '—'}</p>
          </div>
          {beneficiary.latitude && beneficiary.longitude ? (
            <div>
              <p className="text-xs text-gray-500">Ubicación</p>
              <p className="text-sm font-medium text-gray-900">
                {beneficiary.latitude.toFixed(4)}, {beneficiary.longitude.toFixed(4)}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* ─── DOCUMENTOS SUBIDOS ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          📄 Documentos de validación
        </h3>

        {beneficiary.documents.length === 0 ? (
          <p className="text-sm text-gray-500">No se han subido documentos aún.</p>
        ) : (
          <div className="space-y-2">
            {beneficiary.documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-lg">
                  {doc.type === 'foto_perfil' ? '📸' : doc.type === 'cuenta_servicios' ? '📋' : '🪪'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{doc.fileName}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(doc.uploadedAt).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <a
                  href={doc.storageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex-shrink-0"
                >
                  Ver archivo
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Subir documentos adicionales (solo si no está verificado) */}
        {beneficiary.verificationStatus !== 'verified' && (
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <p className="text-xs text-gray-500">Subir documentos adicionales:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DocumentUploader
                docType="cedula_frontal"
                label="Cédula (Parte Frontal)"
                existingDoc={beneficiary.documents.find((d) => d.type === 'cedula_frontal')}
                onUpload={(file) => onUploadDocument(file, 'cedula_frontal')}
                isUploading={isUploading}
              />
              <DocumentUploader
                docType="cedula_posterior"
                label="Cédula (Parte Posterior)"
                existingDoc={beneficiary.documents.find((d) => d.type === 'cedula_posterior')}
                onUpload={(file) => onUploadDocument(file, 'cedula_posterior')}
                isUploading={isUploading}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DocumentUploader
                docType="cuenta_servicios"
                label="Cuenta de Servicios"
                existingDoc={beneficiary.documents.find((d) => d.type === 'cuenta_servicios')}
                onUpload={(file) => onUploadDocument(file, 'cuenta_servicios')}
                isUploading={isUploading}
              />
              <DocumentUploader
                docType="foto_perfil"
                label="Foto de Perfil"
                existingDoc={beneficiary.documents.find((d) => d.type === 'foto_perfil')}
                onUpload={(file) => onUploadDocument(file, 'foto_perfil')}
                isUploading={isUploading}
              />
            </div>
          </div>
        )}
      </div>

      {/* Fechas */}
      <div className="text-xs text-gray-400 text-center space-y-1">
        <p>Creado: {new Date(beneficiary.createdAt).toLocaleDateString('es-CO')}</p>
        <p>Actualizado: {new Date(beneficiary.updatedAt).toLocaleDateString('es-CO')}</p>
      </div>
    </div>
  );
}
