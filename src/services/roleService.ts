import { db } from '../config/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

/**
 * Estructura de un permiso individual.
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
}

/**
 * Estructura de un rol almacenado en Firestore.
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  dashboardComponent: string;
  defaultView: string;
  level: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Servicio centralizado para consultar roles desde Firestore.
 * Todas las consultas de roles y permisos pasan por aquí.
 *
 * Estructura en Firestore:
 *   /roles/{roleId}
 *     - id: string (donador, empresa, beneficiario, super-admin)
 *     - name: string
 *     - description: string
 *     - permissions: string[]
 *     - dashboardComponent: string
 *     - defaultView: string
 *     - level: number
 *     - isActive: boolean
 */
export const roleService = {
  /**
   * Obtiene un rol por su ID desde Firestore.
   * @param roleId - ID del rol (donador, empresa, beneficiario, super-admin)
   * @returns Promise con el rol o null si no existe
   */
  async getRole(roleId: string): Promise<Role | null> {
    try {
      const docRef = doc(db, 'roles', roleId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        description: data.description || '',
        permissions: data.permissions || [],
        dashboardComponent: data.dashboardComponent || '',
        defaultView: data.defaultView || 'inicio',
        level: data.level || 0,
        isActive: data.isActive ?? true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Role;
    } catch (error) {
      console.error(`[roleService] Error al obtener rol "${roleId}":`, error);
      throw new Error('Error al consultar el rol.');
    }
  },

  /**
   * Obtiene todos los roles activos desde Firestore.
   * @returns Promise con array de roles
   */
  async getAllRoles(): Promise<Role[]> {
    try {
      const q = query(
        collection(db, 'roles'),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || '',
          description: data.description || '',
          permissions: data.permissions || [],
          dashboardComponent: data.dashboardComponent || '',
          defaultView: data.defaultView || 'inicio',
          level: data.level || 0,
          isActive: data.isActive ?? true,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as Role;
      }).sort((a, b) => a.level - b.level); // Ordenar por nivel
    } catch (error) {
      console.error('[roleService] Error al obtener roles:', error);
      throw new Error('Error al consultar los roles.');
    }
  },

  /**
   * Verifica si un rol tiene un permiso específico.
   * @param roleId - ID del rol
   * @param permission - Permiso a verificar (ej: "aprobar_beneficiarios")
   * @returns Promise con booleano
   */
  async hasPermission(roleId: string, permission: string): Promise<boolean> {
    try {
      const role = await this.getRole(roleId);
      if (!role) return false;
      return role.permissions.includes(permission);
    } catch {
      return false;
    }
  },

  /**
   * Obtiene los permisos de un rol desde Firestore.
   * @param roleId - ID del rol
   * @returns Promise con array de permisos
   */
  async getPermissions(roleId: string): Promise<string[]> {
    try {
      const role = await this.getRole(roleId);
      return role?.permissions || [];
    } catch {
      return [];
    }
  },
};
