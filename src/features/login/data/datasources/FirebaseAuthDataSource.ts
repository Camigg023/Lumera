import {
  signOut as firebaseSignOut,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "../../../../config/firebase";
import { User } from "../../domain/entities/User";

export class FirebaseAuthDataSource {
  private readonly auth = getAuth(app);

  async signInWithEmailPassword(
    email: string,
    password: string,
  ): Promise<User> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      const u = cred.user;
      return {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
      };
    } catch (error) {
      throw new Error("Authentication failed: " + (error as Error).message);
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth);
  }
}
