import React from 'react';
import { 
  CheckCircle, 
  MapPin, 
  Clock, 
  Calendar, 
  ChevronRight, 
  QrCode, 
  Bell, 
  LayoutDashboard, 
  Route, 
  Truck, 
  TrendingUp, 
  Settings,
  ClipboardCheck,
  Copy,
  Utensils,
  Package,
  History,
  Timer
} from 'lucide-react';
import { LocationMap } from '../../beneficiary/presentation/components/LocationMap';

interface DonacionConfirmadaProps {
  codigoDonacion: string;
  onBackToDashboard: () => void;
  donacion?: any;
}

export function DonacionConfirmada({ codigoDonacion, onBackToDashboard, donacion }: DonacionConfirmadaProps) {
  // Use current date for display
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="text-[#dae2fd] pb-20">
      
      {/* Header Interfaz Premium */}
      <div className="flex flex-col gap-6">
        
        {/* Status Banner */}
        <div className="bg-[#131b2e]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c0c1ff]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-[#c0c1ff]/30 rounded-full animate-ping"></div>
              <div className="relative w-16 h-16 bg-[#c0c1ff] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(192,193,255,0.4)]">
                <CheckCircle className="text-[#07006c]" size={32} />
              </div>
            </div>
            
            <div>
              <span className="text-xs font-bold text-[#c0c1ff] uppercase tracking-[0.2em] mb-1 block">Estado del Activo</span>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Donación Confirmada</h1>
              <p className="text-[#c0c1ff]/70 text-sm mt-1 max-w-md">
                Tu aporte ha sido registrado en la red. El sistema ha validado la trazabilidad inicial.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-xs text-[#dae2fd]/50">Sincronizado hace 1 min</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#c0c1ff]"></div>
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
              <div className="w-2 h-2 rounded-full bg-white/10"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Columna Izquierda: Línea de Tiempo */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Timeline de Trazabilidad */}
            <div className="bg-[#131b2e]/40 backdrop-blur-md border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-bold text-white mb-10 flex items-center gap-3">
                <Route className="text-[#c0c1ff]" size={20} />
                Flujo de Trazabilidad Digital
              </h3>
              
              <div className="relative space-y-12">
                {/* Linea vertical conector */}
                <div className="absolute left-[27px] top-4 bottom-4 w-[1px] bg-white/10"></div>
                
                {/* Step 1: Registro */}
                <div className="flex items-start gap-8 relative">
                  <div className="w-14 h-14 bg-[#2d3449] border border-white/10 rounded-full flex items-center justify-center text-[#dae2fd]/60 relative z-10">
                    <ClipboardCheck size={24} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-white/60">Registro de Intención</h4>
                      <span className="text-xs text-white/30">{dateStr} · {timeStr}</span>
                    </div>
                    <p className="text-sm text-white/40">Inventario cargado y validado localmente.</p>
                  </div>
                </div>

                {/* Step 2: Confirmación (ACTIVO) */}
                <div className="flex items-start gap-8 relative">
                  <div className="w-14 h-14 bg-[#c0c1ff] rounded-full flex items-center justify-center text-[#07006c] shadow-[0_0_25px_rgba(192,193,255,0.4)] relative z-10">
                    <CheckCircle size={24} />
                  </div>
                  <div className="flex-grow bg-white/5 border border-[#c0c1ff]/30 p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-[#c0c1ff]">Confirmación de Donación</h4>
                      <span className="text-xs text-[#c0c1ff]">AHORA</span>
                    </div>
                    <p className="text-sm text-white/80">Código único {codigoDonacion} asignado y bloqueado para tránsito.</p>
                  </div>
                </div>

                {/* Step 3: Logística / Entrega */}
                <div className={`flex items-start gap-8 relative ${donacion?.estado === 'entregado' ? '' : 'opacity-30'}`}>
                  <div className={`w-14 h-14 ${donacion?.estado === 'entregado' ? 'bg-[#ddb7ff] text-[#490080]' : 'bg-[#2d3449] text-[#dae2fd]/60'} border border-white/10 rounded-full flex items-center justify-center relative z-10`}>
                    <Truck size={24} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`font-bold ${donacion?.estado === 'entregado' ? 'text-white' : ''}`}>Entrega en Centro</h4>
                      <span className="text-xs">{donacion?.estado === 'entregado' ? 'Completado' : 'Pendiente'}</span>
                    </div>
                  </div>
                </div>

                {/* Step 4: Entrega */}
                <div className="flex items-start gap-8 relative opacity-30">
                  <div className="w-14 h-14 bg-[#2d3449] border border-white/10 rounded-full flex items-center justify-center text-[#dae2fd]/60 relative z-10">
                    <TrendingUp size={24} />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold">Impacto Generado</h4>
                      <span className="text-xs italic">Próximamente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa de Entrega Placeholder */}
            <div className="bg-[#131b2e]/40 backdrop-blur-md border border-white/5 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <MapPin className="text-[#ddb7ff]" size={20} />
                  Punto de Recepción Sugerido
                </h3>
                <span className="text-xs px-3 py-1 bg-[#ddb7ff]/10 text-[#ddb7ff] rounded-full font-bold">ZONA NORTE</span>
              </div>
              
              <div className="rounded-2xl overflow-hidden h-64 border border-white/5">
                <LocationMap 
                   latitude={6.2442} 
                   longitude={-75.5812} 
                   height={256}
                   label="Centro de Acopio Lumera - Sede Norte"
                />
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white">Calle 45 # 12 - 34, Medellín</p>
                  <p className="text-xs text-[#dae2fd]/50">Abierto: 08:00 AM - 06:00 PM</p>
                </div>
                <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all">
                  Ver indicaciones en Waze
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Detalles & Impacto */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Identificador & QR */}
            <div className="bg-[#131b2e]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center flex flex-col items-center">
              <span className="text-[10px] font-bold text-[#dae2fd]/40 uppercase tracking-[0.3em] mb-4">Identificador Único</span>
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xl font-bold text-white font-mono">{codigoDonacion}</h2>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[#c0c1ff]">
                  <Copy size={16} />
                </button>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.05)] mb-6 group cursor-pointer overflow-hidden relative">
                <div className="absolute inset-0 bg-[#c0c1ff]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <QrCode size={128} className="text-[#0b1326]" />
                </div>
              </div>
              
              <p className="text-[10px] text-[#dae2fd]/30 italic">Blockchain Verified Artifact</p>
            </div>

            {/* Impact Bento Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-[#131b2e]/40 border border-white/5 rounded-3xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#2fd9f4]/20 rounded-xl flex items-center justify-center text-[#2fd9f4]">
                  <Utensils size={24} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">42</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#dae2fd]/40 font-bold">Raciones Estimadas</div>
                </div>
              </div>
              
              <div className="bg-[#131b2e]/40 border border-white/5 rounded-3xl p-6">
                <Package size={20} className="text-[#ddb7ff] mb-2" />
                <div className="text-xl font-bold text-white">{donacion?.totalProductos || 12}</div>
                <div className="text-[10px] text-[#dae2fd]/40 font-bold">Ítems</div>
              </div>
              
              <div className="bg-[#131b2e]/40 border border-white/5 rounded-3xl p-6">
                <Timer size={20} className="text-[#c0c1ff] mb-2" />
                <div className="text-xl font-bold text-white">2.5h</div>
                <div className="text-[10px] text-[#dae2fd]/40 font-bold">T. Esperado</div>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-4">
              <button 
                onClick={onBackToDashboard}
                className="w-full py-4 bg-[#c0c1ff] text-[#07006c] font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={18} />
                Volver al Panel
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}