/**
 * Script para poblar la colección "roles" en Firestore.
 *
 * Ejecutar una sola vez para inicializar los roles del sistema.
 *
 * Uso desde la app:
 *   1. Ve al dashboard de Super Admin
 *   2. Abre la consola del navegador (F12)
 *   3. Ejecuta:
 *        import('./scripts/seedRoles.js')
 *          .then(m => m.seedRoles())
 *          .then(() => console.log('Roles creados'))
 *          .catch(console.error)
 *
 * O desde el código:
 *   import { seedRoles } from './scripts/seedRoles';
 *   await seedRoles();
 */
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface RoleSeed {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  dashboardComponent: string;
  defaultView: string;
  level: number;
  isActive: boolean;
}

const ROLES_DATA: RoleSeed[] = [
  {
    id: 'donador',
    name: 'Donador',
    description: 'Persona que realiza donaciones de alimentos',
    permissions: [
      'donar',
      'ver_historial',
      'ver_beneficiarios',
      'ver_donaciones_propias',
      'ver_beneficios',
    ],
    dashboardComponent: 'DonadorDashboard',
    defaultView: 'inicio',
    level: 1,
    isActive: true,
  },
  {
    id: 'beneficiario',
    name: 'Beneficiario',
    description: 'Persona u organización que recibe donaciones',
    permissions: [
      'solicitar_ayuda',
      'ver_historial',
      'ver_entregas',
      'ver_perfil_propio',
    ],
    dashboardComponent: 'BeneficiarioDashboard',
    defaultView: 'inicio',
    level: 2,
    isActive: true,
  },
  {
    id: 'empresa',
    name: 'Empresa',
    description: 'Empresa que participa en la red de donación y logística',
    permissions: [
      'gestionar_inventario',
      'ver_donaciones',
      'gestionar_recoleccion',
      'ver_reportes',
      'gestionar_perfil',
    ],
    dashboardComponent: 'EmpresaDashboard',
    defaultView: 'inicio',
    level: 3,
    isActive: true,
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Administrador del sistema con acceso completo',
    permissions: [
      'ver_beneficiarios',
      'aprobar_beneficiarios',
      'rechazar_beneficiarios',
      'ver_usuarios',
      'gestionar_roles',
      'ver_todas_donaciones',
      'gestionar_empresas',
      'ver_reportes_globales',
      'configurar_sistema',
    ],
    dashboardComponent: 'SuperAdminDashboard',
    defaultView: 'beneficiarios',
    level: 999,
    isActive: true,
  },
];

/**
 * Crea/actualiza todos los roles en Firestore.
 * Ejecutar una sola vez al iniciar el proyecto o al agregar nuevos roles.
 */
export async function seedRoles(): Promise<void> {
  console.log('[seedRoles] Iniciando siembra de roles...');

  for (const role of ROLES_DATA) {
    const docRef = doc(db, 'roles', role.id);
    await setDoc(docRef, {
      ...role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log(`[seedRoles] Rol "${role.id}" creado/actualizado.`);
  }

  console.log('[seedRoles] Siembra completada.');
}

// Permitir ejecución directa desde consola del navegador
if (typeof window !== 'undefined') {
  (window as any).seedRoles = seedRoles;
}
