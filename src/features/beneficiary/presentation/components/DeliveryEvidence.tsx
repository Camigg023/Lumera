import { useState } from 'react';
import { ShieldCheck, Camera, PenLine, ExternalLink, X } from 'lucide-react';
import { HelpRequest } from '../../domain/entities/HelpRequest';

/**
 * Props para el componente de evidencia de entrega (vista beneficiario).
 */
interface DeliveryEvidenceProps {
  /** Solicitud/donacion que contiene la evidencia */
  delivery: HelpRequest;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente para visualizar la evidencia de recepcion de una entrega
 * desde la perspectiva del beneficiario.
 * 
 * Muestra:
 * - Foto de evidencia (desde Firebase Storage URL real)
 * - Firma digital (desde Firebase Storage URL real)
 * - Preview en lightbox para la foto
 * - Estado del documento (subido / no disponible)
 * - Enlaces para abrir/descargar los archivos
 */
export function DeliveryEvidence({
  delivery,
  className = '',
}: DeliveryEvidenceProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Obtener URLs de evidencia desde la solicitud
  const photoUrl = (delivery as any).evidenciaFotoUrl as string | undefined;
  const signatureUrl = (delivery as any).evidenciaFirmaUrl as string | undefined;
  const hasPhoto = !!photoUrl;
  const hasSignature = !!signatureUrl;

  if (!hasPhoto && !hasSignature) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck size={18} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Evidencia de recepcion
          </h3>
        </div>
        <div className="text-center py-6">
          <div className="text-3xl mb-2 text-gray-300">
            <Camera size={32} className="mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            No hay evidencia disponible para esta entrega.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            La evidencia se registra cuando el coordinador valida la recepcion.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={18} className="text-green-600" />
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Evidencia de recepcion
        </h3>
        <span className="ml-auto text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
          Recibido
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Foto de evidencia */}
        {hasPhoto && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <Camera size={12} />
              Foto de recepcion
            </p>
            <div
              className="relative rounded-lg overflow-hidden border border-gray-200 cursor-pointer group"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={photoUrl}
                alt="Foto de evidencia de la recepcion"
                className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1 rounded-lg">
                  Ver completo
                </span>
              </div>
              <div className="absolute bottom-2 right-2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck size={10} />
                Validado
              </div>
            </div>
            <a
              href={photoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <ExternalLink size={11} />
              Abrir en nueva pestana
            </a>
          </div>
        )}

        {/* Firma digital */}
        {hasSignature && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
              <PenLine size={12} />
              Firma digital de recepcion
            </p>
            <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-4 flex items-center justify-center h-40">
              <img
                src={signatureUrl}
                alt="Firma digital de recepcion"
                className="max-h-full max-w-full object-contain"
                style={{ filter: 'contrast(200%)' }}
                loading="lazy"
              />
            </div>
            <a
              href={signatureUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              <ExternalLink size={11} />
              Abrir en nueva pestana
            </a>
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
              className="absolute -top-10 right-0 text-white text-sm font-medium hover:text-gray-300 cursor-pointer flex items-center gap-1"
            >
              <X size={16} /> Cerrar
            </button>
            <img
              src={photoUrl}
              alt="Foto de evidencia de recepcion"
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
