import { useState } from "react";

const styles = {
  card: "",
  cardTitle: "",
  input: "",
  saveButton: "",
};

export function DonadorProfile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Mi Perfil</h2>

      <input
        className={styles.input}
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className={styles.input}
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        className={styles.input}
        placeholder="Dirección"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button className={styles.saveButton}>
        Guardar
      </button>
    </div>
  );
}