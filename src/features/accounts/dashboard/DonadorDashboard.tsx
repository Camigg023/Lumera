import { useState } from "react";
import NearbyAcopio from "../../collectionPoints/presentation/components/NearbyAcopio/NearbyAcopio";

export function DonadorDashboard() {
  const [view, setView] = useState("inicio");

  return (
    <div className="min-h-screen bg-background text-on-background font-sans antialiased pb-32">
      {/* ===== TOP APP BAR ===== */}
      <header className="sticky top-0 w-full z-40 bg-white/80 backdrop-blur-lg border-b border-indigo-50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">eco</span>
            <span className="text-2xl font-bold text-indigo-600 tracking-tight">Lumera</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-6 mr-6">
              <button
                onClick={() => setView("inicio")}
                className={`font-medium transition-colors ${
                  view === "inicio" ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
                }`}
              >
                Explore
              </button>
              <button
                onClick={() => setView("donar")}
                className={`font-medium transition-colors ${
                  view === "donar" ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
                }`}
              >
                Donate
              </button>
              <button
                onClick={() => setView("impacto")}
                className={`font-medium transition-colors ${
                  view === "impacto" ? "text-indigo-600" : "text-slate-500 hover:text-indigo-600"
                }`}
              >
                Impact
              </button>
            </div>
            <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100 transition-transform active:scale-95">
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq1llL5eUXQjiRoXxV099IXQ7L2DlROgk8sBIAFoACzFUfdc5XH9wFSoDnigl0FN2pJvE9R7L8U8zM00jIjo8lmFxXcya9w2FTxanNiN4zVUq4MdLJnu1eMMWvPfrryVfdGsFHeIWLLWyj8Dbw5NRWDKINi8nvw0fQK961QvokkZrhNP3RMPUhgZPC6AoZ6n2yA5ouk8UcrqT1IxacM0C-pahbLLMD8G0LzM5-IthbT6fgmkC7gJsXYGYrXg1P9Jm1dJI2-SYw93-Q"
              />
            </button>
          </div>
        </div>
      </header>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      <main className="max-w-7xl mx-auto px-5 md:px-10 mt-8 space-y-12">

        {/* ========== VISTA INICIO ========== */}
        {view === "inicio" && (
          <>
            {/* ─── User Info Header ─── */}
            <section className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-indigo-50/50">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary">
                  <img
                    alt="Elena Rodriguez"
                    className="w-full h-full object-cover rounded-full border-4 border-white"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfuOPe0g_EDDBKlNttYUTXp0l7vAw6Bz71AiGuZ1YFyrMNGCuLqYh7CxxsEzdo9mGVJC3jnM-fORAbyn_X39NPiLUqYzIHa0tdbUtO1qM9O4rqxYxCQPq9yq7J3U-1rKZNA-aeAIKuU8CIBaiex4xmHjYJbb7cdxGouH2y0myWcVK-IAPbumrG-SumHQgZv04uOZGQ9mpnnjmNT4y4dxe-TYJQZXy0OyONyGE_GUeApuedtpZqPJv_OvuYDKlfXXaqYX0OC0V3m9qD"
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-h1 font-h1 text-on-background">Elena Rodriguez</h1>
                  <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-1">
                    Sustaining Partner Since 2022
                  </p>
                </div>
                <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">
                  Passionate about sustainable food systems and community resilience. Currently focused on reducing surplus waste in the metro area through collaborative distribution networks.
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-4 py-2 rounded-full bg-surface-container text-primary font-label-sm text-label-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    San Francisco, CA
                  </span>
                  <span className="px-4 py-2 rounded-full bg-surface-container text-primary font-label-sm text-label-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">share</span>
                    Share Profile
                  </span>
                </div>
              </div>
            </section>

            {/* ─── Lifetime Impact (Bento Grid) ─── */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-h2 font-h2 text-on-background">Lifetime Impact</h2>
                <button className="text-primary font-label-sm text-label-sm flex items-center gap-1">
                  Full Report
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Large Card — Total Meals */}
                <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-indigo-50 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 transition-colors"></div>
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary mb-6">
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                    </div>
                    <h3 className="text-body-lg text-body-lg text-on-surface-variant">Total Meals Saved</h3>
                    <p className="text-[56px] font-bold text-on-background leading-none mt-2">12,482</p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-indigo-50/50 flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined">trending_up</span>
                    <span className="font-label-sm text-label-sm">+12% from last month</span>
                  </div>
                </div>

                {/* Medium Card 1 — People Helped */}
                <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-indigo-50 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-secondary-container/10 flex items-center justify-center text-secondary mb-6">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                    </div>
                    <h3 className="text-body-md text-body-md text-on-surface-variant">People Helped</h3>
                    <p className="text-[40px] font-bold text-on-background mt-1">3,204</p>
                  </div>
                  <p className="font-label-sm text-label-sm text-outline mt-4">Direct community reach</p>
                </div>

                {/* Medium Card 2 — Carbon Reduced */}
                <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-indigo-50 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-error-container/20 flex items-center justify-center text-error mb-6">
                      <span className="material-symbols-outlined text-2xl">co2</span>
                    </div>
                    <h3 className="text-body-md text-body-md text-on-surface-variant">Carbon Reduced</h3>
                    <p className="text-[40px] font-bold text-on-background mt-1">
                      4.2<span className="text-2xl font-semibold">t</span>
                    </p>
                  </div>
                  <p className="font-label-sm text-label-sm text-outline mt-4">Equivalent to 84 trees</p>
                </div>
              </div>
            </section>

            {/* ─── Donation History ─── */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-h2 font-h2 text-on-background">Recent Contributions</h2>
                <div className="flex gap-2">
                  <button className="p-2 rounded-xl border border-indigo-100 hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
                  </button>
                  <button className="p-2 rounded-xl border border-indigo-100 hover:bg-white transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">download</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Item 1 */}
                <div className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl border border-indigo-50 hover:border-primary-container/30 transition-all hover:shadow-md gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden">
                      <span className="material-symbols-outlined text-3xl text-outline/40">inventory_2</span>
                    </div>
                    <div>
                      <h4 className="font-h3 text-h3 text-on-background">Fresh Harvest Bundle</h4>
                      <p className="font-label-sm text-label-sm text-outline">Nov 14, 2023 • Community Food Bank</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 md:gap-16">
                    <div className="text-left md:text-right">
                      <p className="font-label-sm text-label-sm text-secondary uppercase tracking-tight">Impact</p>
                      <p className="text-body-lg font-body-lg font-bold text-on-background">42 Meals</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-label-sm text-label-sm text-secondary uppercase tracking-tight">Status</p>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Distributed
                      </span>
                    </div>
                    <button className="p-2 rounded-full hover:bg-surface-container transition-colors hidden md:block">
                      <span className="material-symbols-outlined text-outline">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl border border-indigo-50 hover:border-primary-container/30 transition-all hover:shadow-md gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden">
                      <span className="material-symbols-outlined text-3xl text-outline/40">inventory_2</span>
                    </div>
                    <div>
                      <h4 className="font-h3 text-h3 text-on-background">Artisan Bakery Surplus</h4>
                      <p className="font-label-sm text-label-sm text-outline">Nov 10, 2023 • St. Jude's Shelter</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 md:gap-16">
                    <div className="text-left md:text-right">
                      <p className="font-label-sm text-label-sm text-secondary uppercase tracking-tight">Impact</p>
                      <p className="text-body-lg font-body-lg font-bold text-on-background">115 Meals</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-label-sm text-label-sm text-secondary uppercase tracking-tight">Status</p>
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-label-sm inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Distributed
                      </span>
                    </div>
                    <button className="p-2 rounded-full hover:bg-surface-container transition-colors hidden md:block">
                      <span className="material-symbols-outlined text-outline">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl border border-indigo-50 hover:border-primary-container/30 transition-all hover:shadow-md gap-4 opacity-75">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center overflow-hidden">
                      <span className="material-symbols-outlined text-3xl text-outline/40">inventory_2</span>
                    </div>
                    <div>
                      <h4 className="font-h3 text-h3 text-on-background">Dairy Essentials Pack</h4>
                      <p className="font-label-sm text-label-sm text-outline">Nov 03, 2023 • North Bay Outreach</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 md:gap-16">
                    <div className="text-left md:text-right">
                      <p className="font-label-sm text-label-sm text-secondary uppercase tracking-tight">Impact</p>
                      <p className="text-body-lg font-body-lg font-bold text-on-background">28 Meals</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="font-label-sm text-label-sm text-secondary uppercase tracking-tight">Status</p>
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-label-sm text-label-sm inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                        In Transit
                      </span>
                    </div>
                    <button className="p-2 rounded-full hover:bg-surface-container transition-colors hidden md:block">
                      <span className="material-symbols-outlined text-outline">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 rounded-2xl border-2 border-dashed border-indigo-100 text-primary font-label-sm text-label-sm hover:bg-indigo-50/50 transition-colors">
                View All Donation History
              </button>
            </section>
          </>
        )}

        {/* ========== VISTA DONAR ========== */}
        {view === "donar" && (
          <section className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-h2 font-h2 text-on-background">Donate</h1>
              <p className="text-body-md text-on-surface-variant mt-1">
                Find the nearest collection point to drop off your donation
              </p>
            </div>
            <NearbyAcopio autoDetectar={true} />
          </section>
        )}

        {/* ========== VISTA IMPACTO ========== */}
        {view === "impacto" && (
          <section className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-container-low flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-outline/50">analytics</span>
            </div>
            <h1 className="text-h2 font-h2 text-on-background">Impact</h1>
            <p className="text-body-md text-on-surface-variant mt-2">
              Detailed impact reports coming soon
            </p>
          </section>
        )}

      </main>

      {/* ===== BOTTOM NAV BAR (Mobile) ===== */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-indigo-50 shadow-[0_-8px_30px_rgba(79,70,229,0.08)] rounded-t-3xl md:hidden">
        <div className="flex justify-around items-center px-4 pt-3 pb-6">
          {[
            { key: "inicio", icon: "explore", label: "Explore" },
            { key: "donar", icon: "volunteer_activism", label: "Donate" },
            { key: "impacto", icon: "analytics", label: "Impact" },
            { key: "perfil", icon: "person", label: "Profile" },
          ].map((item) => {
            const activo = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={`flex flex-col items-center justify-center px-5 py-2 transition-all duration-200 ${
                  activo
                    ? "bg-indigo-50 text-indigo-700 rounded-2xl"
                    : "text-slate-400 hover:text-indigo-500"
                }`}
              >
                <span
                  className="material-symbols-outlined mb-1"
                  style={activo ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] font-medium uppercase tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
