import { useState, useEffect, useMemo } from 'react';

import { doc, getDoc } from 'firebase/firestore';
import { Role, roleService } from '../../../services/roleService';
import { auth, db } from '../../../config/firebase';

/**
 * Hook para obtener y gestionar roles desde Firestore.
 * 
 * Útil para:
 * - Validar permisos en componentes
 * - Obtener metadatos del rol del usuario actual
 * - Listar roles disponibles
 * - Verificar si un usuario puede hacer X acción
 * 
 * @example
 * const { userRole, permissions, canApprove, isLoading } = useRoles();
 * 
 * if (canApprove) {
 *   // mostrar botón de aprobar
 * }
 */
export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRolesAndUserRole();
  }, []);

  /**
   * Carga todos los roles y el rol del usuario autenticado.
   */
  async function loadRolesAndUserRole() {
    setLoading(true);
    setError(null);
    try {
      // Cargar todos los roles activos
      const allRoles = await roleService.getAllRoles();
      setRoles(allRoles);

      // Cargar el rol del usuario autenticado
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const roleId = userData.role;
          if (roleId) {
            const role = allRoles.find((r) => r.id === roleId) || await roleService.getRole(roleId);
            setUserRole(role);
          }
        }
      }
    } catch (err) {
      console.error('[useRoles] Error:', err);
      setError('Error al cargar roles.');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Lista de permisos del rol del usuario actual.
   */
  const permissions = useMemo(() => {
    return userRole?.permissions || [];
  }, [userRole]);

  /**
   * Verifica si el usuario actual tiene un permiso específico.
   */
  const can = useMemo(
    () => ({
      /** Verifica si tiene un permiso específico */
      do: (permission: string): boolean => permissions.includes(permission),

      /** Atajos de permisos comunes */
      approveBeneficiaries: permissions.includes('aprobar_beneficiarios'),
      manageRoles: permissions.includes('gestionar_roles'),
      viewUsers: permissions.includes('ver_usuarios'),
      viewBeneficiaries: permissions.includes('ver_beneficiarios'),
      manageInventory: permissions.includes('gestionar_inventario'),
      viewReports: permissions.includes('ver_reportes'),

      /** Verifica si el usuario es super-admin */
      isSuperAdmin: userRole?.id === 'admin',

      /** Verifica si el usuario tiene nivel >= al solicitado */
      hasLevel: (minLevel: number): boolean => (userRole?.level || 0) >= minLevel,
    }),
    [permissions, userRole]
  );

  return {
    /** Lista de todos los roles activos */
    roles,
    /** Rol del usuario autenticado */
    userRole,
    /** Array plano de permisos del usuario */
    permissions,
    /** Objeto con verificaciones rápidas de permisos */
    can,
    /** Indica si está cargando */
    loading,
    /** Error si ocurrió alguno */
    error,
    /** Recarga roles y rol del usuario */
    reload: loadRolesAndUserRole,
  };
}
