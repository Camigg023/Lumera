import { useState, useEffect } from 'react';
import { useRegister } from '../hooks/useRegister';
import { roleService, Role } from '../../../../services/roleService';
import styles from './RegisterForm.module.css';

export type RoleType = "donador" | "empresa" | "beneficiario";

export const RegisterForm = ({ role, onRoleChange, onSuccess, roleHeader }: { role: RoleType; onRoleChange: (r: RoleType) => void; onSuccess?: any; roleHeader?: React.ReactNode }) => {
  const { signUp, isLoading, error } = useRegister();
  const [firestoreRoles, setFirestoreRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Cargar roles desde Firestore
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await roleService.getAllRoles();
        // Filtrar solo roles disponibles para registro público (excluir super-admin)
        const publicRoles = roles.filter(r => r.id !== 'super-admin');
        setFirestoreRoles(publicRoles);
      } catch (err) {
        console.error('[RegisterForm] Error al cargar roles:', err);
        // Fallback a roles por defecto
        setFirestoreRoles([
          { id: 'donador', name: 'Donador', description: 'Persona que realiza donaciones', permissions: [], dashboardComponent: '', defaultView: 'inicio', level: 1, isActive: true },
          { id: 'empresa', name: 'Empresa', description: 'Empresa que participa en la red', permissions: [], dashboardComponent: '', defaultView: 'inicio', level: 2, isActive: true },
          { id: 'beneficiario', name: 'Beneficiario', description: 'Persona que recibe donaciones', permissions: [], dashboardComponent: '', defaultView: 'inicio', level: 3, isActive: true },
        ]);
      } finally {
        setRolesLoading(false);
      }
    };
    loadRoles();
  }, []);

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

      {/* ─── SELECTOR DE ROLES (desde Firestore) ─── */}
      <div className={styles.roles}>
        {rolesLoading ? (
          <div className="text-sm text-gray-400 py-4 text-center w-full">Cargando roles...</div>
        ) : (
          firestoreRoles.map((r) => (
            <div
              key={r.id}
              className={`${styles.roleCard} ${role === r.id ? styles.active : ''}`}
              onClick={() => onRoleChange(r.id as RoleType)}
            >
              <span>{r.name}</span>
              <small className="text-[10px] opacity-60 block mt-0.5">{r.description}</small>
            </div>
          ))
        )}
      </div>

      {/* ─── OVERLAY DE ROL (debajo del selector) ─── */}
      {roleHeader}

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
