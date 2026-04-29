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

    } catch (error) {
      throw new Error("Registration failed: " + (error as Error).message);
    }
  }
}
