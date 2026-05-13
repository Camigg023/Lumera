import { ShieldCheck } from 'lucide-react';
import { Donacion } from '../../../services/donationService';

interface Props {
  donacion: Donacion;
}

export default function DeliveryEvidence({ donacion }: Props) {
  if (donacion.estado !== 'entregado' && donacion.estado !== 'validado') {
    return null;
  }

  // En un sistema real, estas URLs vendrían de donacion.evidenciaFotoUrl y donacion.evidenciaFirmaUrl
  // Por ahora, mostraremos placeholders ilustrativos.
  const fotoUrl = "https://images.unsplash.com/photo-1593113554131-017a6a480d4f?auto=format&fit=crop&q=80&w=400";
  const firmaUrl = "https://upload.wikimedia.org/wikipedia/commons/f/f8/Firma_ficticia.png";

  return (
    <div className="mt-4 p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={20} className="text-success" />
        <h4 className="font-h3 text-h3 text-on-surface">Evidencia de Entrega</h4>
      </div>
      
      <p className="text-sm text-outline mb-4">
        ¡Gracias! Esta donación ha sido recibida y validada por el centro de acopio.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Foto */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Fotografía de recepción</p>
          <div className="relative h-40 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/30">
            <img 
              src={fotoUrl} 
              alt="Evidencia fotográfica" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md">
              Validado
            </div>
          </div>
        </div>

        {/* Firma */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Firma del encargado</p>
          <div className="h-40 rounded-xl bg-surface border border-outline-variant/30 flex items-center justify-center p-4">
            <img 
              src={firmaUrl} 
              alt="Firma digital" 
              className="max-h-full max-w-full opacity-80"
              style={{ filter: 'grayscale(100%) contrast(200%)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
