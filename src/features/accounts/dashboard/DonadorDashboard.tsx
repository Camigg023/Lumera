import { useState } from "react";
import { DonadorProfile } from "../pages/DonadorProfile";
import AddProductsPanel from "../../addProducts/AddProductsPanel";
import styles from "./DonadorDashboard.module.css";

export function DonadorDashboard() {
  const [view, setView] = useState("inicio");
  const [creando, setCreando] = useState(false);

  const [donaciones, setDonaciones] = useState({
    bebidas: 0,
    granos: 0,
    enlatados: 0,
    energia: 0,
  });

  const sumar = (tipo: keyof typeof donaciones) => {
    if (!creando) return;

    setDonaciones((prev) => ({
      ...prev,
      [tipo]: prev[tipo] + 1,
    }));
  };

  const restar = (tipo: keyof typeof donaciones) => {
    if (!creando) return;

    setDonaciones((prev) => ({
      ...prev,
      [tipo]: prev[tipo] > 0 ? prev[tipo] - 1 : 0,
    }));
  };

  const reset = () => {
    setDonaciones({
      bebidas: 0,
      granos: 0,
      enlatados: 0,
      energia: 0,
    });
  };

  const guardar = () => {
    console.log("Donación guardada:", donaciones);
    reset();
    setCreando(false);
  };

  const total =
    donaciones.bebidas +
    donaciones.granos +
    donaciones.enlatados +
    donaciones.energia;

  return (
    <div className={styles.layout}>
      
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>LUMERA</h2>

        <nav className={styles.menu}>
          <p onClick={() => setView("inicio")}>🏠 Inicio</p>
          <p onClick={() => setView("donaciones")}>📦 Donaciones</p>
          <p onClick={() => setView("productos")}>📦 Productos</p>
          <p onClick={() => setView("perfil")}>👤 Perfil</p>
        </nav>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>

        {/* INICIO */}
        {view === "inicio" && (
          <>
            <div className={styles.header}>
              <h1 className={styles.title}>Registrar donación 🍱</h1>
              <p className={styles.subtitle}>
                Total productos: {total}
              </p>
            </div>

            {!creando && (
              <button
                className={styles.primaryCard}
                onClick={() => setCreando(true)}
              >
                ➕ Nueva donación
              </button>
            )}

            {creando && (
              <>
                <div className={styles.grid}>

                  <div className={styles.card}>
                    🥤 Bebidas
                    <div className={styles.counter}>
                      <button onClick={() => restar("bebidas")}>-</button>
                      <span>{donaciones.bebidas}</span>
                      <button onClick={() => sumar("bebidas")}>+</button>
                    </div>
                  </div>

                  <div className={styles.card}>
                    🌾 Granos
                    <div className={styles.counter}>
                      <button onClick={() => restar("granos")}>-</button>
                      <span>{donaciones.granos}</span>
                      <button onClick={() => sumar("granos")}>+</button>
                    </div>
                  </div>

                  <div className={styles.card}>
                    🥫 Enlatados
                    <div className={styles.counter}>
                      <button onClick={() => restar("enlatados")}>-</button>
                      <span>{donaciones.enlatados}</span>
                      <button onClick={() => sumar("enlatados")}>+</button>
                    </div>
                  </div>

                  <div className={styles.card}>
                    ⚡ Energía
                    <div className={styles.counter}>
                      <button onClick={() => restar("energia")}>-</button>
                      <span>{donaciones.energia}</span>
                      <button onClick={() => sumar("energia")}>+</button>
                    </div>
                  </div>

                </div>

                <button
                  className={styles.saveButton}
                  onClick={guardar}
                >
                  💾 Guardar donación
                </button>
              </>
            )}
          </>
        )}

        {/* PRODUCTOS - NUEVA FEATURE */}
        {view === "productos" && (
          <AddProductsPanel />
        )}

        {/* DONACIONES */}
        {view === "donaciones" && (
          <>
            <h1 className={styles.title}>Resumen de donaciones 📦</h1>

            <div className={styles.summaryCard}>
              <p>🥤 Bebidas: {donaciones.bebidas}</p>
              <p>🌾 Granos: {donaciones.granos}</p>
              <p>🥫 Enlatados: {donaciones.enlatados}</p>
              <p>⚡ Energía: {donaciones.energia}</p>

              <hr />
              <h3>Total: {total}</h3>
            </div>
          </>
        )}

        {/* PERFIL */}
        {view === "perfil" && <DonadorProfile />}

      </main>
    </div>
  );
}