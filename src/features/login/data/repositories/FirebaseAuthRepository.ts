import type { User } from "../../domain/entities/User";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";
import { FirebaseAuthDataSource } from "../datasources/FirebaseAuthDataSource";

export class FirebaseAuthRepository implements AuthRepository {
  constructor(private readonly ds: FirebaseAuthDataSource) {}
  logout(_id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async signInWithEmailPassword(
    email: string,
    password: string,
  ): Promise<User> {
    const dto = await this.ds.signInWithEmailPassword(email, password);

    if (!dto.uid || !dto.email) {
      throw new Error("Invalid user data");
    }
    return dto;
  }

  signOut(): Promise<void> {
    return this.ds.signOut();
  }
}
