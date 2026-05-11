import "../pages/Trazabilidad.css";

import {
  LayoutDashboard,
  HandHeart,
  Settings,
  Bell,
  Sparkles,
  PackageCheck,
  CalendarDays,
  Clock3,
  Boxes,
  CircleDot,
  Copy,
} from "lucide-react";

export function Trazabilidad() {

  const timeline = [
    {
      title: "Asignación de punto",
      text: "Punto de recolección validado en Zona Norte.",
      status: "completed",
      time: "24 May · 09:15 AM",
    },
    {
      title: "Confirmación de donación",
      text: "Inventario digital verificado y bloqueado para transferencia.",
      status: "active",
      time: "24 May · 10:30 AM",
    },
    {
      title: "Entrega en tienda",
      text: "Pendiente",
      status: "pending",
      time: "",
    },
    {
      title: "Asignación a beneficiario",
      text: "Próximamente",
      status: "pending",
      time: "",
    },
    {
      title: "En espera de recogida",
      text: "En cola",
      status: "pending",
      time: "",
    },
    {
      title: "Entregado",
      text: "Meta final",
      status: "pending",
      time: "",
    },
  ];

  return (

    <div className="tracking-page">

      {/* SIDEBAR */}
      <aside className="tracking-sidebar">

        <div>

          <div className="tracking-logo">

            <h1>Lumera</h1>
            <span>High-Tech Altruism</span>

          </div>

          <nav className="tracking-menu">

            <div className="tracking-item">
              <LayoutDashboard size={16} />
              Dashboard
            </div>

            <div className="tracking-item active">
              <Sparkles size={16} />
              Trazabilidad
            </div>

            <div className="tracking-item">
              <HandHeart size={16} />
              Donaciones
            </div>

          </nav>

        </div>

        <button className="new-donation-btn">
          Nueva donación
        </button>

      </aside>

      {/* MAIN */}
      <main className="tracking-main">

        {/* TOPBAR */}
        <header className="tracking-topbar">

          <div>

            <p className="tracking-label">
              REFERENCIA DE SEGUIMIENTO
            </p>

            <h2>
              LUM-2026-000123
            </h2>

          </div>

          <div className="tracking-icons">

            <Sparkles size={17} />
            <Bell size={17} />

            <img
              src="https://i.pravatar.cc/100"
              alt=""
            />

          </div>

        </header>

        {/* GRID */}
        <div className="tracking-grid">

          {/* LEFT */}
          <div className="tracking-left">

            {/* STATUS */}
            <section className="tracking-card current-status">

              <div className="status-left">

                <div className="status-icon">
                  <PackageCheck size={18} />
                </div>

                <div>

                  <span className="mini-title">
                    ESTADO ACTUAL
                  </span>

                  <h3>
                    Confirmación de donación
                  </h3>

                  <p>
                    Tu donación ha sido confirmada exitosamente y está lista
                  para ser llevada al punto de entrega seleccionado.
                  </p>

                </div>

              </div>

              <div className="status-right">

                <span>
                  Actualizado hace 5 min
                </span>

                <div className="dots">
                  •••
                </div>

              </div>

            </section>

            {/* FLOW */}
            <section className="tracking-card flow-card">

              <h3 className="flow-title">
                Flujo de Trazabilidad
              </h3>

              <div className="timeline">

                {timeline.map((item, index) => (

                  <div
                    key={index}
                    className={`timeline-item ${item.status}`}
                  >

                    <div className="timeline-left">

                      <div className="timeline-circle">

                        <CircleDot size={14} />

                      </div>

                      {index !== timeline.length - 1 && (
                        <div className="timeline-line"></div>
                      )}

                    </div>

                    <div className="timeline-content">

                      <div className="timeline-top">

                        <h4>
                          {item.title}
                        </h4>

                        <span>
                          {item.time}
                        </span>

                      </div>

                      <p>
                        {item.text}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </section>

          </div>

          {/* RIGHT */}
          <div className="tracking-right">

            {/* QR */}
            <section className="tracking-card qr-card">

              <span className="mini-title">
                IDENTIFICADOR DE ACTIVO
              </span>

              <div className="asset-code">

                <strong>
                  LUM-2026-000123
                </strong>

                <Copy size={15} />

              </div>

              <div className="qr-box">

                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LUMERA"
                  alt=""
                />

              </div>

              <p>
                Escanea para verificar autenticidad en blockchain
              </p>

            </section>

            {/* DELIVERY */}
            <section className="tracking-card delivery-card">

              <div className="delivery-header">

                <CalendarDays size={15} />

                <span>
                  Programación de entrega
                </span>

              </div>

              <div className="delivery-box">

                <div>

                  <small>Próximo Lunes</small>

                  <strong>
                    08:00 AM - 12:00 PM
                  </strong>

                </div>

                <span className="purple-text">
                  Mañana
                </span>

              </div>

              <button className="reschedule-btn">
                Reprogramar entrega
              </button>

            </section>

            {/* STATS */}
            <section className="tracking-card stats-large">

              <div className="stats-icon">
                <Clock3 size={16} />
              </div>

              <div>

                <h3>128</h3>
                <p>Raciones (Meals)</p>

              </div>

            </section>

            <div className="stats-row">

              <section className="tracking-card mini-stat">

                <Boxes size={15} />

                <div>

                  <h4>42</h4>
                  <p>Items</p>

                </div>

              </section>

              <section className="tracking-card mini-stat">

                <Clock3 size={15} />

                <div>

                  <h4>2h 15m</h4>
                  <p>T. Total</p>

                </div>

              </section>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}