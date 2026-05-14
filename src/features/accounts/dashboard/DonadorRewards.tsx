import React from 'react';
import { 
  Gift, 
  Award, 
  Ticket, 
  Store, 
  Zap, 
  ChevronRight, 
  Star, 
  ShoppingBag,
  Percent,
  CheckCircle2,
  Truck
} from 'lucide-react';

interface DonadorRewardsProps {
  stats: {
    donaciones: number;
    productos: number;
    kg: number;
  };
}

export function DonadorRewards({ stats }: DonadorRewardsProps) {
  // Mock rewards logic
  const rewards = [
    {
      id: 1,
      title: "10% Descuento en Éxito",
      description: "Válido en productos de la canasta básica.",
      requiredKg: 10,
      icon: <Percent className="text-[#c0c1ff]" />,
      code: "LUM-EXITO-10",
      unlocked: stats.kg >= 10
    },
    {
      id: 2,
      title: "Bono $20.000 en Carulla",
      description: "Por superar las 5 donaciones registradas.",
      requiredDonations: 5,
      icon: <ShoppingBag className="text-[#ddb7ff]" />,
      code: "LUM-CARU-20K",
      unlocked: stats.donaciones >= 5
    },
    {
      id: 3,
      title: "15% Descuento en Alkosto",
      description: "Aplica en electrodomésticos seleccionados.",
      requiredKg: 30,
      icon: <Zap className="text-[#2fd9f4]" />,
      code: "LUM-ALKO-15",
      unlocked: stats.kg >= 30
    },
    {
      id: 4,
      title: "Bono Mercado en Tiendas Ara",
      description: "Bono de $50.000 para tu próximo mercado.",
      requiredKg: 100,
      icon: <Ticket className="text-[#f0dbff]" />,
      code: "LUM-ARA-50K",
      unlocked: stats.kg >= 100
    },
    {
      id: 5,
      title: "Descuento en Makro",
      description: "20% de descuento en compras al por mayor.",
      requiredDonations: 15,
      icon: <Store className="text-[#c0c1ff]" />,
      code: "LUM-MAKRO-20",
      unlocked: stats.donaciones >= 15
    },
    {
      id: 6,
      title: "Membresía Premium Lumera",
      description: "Insignia dorada y acceso a eventos exclusivos.",
      requiredKg: 200,
      icon: <Award className="text-[#ddb7ff]" />,
      code: "LUM-HERO-GOLD",
      unlocked: stats.kg >= 200
    },
    {
      id: 7,
      title: "Descuento en PriceSmart",
      description: "25% de descuento en membresía y primera compra.",
      requiredKg: 75,
      icon: <Zap className="text-[#2fd9f4]" />,
      code: "LUM-PRICE-25",
      unlocked: stats.kg >= 75
    },
    {
      id: 8,
      title: "Cashback Solidario Plus",
      description: "10% de devolución en todas tus compras de mercado.",
      requiredKg: 250,
      icon: <Star className="text-[#f0dbff]" />,
      code: "LUM-CASH-10",
      unlocked: stats.kg >= 250
    },
    {
      id: 9,
      title: "Super Bono $100.000",
      description: "Bono redimible en cualquier tienda del Grupo Éxito.",
      requiredDonations: 30,
      icon: <Ticket className="text-[#c0c1ff]" />,
      code: "LUM-SUPER-100K",
      unlocked: stats.donaciones >= 30
    },
    {
      id: 10,
      title: "Bono Ahorro Surtimax",
      description: "Bono de $60.000 para productos de marca propia.",
      requiredKg: 300,
      icon: <Percent className="text-[#ddb7ff]" />,
      code: "LUM-SURTI-60",
      unlocked: stats.kg >= 300
    },
    {
      id: 11,
      title: "Bono Gourmet en Carulla",
      description: "Bono de $40.000 en productos importados.",
      requiredDonations: 12,
      icon: <ShoppingBag className="text-[#2fd9f4]" />,
      code: "LUM-GOURMET-40",
      unlocked: stats.donaciones >= 12
    },
    {
      id: 12,
      title: "Mega Cashback 15%",
      description: "El máximo beneficio de retorno para héroes del Hambre Cero.",
      requiredKg: 500,
      icon: <Star className="text-[#f0dbff]" />,
      code: "LUM-MEGA-15",
      unlocked: stats.kg >= 500
    }
  ];

  const [aliadas, setAliadas] = React.useState<string[]>(['ÉXITO', 'CARULLA', 'ARA', 'ALKOSTO', 'MAKRO', 'PRICESMART', 'SURTIMAX', 'OLÍMPICA']);

  React.useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const { db } = await import('../../../config/firebase');
        
        const q = query(collection(db, 'users'), where('role', '==', 'empresa'));
        const snapshot = await getDocs(q);
        
        const empresasRegistradas = snapshot.docs.map(doc => doc.data().name?.toUpperCase()).filter(Boolean);
        
        // Unir con las harcoded evitando duplicados
        setAliadas(prev => {
          const combined = new Set([...prev, ...empresasRegistradas]);
          return Array.from(combined);
        });
      } catch (err) {
        console.error('Error al cargar empresas aliadas:', err);
      }
    };

    fetchEmpresas();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Recompensas */}
      <header className="relative p-10 rounded-3xl overflow-hidden border border-white/5 bg-[#131b2e]/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c0c1ff]/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ddb7ff]/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="text-[#c0c1ff] fill-[#c0c1ff]" size={16} />
              <span className="text-xs font-bold text-[#c0c1ff] uppercase tracking-[0.2em]">Programa de Beneficios</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Tus Recompensas</h1>
            <p className="text-[#dae2fd]/60 max-w-md">
              Tu compromiso con el Hambre Cero tiene recompensas. Canjea tus logros por beneficios en nuestras tiendas aliadas de alimentación.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center min-w-[120px]">
              <div className="text-2xl font-bold text-white">{stats.kg.toFixed(1)}</div>
              <div className="text-[10px] uppercase tracking-wider text-[#dae2fd]/40 font-bold">Kg Donados</div>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center min-w-[120px]">
              <div className="text-2xl font-bold text-[#c0c1ff]">{stats.donaciones}</div>
              <div className="text-[10px] uppercase tracking-wider text-[#dae2fd]/40 font-bold">Donaciones</div>
            </div>
          </div>
        </div>
      </header>

      {/* Grid de Cupones / Bonos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.map((reward) => (
          <div 
            key={reward.id} 
            className={`relative p-6 rounded-3xl border transition-all duration-300 ${
              reward.unlocked 
              ? 'bg-[#131b2e]/40 border-[#c0c1ff]/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' 
              : 'bg-[#131b2e]/20 border-white/5 opacity-70 grayscale'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${reward.unlocked ? 'bg-[#c0c1ff]/20' : 'bg-white/5'}`}>
                {reward.icon}
              </div>
              {reward.unlocked ? (
                <span className="text-[10px] font-bold bg-success-container text-success px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={10} /> DISPONIBLE
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-white/5 text-[#dae2fd]/40 px-3 py-1 rounded-full">
                  BLOQUEADO
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{reward.title}</h3>
            <p className="text-sm text-[#dae2fd]/50 mb-6">{reward.description}</p>

            {reward.unlocked ? (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 border-dashed">
                <code className="text-sm font-mono text-[#c0c1ff]">{reward.code}</code>
                <button className="text-[10px] font-bold text-[#c0c1ff] hover:underline uppercase">Copiar</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#dae2fd]/40">
                  <span>PROGRESO</span>
                  <span>
                    {reward.requiredKg 
                      ? `${Math.min((stats.kg / reward.requiredKg) * 100, 100).toFixed(0)}%` 
                      : `${Math.min((stats.donaciones / reward.requiredDonations) * 100, 100).toFixed(0)}%`}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#c0c1ff]/50 rounded-full" 
                    style={{ 
                      width: reward.requiredKg 
                        ? `${Math.min((stats.kg / reward.requiredKg) * 100, 100)}%` 
                        : `${Math.min((stats.donaciones / reward.requiredDonations) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-[10px] text-[#dae2fd]/40">
                  Faltan {reward.requiredKg 
                    ? `${(reward.requiredKg - stats.kg).toFixed(1)} kg` 
                    : `${reward.requiredDonations - stats.donaciones} donaciones`} para desbloquear.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Aliados Seccion */}
      <section className="p-8 rounded-3xl bg-[#c0c1ff]/5 border border-[#c0c1ff]/10">
        <div className="flex items-center gap-3 mb-6">
          <Store className="text-[#c0c1ff]" size={20} />
          <h3 className="text-lg font-bold text-white">Nuestras Tiendas Aliadas</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 opacity-60">
          {aliadas.map(brand => (
            <div key={brand} className="h-12 bg-white/5 rounded-xl flex items-center justify-center font-black text-white/40 border border-white/5 tracking-widest text-xs px-2 text-center">
              {brand}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
