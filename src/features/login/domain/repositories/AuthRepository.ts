import type { User } from "../entities/User";

export interface AuthRepository {
  signInWithEmailPassword(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
}
