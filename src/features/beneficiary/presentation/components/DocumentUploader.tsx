import { useState, useRef } from 'react';
import { DocumentType, DOCUMENT_TYPE_LABELS, BeneficiaryDocument } from '../../domain/entities/Beneficiary';

/**
 * Props para el componente DocumentUploader.
 */
interface DocumentUploaderProps {
  /** Tipo de documento a subir */
  docType: DocumentType;
  /** Documento existente (si ya fue subido) */
  existingDoc?: BeneficiaryDocument | null;
  /** Función para subir el archivo (retorna el documento creado) */
  onUpload: (file: File) => Promise<void>;
  /** Indica si está en proceso de subida */
  isUploading?: boolean;
  /** Texto personalizado para la etiqueta (opcional, usa DOCUMENT_TYPE_LABELS por defecto) */
  label?: string;
  /** Descripción opcional debajo del título */
  description?: string;
}

/**
 * Componente para subir un documento de validación.
 * Muestra botón de selección, previsualización del archivo seleccionado
 * y el documento existente si ya fue subido.
 *
 * Soporta archivos JPG, PNG y PDF.
 */
export function DocumentUploader({
  docType,
  existingDoc,
  onUpload,
  isUploading,
  label: customLabel,
  description,
}: DocumentUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const label = customLabel || DOCUMENT_TYPE_LABELS[docType];
  const hasExisting = !!existingDoc;

  /**
   * Maneja la selección de archivo y genera preview para imágenes.
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Generar preview solo para imágenes
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  /**
   * Dispara la subida del archivo seleccionado.
   */
  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch {
      // Error manejado por el hook padre
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      {/* Encabezado con tipo de documento */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-800">{label}</label>
        {hasExisting && (
          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Subido
          </span>
        )}
      </div>

      {/* Descripción opcional */}
      {description && (
        <p className="text-xs text-gray-400">{description}</p>
      )}

      {/* Documento existente */}
      {hasExisting && existingDoc && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <span className="text-lg">📄</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-700 truncate">{existingDoc.fileName}</p>
            <p className="text-xs text-gray-400">
              {new Date(existingDoc.uploadedAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <a
            href={existingDoc.storageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline flex-shrink-0"
          >
            Ver
          </a>
        </div>
      )}

      {/* Selector de archivo */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[var(--color-accent-bg)] file:text-[var(--color-accent)] hover:file:bg-[var(--color-accent-border)] cursor-pointer"
        />
      </div>

      {/* Preview de imagen seleccionada */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* Nombre del archivo seleccionado (no imagen) */}
      {selectedFile && !preview && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
          <span className="text-lg">📎</span>
          <span className="text-sm text-gray-600 truncate">{selectedFile.name}</span>
          <span className="text-xs text-gray-400">({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)</span>
        </div>
      )}

      {/* Botón de subida */}
      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`
            w-full py-2 px-4 rounded-lg text-sm font-semibold transition-all
            ${isUploading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[var(--color-accent)] text-white hover:brightness-110 active:scale-[0.98] cursor-pointer'
            }
          `}
        >
          {isUploading ? 'Subiendo...' : 'Subir documento'}
        </button>
      )}
    </div>
  );
}
