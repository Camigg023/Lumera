import { RegisterData } from '../entities/RegisterData';

export interface AuthRegisterRepository {
  signUpWithEmailPassword(data: RegisterData): Promise<void>;
}
