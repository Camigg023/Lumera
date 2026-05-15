/**
 * Archivo centralizado de rutas y navegación para Lumera.
 *
 * Define los tipos de pantalla, roles, y el mapeo a componentes.
 * La navegación se maneja por estado (screen + role) en App.jsx.
 */

// ─────────────────────────── TIPOS ───────────────────────────

/** Pantallas públicas (sin autenticación) */
export type ScreenPublic = 'home' | 'login' | 'register' | 'password-recovery';

/** Pantalla interna del dashboard (requiere autenticación) */
export type ScreenDashboard = 'dashboard';

/** Todas las pantallas del sistema */
export type Screen = ScreenPublic | ScreenDashboard;

/** Roles de usuario en el sistema */
export type UserRole = 'donador' | 'empresa' | 'beneficiario' | 'super-admin';

// ─────────────────────── CONFIGURACIÓN ───────────────────────

/** Metadatos de cada rol */
export interface RoleConfig {
  label: string;
  description: string;
  icon: string;
  defaultView: string;
}

/** Mapeo de roles a configuración */
export const ROLES: Record<UserRole, RoleConfig> = {
  donador: {
    label: 'Donador',
    description: 'Persona que realiza donaciones de alimentos',
    icon: 'volunteer_activism',
    defaultView: 'inicio',
  },
  empresa: {
    label: 'Empresa',
    description: 'Empresa que participa en la red de donación',
    icon: 'business',
    defaultView: 'inicio',
  },
  beneficiario: {
    label: 'Beneficiario',
    description: 'Organización que recibe las donaciones',
    icon: 'groups',
    defaultView: 'inicio',
  },
  'super-admin': {
    label: 'Super Admin',
    description: 'Administrador del sistema',
    icon: 'admin_panel_settings',
    defaultView: 'beneficiarios',
  },
};

/** Metadatos de cada pantalla pública */
export interface ScreenConfig {
  label: string;
  requiresAuth: boolean;
  allowedRoles?: UserRole[];
}

/** Mapeo de pantallas a configuración */
export const SCREENS: Record<Screen, ScreenConfig> = {
  home: { label: 'Inicio', requiresAuth: false },
  login: { label: 'Iniciar sesión', requiresAuth: false },
  register: { label: 'Crear cuenta', requiresAuth: false },
  'password-recovery': { label: 'Recuperar contraseña', requiresAuth: false },
  dashboard: { label: 'Dashboard', requiresAuth: true, allowedRoles: ['donador', 'empresa', 'beneficiario', 'super-admin'] },
};

// ─────────────────────── HELPER FUNCTIONS ───────────────────────

/**
 * Valida si un rol está permitido para una pantalla.
 */
export function isRoleAllowedForScreen(role: UserRole, screen: Screen): boolean {
  const config = SCREENS[screen];
  if (!config.allowedRoles) return true; // pantalla pública
  return config.allowedRoles.includes(role);
}

/**
 * Obtiene el título de un rol para mostrar en UI.
 */
export function getRoleLabel(role: UserRole): string {
  return ROLES[role]?.label ?? role;
}

/**
 * Retorna la lista de roles válidos del sistema.
 */
export function getValidRoles(): UserRole[] {
  return Object.keys(ROLES) as UserRole[];
}

/**
 * Verifica si un string es un rol válido.
 */
export function isValidRole(value: string): value is UserRole {
  return getValidRoles().includes(value as UserRole);
}

/**
 * Verifica si un string es una pantalla válida.
 */
export function isValidScreen(value: string): value is Screen {
  return Object.keys(SCREENS).includes(value);
}
