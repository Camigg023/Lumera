import {
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../../config/firebase";
import { User } from "../../domain/entities/User";

export class FirebaseAuthDataSource {

  async signInWithEmailPassword(
    email: string,
    password: string,
  ): Promise<User> {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const u = cred.user;
      
      // Fetch additional data from Firestore
      const userDoc = await getDoc(doc(db, "users", u.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      return {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        photoURL: u.photoURL,
        ...userData
      } as User;
    } catch (error) {
      throw new Error("Authentication failed: " + (error as Error).message);
    }
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }
}
