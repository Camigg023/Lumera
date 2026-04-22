import { Profile } from '../../domain/entities/Profile';

// Datos mock iniciales
const mockProfile: Profile = {
  uid: 'user123',
  email: 'usuario@ejemplo.com',
  displayName: 'Usuario Ejemplo',
  photoURL: null,
  phone: '+57 300 1234567',
  address: 'Calle 123, Medellín, Colombia',
  preferences: {
    notifications: true,
    language: 'es',
  },
};

export class ProfileDataSource {
  private profile: Profile = mockProfile;

  async getProfile(uid: string): Promise<Profile> {
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 300));
    if (this.profile.uid !== uid) {
      throw new Error('Profile not found');
    }
    return { ...this.profile };
  }

  async updateProfile(uid: string, updates: Partial<Profile>): Promise<Profile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (this.profile.uid !== uid) {
      throw new Error('Profile not found');
    }
    this.profile = { ...this.profile, ...updates };
    return { ...this.profile };
  }
}