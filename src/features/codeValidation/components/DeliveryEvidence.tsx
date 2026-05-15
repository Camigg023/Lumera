import { useState } from 'react';
import { ShieldCheck, Camera, PenLine, ExternalLink, X } from 'lucide-react';
import { Donacion } from '../../../services/donationService';

interface Props {
  donacion: Donacion;
  /** Si es true, permite subir nueva evidencia (modo recepcion) */
  allowUpload?: boolean;
  /** Callback para subir foto de evidencia */
  onUploadPhoto?: (file: File) => Promise<void>;
  /** Callback para subir firma digital */
  onUploadSignature?: (file: File) => Promise<void>;
  /** Indica si esta subiendo */
  isUploading?: boolean;
}

/**
 * Componente que muestra la evidencia de entrega de una donacion.
 * 
 * Funcionalidad:
 * - Muestra foto y firma digital desde Firebase Storage (URLs reales)
 * - Permite subir nueva evidencia en modo recepcion
 * - Incluye lightbox para previsualizar la foto a pantalla completa
 * - Muestra placeholder cuando no hay evidencia disponible
 */
export default function DeliveryEvidence({
  donacion,
  allowUpload = false,
  onUploadPhoto,
  onUploadSignature,
  isUploading = false,
}: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const hasPhoto = !!donacion.evidenciaFotoUrl;
  const hasSignature = !!donacion.evidenciaFirmaUrl;
  const isDelivered = donacion.estado === 'entregado' || donacion.estado === 'validado';

  if (!isDelivered && !allowUpload) {
    return null;
  }

  /**
   * Maneja la seleccion de archivo de foto.
   */
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadPhoto) {
      setPhotoFile(file);
      onUploadPhoto(file);
    }
  };

  /**
   * Maneja la seleccion de archivo de firma.
   */
  const handleSignatureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadSignature) {
      setSignatureFile(file);
      onUploadSignature(file);
    }
  };

  return (
    <div className="mt-4 p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={20} className="text-success" />
        <h4 className="font-bold text-base text-on-surface">Evidencia de Entrega</h4>
        {isDelivered && (
          <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full font-semibold ml-auto">
            Validado
          </span>
        )}
      </div>

      {isDelivered && (
        <p className="text-sm text-outline mb-4">
          ¡Gracias! Esta donacion ha sido recibida y validada por el centro de acopio.
        </p>
      )}

      {/* Grid de evidencia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ─── FOTO DE EVIDENCIA ─── */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
            <Camera size={12} />
            Fotografia de recepcion
          </p>

          {hasPhoto ? (
            <div
              className="relative h-40 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/30 cursor-pointer group"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={donacion.evidenciaFotoUrl}
                alt="Evidencia fotografica de la recepcion"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1 rounded-lg">
                  Ver completo
                </span>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md flex items-center gap-1">
                <ShieldCheck size={10} />
                Validado
              </div>
            </div>
          ) : allowUpload ? (
            <div className="h-40 rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface-container-low flex flex-col items-center justify-center p-4">
              <Camera size={24} className="text-outline mb-2" />
              <p className="text-xs text-outline text-center mb-2">
                Subir foto de recepcion
              </p>
              <label className="cursor-pointer px-4 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:brightness-110 transition">
                {isUploading ? 'Subiendo...' : 'Seleccionar foto'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                  disabled={isUploading}
                />
              </label>
            </div>
          ) : (
            <div className="h-40 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-center">
              <div className="text-center">
                <Camera size={28} className="text-outline/50 mx-auto mb-1" />
                <p className="text-xs text-outline/50">Sin evidencia</p>
              </div>
            </div>
          )}
        </div>

        {/* ─── FIRMA DIGITAL ─── */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
            <PenLine size={12} />
            Firma del encargado
          </p>

          {hasSignature ? (
            <div className="h-40 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-center p-4">
              <img
                src={donacion.evidenciaFirmaUrl}
                alt="Firma digital de recepcion"
                className="max-h-full max-w-full object-contain opacity-80"
                style={{ filter: 'contrast(200%)' }}
              />
            </div>
          ) : allowUpload ? (
            <div className="h-40 rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface-container-low flex flex-col items-center justify-center p-4">
              <PenLine size={24} className="text-outline mb-2" />
              <p className="text-xs text-outline text-center mb-2">
                Subir firma digital
              </p>
              <label className="cursor-pointer px-4 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:brightness-110 transition">
                {isUploading ? 'Subiendo...' : 'Seleccionar imagen'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSignatureSelect}
                  disabled={isUploading}
                />
              </label>
            </div>
          ) : (
            <div className="h-40 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center justify-center">
              <div className="text-center">
                <PenLine size={28} className="text-outline/50 mx-auto mb-1" />
                <p className="text-xs text-outline/50">Sin firma</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de descarga si hay evidencia */}
      {(hasPhoto || hasSignature) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {hasPhoto && (
            <a
              href={donacion.evidenciaFotoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container text-on-surface-variant rounded-lg text-xs font-medium hover:bg-primary-container hover:text-primary transition"
            >
              <ExternalLink size={12} />
              Abrir foto
            </a>
          )}
          {hasSignature && (
            <a
              href={donacion.evidenciaFirmaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container text-on-surface-variant rounded-lg text-xs font-medium hover:bg-primary-container hover:text-primary transition"
            >
              <ExternalLink size={12} />
              Abrir firma
            </a>
          )}
        </div>
      )}

      {/* Lightbox para foto a pantalla completa */}
      {lightboxOpen && donacion.evidenciaFotoUrl && (
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
              src={donacion.evidenciaFotoUrl}
              alt="Evidencia fotografica de recepcion"
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
