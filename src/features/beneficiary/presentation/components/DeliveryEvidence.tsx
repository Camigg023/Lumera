import { useState } from 'react';

/**
 * Props para el componente de evidencia de entrega.
 */
interface DeliveryEvidenceProps {
  /** URL de la foto de evidencia de recepción */
  photoUrl?: string;
  /** URL de la firma digital de recepción */
  signatureUrl?: string;
  /** Nombre de la organización beneficiaria */
  beneficiaryName: string;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente para visualizar la evidencia de recepción de una entrega.
 * Muestra la foto del donador/entrega y la firma digital en tarjetas.
 * Soporta vista previa en modal (lightbox) para la foto.
 */
export function DeliveryEvidence({
  photoUrl,
  signatureUrl,
  beneficiaryName,
  className = '',
}: DeliveryEvidenceProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasPhoto = !!photoUrl;
  const hasSignature = !!signatureUrl;

  if (!hasPhoto && !hasSignature) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          📸 Evidencia de recepción
        </h3>
        <div className="text-center py-6">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm text-gray-500">No hay evidencia disponible para esta entrega.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
        📸 Evidencia de recepción
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Foto de evidencia */}
        {hasPhoto && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">Foto de recepción</p>
            <div
              className="relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={photoUrl}
                alt={`Foto de recepción - ${beneficiaryName}`}
                className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1 rounded-lg">
                  Ver completo
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Firma digital */}
        {hasSignature && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium">Firma digital de recepción</p>
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-3 flex items-center justify-center">
              <img
                src={signatureUrl}
                alt={`Firma digital - ${beneficiaryName}`}
                className="max-h-24 object-contain"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Modal para foto a pantalla completa */}
      {lightboxOpen && photoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white text-sm font-medium hover:text-gray-300 cursor-pointer"
            >
              ✕ Cerrar
            </button>
            <img
              src={photoUrl}
              alt={`Foto de recepción - ${beneficiaryName}`}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
