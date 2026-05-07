import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import styles from './RegisterForm.module.css';

export const RegisterForm = ({ onSuccess }: any) => {
  const { signUp, isLoading, error } = useRegister();

  const [role, setRole] = useState<"donador" | "empresa" | "beneficiario">("donador");

  // 🔹 CAMPOS GENERALES
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🔹 EMPRESA
  const [nit, setNit] = useState('');
  const [capacidad, setCapacidad] = useState('');

  // 🔹 BENEFICIARIO
  const [cedula, setCedula] = useState('');

  // 🔹 COMUNES
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      role,
      name,
      email,
      password,
      telefono,
      direccion,
      ciudad,
      ...(role === "empresa" && { nit, capacidad }),
      ...(role === "beneficiario" && { cedula }),
    };

    console.log("DATA ENVIADA:", data);

    await signUp(data);

    onSuccess?.();
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>

      {/* ROLES */}
      <div className={styles.roles}>
        <div
          className={`${styles.roleCard} ${role === "donador" ? styles.active : ""}`}
          onClick={() => setRole("donador")}
        >
          🤝
          <span>Donador</span>
        </div>

        <div
          className={`${styles.roleCard} ${role === "empresa" ? styles.active : ""}`}
          onClick={() => setRole("empresa")}
        >
          🏢
          <span>Empresa</span>
        </div>

        <div
          className={`${styles.roleCard} ${role === "beneficiario" ? styles.active : ""}`}
          onClick={() => setRole("beneficiario")}
        >
          👨‍👩‍👧
          <span>Beneficiario</span>
        </div>
      </div>

      <p className={styles.label}>INFORMACIÓN PERSONAL</p>

      {/* NOMBRE */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={role === "empresa" ? "Nombre de la empresa" : "Nombre completo"}
        className={styles.input}
      />

      {/* EMPRESA */}
      {role === "empresa" && (
        <>
          <input
            value={nit}
            onChange={(e) => setNit(e.target.value)}
            placeholder="NIT"
            className={styles.input}
          />

          <input
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            placeholder="Capacidad logística"
            className={styles.input}
          />
        </>
      )}

      {/* BENEFICIARIO */}
      {role === "beneficiario" && (
        <input
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          placeholder="Cédula"
          className={styles.input}
        />
      )}

      {/* COMUNES */}
      <input
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Teléfono"
        className={styles.input}
      />

      <input
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        placeholder="Dirección"
        className={styles.input}
      />

      <input
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
        placeholder="Ciudad"
        className={styles.input}
      />

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo"
        className={styles.input}
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Contraseña"
        className={styles.input}
      />

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button}>
        {isLoading ? 'Registrando...' : 'Registrar'}
      </button>

    </form>
  );
};