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
          <h2 className="text-h2 text-on-surface">Mi Perfil</h2>
          <p className="text-body-md text-on-surface-variant mt-1">
            Información personal y documentos de validación.
          </p>
        </div>
        <VerificationBadge status={beneficiary.verificationStatus} size="lg" />
      </div>

      {/* Mensaje según estado de verificación */}
      {beneficiary.verificationStatus === 'pending' && (
        <div className="p-4 bg-warning-container border border-warning/20 rounded-lg text-sm text-on-surface flex items-start gap-3 shadow-sm">
          <span className="text-xl">⏳</span>
          <p>Su perfil está pendiente de verificación. Una vez verificado podrá reclamar mercados disponibles.</p>
        </div>
      )}
      {beneficiary.verificationStatus === 'rejected' && (
        <div className="p-4 bg-error-container border border-error/20 rounded-lg text-sm text-on-error-container shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-xl">❌</span>
            <div>
              <p className="font-bold">Su perfil ha sido rechazado.</p>
              {beneficiary.verificationNotes && (
                <p className="mt-1 opacity-90">Motivo: {beneficiary.verificationNotes}</p>
              )}
              <p className="mt-2 text-xs opacity-75">Corrija la información y suba los documentos requeridos en la sección de edición.</p>
            </div>
          </div>
        </div>
      )}
      {beneficiary.verificationStatus === 'verified' && (
        <div className="p-4 bg-success-container border border-success/20 rounded-lg text-sm text-on-success-container flex items-start gap-3 shadow-sm">
          <span className="text-xl">✅</span>
          <p>Su perfil está verificado. Ya puede reclamar mercados en los puntos de entrega más cercanos.</p>
        </div>
      )}

      {/* ─── DATOS PERSONALES ─── */}
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 space-y-5 shadow-sm">
        <h3 className="text-h3 text-on-surface flex items-center gap-2">
          <span>👤</span> Datos personales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <p className="text-label-sm text-on-surface-variant">Nombre completo</p>
            <p className="text-body-md font-semibold text-on-surface mt-0.5">{beneficiary.fullName || '—'}</p>
          </div>
          <div>
            <p className="text-label-sm text-on-surface-variant">Cédula</p>
            <p className="text-body-md font-semibold text-on-surface mt-0.5">{beneficiary.documentId || '—'}</p>
          </div>
          <div>
            <p className="text-label-sm text-on-surface-variant">Tipo</p>
            <p className="text-body-md font-semibold text-on-surface mt-0.5">
              {typeLabels[beneficiary.beneficiaryType] || beneficiary.beneficiaryType || '—'}
            </p>
          </div>
          <div>
            <p className="text-label-sm text-on-surface-variant">Teléfono</p>
            <p className="text-body-md font-semibold text-on-surface mt-0.5">{beneficiary.phone || '—'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-label-sm text-on-surface-variant">Dirección</p>
            <p className="text-body-md font-semibold text-on-surface mt-0.5">{beneficiary.address || '—'}</p>
          </div>
          <div>
            <p className="text-label-sm text-on-surface-variant">Ciudad</p>
            <p className="text-body-md font-semibold text-on-surface mt-0.5">{beneficiary.city || '—'}</p>
          </div>
          {beneficiary.latitude && beneficiary.longitude ? (
            <div>
              <p className="text-label-sm text-on-surface-variant">Ubicación</p>
              <p className="text-body-md font-semibold text-on-surface mt-0.5">
                {beneficiary.latitude.toFixed(4)}, {beneficiary.longitude.toFixed(4)}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* ─── DOCUMENTOS SUBIDOS ─── */}
      <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 space-y-5 shadow-sm">
        <h3 className="text-h3 text-on-surface flex items-center gap-2">
          <span>📄</span> Documentos de validación
        </h3>

        {beneficiary.documents.length === 0 ? (
          <p className="text-body-md text-on-surface-variant italic">No se han subido documentos aún.</p>
        ) : (
          <div className="space-y-3">
            {beneficiary.documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4 bg-surface-container-lowest border border-outline-variant rounded-lg hover:shadow-md transition-shadow">
                <span className="text-2xl">
                  {doc.type === 'foto_perfil' ? '📸' : doc.type === 'cuenta_servicios' ? '📋' : '🪪'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-semibold text-on-surface truncate">{doc.fileName}</p>
                  <p className="text-xs text-on-surface-variant">
                    Subido el {new Date(doc.uploadedAt).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <a
                  href={doc.storageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary-fixed text-on-primary-fixed text-xs font-bold rounded-full hover:bg-primary-fixed-dim transition-colors flex-shrink-0"
                >
                  Ver archivo
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Subir documentos adicionales (solo si no está verificado) */}
        {beneficiary.verificationStatus !== 'verified' && (
          <div className="pt-5 border-t border-outline-variant space-y-4">
            <p className="text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">Subir documentos adicionales:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="text-[10px] text-on-surface-variant/40 text-center space-y-1 py-4">
        <p>Creado: {new Date(beneficiary.createdAt).toLocaleDateString('es-CO')} | Actualizado: {new Date(beneficiary.updatedAt).toLocaleDateString('es-CO')}</p>
      </div>
    </div>
  );
}
