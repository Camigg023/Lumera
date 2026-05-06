import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../config/firebase";
import { RegisterData } from "../../domain/entities/RegisterData";

export class AuthRegisterDataSource {

  async signUpWithEmailPassword(data: RegisterData): Promise<void> {
    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password!);
      const u = cred.user;
      
      const userData = {
        uid: u.uid,
        email: u.email,
        name: data.name,
        role: data.role,
        telefono: data.telefono,
        direccion: data.direccion,
        ciudad: data.ciudad,
        createdAt: new Date().toISOString(),
        ...(data.role === "empresa" && { nit: data.nit, capacidad: data.capacidad }),
        ...(data.role === "beneficiario" && { cedula: data.cedula }),
      };

      await setDoc(doc(db, "users", u.uid), userData);

    } catch (error: any) {
      console.error("Error original de Firebase:", error);
      
      let errorMessage = "Fallo en el registro";
      
      if (error.message?.includes("CONFIGURATION_NOT_FOUND")) {
        errorMessage = "El método de autenticación por Email/Contraseña no está habilitado en Firebase Console. Por favor, ve a Authentication > Sign-in method y habilítalo.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este correo electrónico ya está registrado.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es muy débil. Debe tener al menos 6 caracteres.";
      } else {
        errorMessage = `Error: ${error.message || "Error desconocido"}`;
      }
      
      throw new Error(errorMessage);
    }
  }
}
