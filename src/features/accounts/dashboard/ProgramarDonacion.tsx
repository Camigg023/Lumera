import { useState } from "react";

import "../pages/ProgramarDonacion.css";

import {
  LayoutDashboard,
  HandHeart,
  Users,
  Truck,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  CalendarDays,
  Clock3,
  CircleAlert,
  SendHorizonal,
} from "lucide-react";

export function ProgramarDonacion() {

  // SWITCHES
  const [refrigeracion, setRefrigeracion] = useState(false);
  const [urgente, setUrgente] = useState(true);
  const [especial, setEspecial] = useState(false);

  // FECHA
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const [mesActual, setMesActual] = useState(9);
  const [anioActual, setAnioActual] = useState(2024);

  // DÍA
  const [diaSeleccionado, setDiaSeleccionado] = useState(9);

  // HORARIO
  const [horarioSeleccionado, setHorarioSeleccionado] =
    useState("10:00 – 12:00");

  return (

    <div className="programar-page">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div>

          <h1 className="logo">
            Lumera
          </h1>

          <p className="subtitle">
            
          </p>

          <nav className="menu">

            <div className="menu-item">
              <LayoutDashboard size={18} />
              Dashboard
            </div>

            <div className="menu-item active">
              <HandHeart size={18} />
              Donaciones
            </div>

            <div className="menu-item">
              <Users size={18} />
              Beneficiarios
            </div>

            <div className="menu-item">
              <Settings size={18} />
              Configuracion
            </div>

          </nav>

        </div>

        <div className="sidebar-bottom">

          <button className="impact-btn">
            Reporte de impacto
          </button>

          <div className="bottom-link">
            <LogOut size={16} />
            Cerrar sesión
          </div>

        </div>

      </aside>

      {/* MAIN */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">

          <h2>
            Programar donación
          </h2>

          <div className="top-actions">

            <input placeholder="Search..." />

            <Bell size={18} />

            <HelpCircle size={18} />

            <img
              className="profile"
              src="https://i.pravatar.cc/100"
              alt=""
            />

          </div>

        </header>

        {/* CONTENT */}
        <div className="content-grid">

          {/* LEFT */}
          <div className="left-column">

            {/* CALENDAR */}
            <section className="card">

              <div className="card-title">
                <CalendarDays size={18} />
                <h3>Fecha de entrega</h3>
              </div>

              <div className="calendar-box">

                <div className="calendar-header">

                  <span>
                    {meses[mesActual]} {anioActual}
                  </span>

                  <div className="calendar-arrows">

                    <span
                      onClick={() => {

                        if (mesActual === 0) {
                          setMesActual(11);
                          setAnioActual(anioActual - 1);
                        } else {
                          setMesActual(mesActual - 1);
                        }

                      }}
                    >
                      ‹
                    </span>

                    <span
                      onClick={() => {

                        if (mesActual === 11) {
                          setMesActual(0);
                          setAnioActual(anioActual + 1);
                        } else {
                          setMesActual(mesActual + 1);
                        }

                      }}
                    >
                      ›
                    </span>

                  </div>

                </div>

                <div className="calendar-days">
                  <span>Lu</span>
                  <span>Ma</span>
                  <span>Mi</span>
                  <span>Ju</span>
                  <span>Vi</span>
                  <span>Sa</span>
                  <span>Do</span>
                </div>

                <div className="calendar-grid">

                  <span className="muted">26</span>
                  <span className="muted">27</span>
                  <span className="muted">28</span>
                  <span className="muted">29</span>
                  <span className="muted">30</span>

                  {[
                    1,2,3,4,5,
                    6,7,8,9,10,
                    11,12,13,14,15,
                    16,17,18,19,20,
                    21,22,23,24,25
                  ].map((dia) => (

                    <span
                      key={dia}
                      className={
                        diaSeleccionado === dia
                          ? "active-day"
                          : ""
                      }
                      onClick={() =>
                        setDiaSeleccionado(dia)
                      }
                    >
                      {dia}
                    </span>

                  ))}

                </div>

              </div>

            </section>

            {/* CONDITIONS */}
            <section className="card">

              <div className="card-title">
                <CircleAlert size={18} />
                <h3>Condiciones de la donación</h3>
              </div>

              {/* SWITCH 1 */}
              <div className="switch-row">

                <span>
                  Requiere refrigeración
                </span>

                <div
                  className={`switch ${refrigeracion ? "active" : ""}`}
                  onClick={() =>
                    setRefrigeracion(!refrigeracion)
                  }
                ></div>

              </div>

              {/* SWITCH 2 */}
              <div className="switch-row">

                <span>
                  Entrega urgente
                </span>

                <div
                  className={`switch ${urgente ? "active" : ""}`}
                  onClick={() =>
                    setUrgente(!urgente)
                  }
                ></div>

              </div>

              {/* SWITCH 3 */}
              <div className="switch-row">

                <span>
                  Manejo especial
                </span>

                <div
                  className={`switch ${especial ? "active" : ""}`}
                  onClick={() =>
                    setEspecial(!especial)
                  }
                ></div>

              </div>

              <div className="textarea-box">

                <label>
                  Notas adicionales
                </label>

                <textarea
                  placeholder="Ej: Fragilidad, instrucciones de acceso..."
                />

              </div>

            </section>

          </div>

          {/* RIGHT */}
          <div className="right-column">

            {/* TIME */}
            <section className="card">

              <div className="card-title">
                <Clock3 size={18} />
                <h3>Horario disponible</h3>
              </div>

              <div className="time-grid">

                {[
                  "08:00 – 10:00",
                  "10:00 – 12:00",
                  "12:00 – 14:00",
                  "14:00 – 16:00",
                ].map((hora) => (

                  <button
                    key={hora}
                    className={
                      horarioSeleccionado === hora
                        ? "active-time"
                        : ""
                    }
                    onClick={() =>
                      setHorarioSeleccionado(hora)
                    }
                  >
                    {hora}
                  </button>

                ))}

              </div>

              <p className="helper-text">
                Seleccione un bloque de 2 horas
              </p>

            </section>

            {/* SUMMARY */}
            <section className="card summary-card">

              <h3>
                Resumen de programación
              </h3>

              <div className="summary-row">

                <span>
                  Fecha seleccionada
                </span>

                <strong>
                  {diaSeleccionado} de {meses[mesActual]}, {anioActual}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Rango horario
                </span>

                <strong>
                  {horarioSeleccionado}
                </strong>

              </div>

              <div className="summary-row column">

                <span>
                  Condiciones activas
                </span>

                {refrigeracion && (
                  <div className="badge">
                    Refrigeración
                  </div>
                )}

                {urgente && (
                  <div className="badge">
                    Entrega urgente
                  </div>
                )}

                {especial && (
                  <div className="badge">
                    Manejo especial
                  </div>
                )}

              </div>

              <button className="confirm-btn">

                Confirmar programación

                <SendHorizonal size={18} />

              </button>

              <p className="mini-text">
                Al confirmar, la logística de Lumera
                asignará un transportista para la recolección.
              </p>

            </section>

            {/* LOGISTICS */}
            <section className="card logistic-card">

              <div className="live-dot"></div>

              <div>

                <h4>
                  Logística Activa
                </h4>

                <p>
                  4 donaciones en curso cerca de tu ubicación.
                </p>

              </div>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}