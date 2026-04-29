import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../config/firebase";

export class AuthRegisterDataSource {

  async signUpWithEmailPassword(
    email: string,
    password: string,
    role: string,
    name: string
  ): Promise<void> {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const u = cred.user;
      
      await setDoc(doc(db, "users", u.uid), {
        uid: u.uid,
        email: u.email,
        name: name,
        role: role,
        createdAt: new Date().toISOString()
      });

    } catch (error) {
      throw new Error("Registration failed: " + (error as Error).message);
    }
  }
}
