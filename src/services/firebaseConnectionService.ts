import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  limit, 
  query, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Interface for the connection validation result
 */
export interface FirebaseConnectionResult {
  success: boolean;
  message: string;
  error?: string;
  code?: string;
  warning?: string;
  details?: any;
}

/**
 * Service to validate the Firebase connection and configuration.
 * Performs a lightweight read/write operation to ensure the SDK is correctly configured,
 * the network is reachable, and the project is initialized.
 */
export const validateFirebaseConnection = async (): Promise<FirebaseConnectionResult> => {
  try {
    // 1. Basic configuration check
    const requiredEnvVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !import.meta.env[varName]
    );

    if (missingVars.length > 0) {
      return {
        success: false,
        message: 'Error de configuración local',
        error: `Faltan variables de entorno: ${missingVars.join(', ')}`,
        code: 'config/missing-variables'
      };
    }

    // 2. Connectivity and Initialization check
    // We check for a system document. If it doesn't exist, we create it.
    // This validates READ and WRITE permissions.
    const sysConfigRef = doc(db, '_system_', 'status');
    
    try {
      const sysSnap = await getDoc(sysConfigRef);

      if (!sysSnap.exists()) {
        console.log("[Firebase] Inicializando estructura base por primera vez...");
        await setDoc(sysConfigRef, {
          initialized: true,
          lastCheck: serverTimestamp(),
          description: "Documento generado automáticamente para validar la conexión y permisos."
        });
      } else {
        // Opcional: Actualizar el heartbeat
        await setDoc(sysConfigRef, { 
          lastCheck: serverTimestamp() 
        }, { merge: true });
      }
    } catch (dbError: any) {
      // Si falla aquí, capturamos el error específico de base de datos
      if (dbError.code === 'permission-denied') {
        return {
          success: true,
          message: 'Conexión exitosa',
          warning: 'No se pudo validar la base de datos (Permiso denegado). Asegúrate de que las reglas de Firestore permitan el acceso.'
        };
      }
      throw dbError; // Otros errores van al catch general
    }

    return {
      success: true,
      message: 'Firebase está conectado e inicializado correctamente'
    };
  } catch (error: any) {
    console.error('[FirebaseConnectionService] Validation failed:', error);

    let userFriendlyMessage = 'Error inesperado al conectar con Firebase';
    let errorCode = error.code || 'unknown';

    switch (errorCode) {
      case 'auth/invalid-api-key':
        userFriendlyMessage = 'La API Key de Firebase es inválida. Verifica el archivo .env';
        break;
      case 'unavailable':
        userFriendlyMessage = 'El servicio de Firebase no está disponible. Revisa tu conexión a internet.';
        break;
      case 'resource-exhausted':
        userFriendlyMessage = 'Se ha excedido la cuota del proyecto Firebase.';
        break;
      default:
        if (error.message?.toLowerCase().includes('network')) {
          userFriendlyMessage = 'Error de red: No se pudo contactar con los servidores de Firebase.';
        } else {
          userFriendlyMessage = `Error de conexión (${errorCode}): ${error.message}`;
        }
    }

    return {
      success: false,
      message: 'Fallo en la validación de Firebase',
      error: userFriendlyMessage,
      code: errorCode,
      details: error
    };
  }
};
