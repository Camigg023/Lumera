import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import styles from './RegisterForm.module.css';

export type RoleType = "donador" | "empresa" | "beneficiario";

export const RegisterForm = ({ role, onRoleChange, onSuccess }: { role: RoleType; onRoleChange: (r: RoleType) => void; onSuccess?: any }) => {
  const { signUp, isLoading, error } = useRegister();

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

    await signUp(data);
    onSuccess?.(role);
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>

      {/* ─── SELECTOR DE ROLES ─── */}
      <div className={styles.roles}>
        <div
          className={`${styles.roleCard} ${role === "donador" ? styles.active : ""}`}
          onClick={() => onRoleChange("donador")}
        >
          🤝
          <span>Donador</span>
        </div>

        <div
          className={`${styles.roleCard} ${role === "empresa" ? styles.active : ""}`}
          onClick={() => onRoleChange("empresa")}
        >
          🏢
          <span>Empresa</span>
        </div>

        <div
          className={`${styles.roleCard} ${role === "beneficiario" ? styles.active : ""}`}
          onClick={() => onRoleChange("beneficiario")}
        >
          👨‍👩‍👧
          <span>Beneficiario</span>
        </div>
      </div>

      {/* NOMBRE */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>
          {role === "empresa" ? "Nombre de la empresa" : "Nombre completo"}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={role === "empresa" ? "Ej: Mi Empresa S.A.S." : "Ej: Juan Pérez"}
          className={styles.input}
        />
      </div>

      {/* EMPRESA */}
      {role === "empresa" && (
        <>
          <div className={styles.inputGroup}>
            <label className={styles.label}>NIT</label>
            <input
              value={nit}
              onChange={(e) => setNit(e.target.value)}
              placeholder="Ej: 900.123.456-7"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Capacidad logística</label>
            <input
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
              placeholder="Ej: 500 kg/mes"
              className={styles.input}
            />
          </div>
        </>
      )}

      {/* BENEFICIARIO */}
      {role === "beneficiario" && (
        <div className={styles.inputGroup}>
          <label className={styles.label}>Cédula / Identificación</label>
          <input
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Ej: 1.234.567"
            className={styles.input}
          />
        </div>
      )}

      {/* TELÉFONO */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Teléfono</label>
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Ej: +57 300 123 4567"
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Dirección</label>
        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Ej: Cra 50 #10-20"
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Ciudad</label>
        <input
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          placeholder="Ej: Medellín"
          className={styles.input}
        />
      </div>

      {/* CORREO */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Correo electrónico</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Ej: usuario@correo.com"
          className={styles.input}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Contraseña</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Mínimo 6 caracteres"
          className={styles.input}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Crear cuenta'}
      </button>

    </form>
  );
};
