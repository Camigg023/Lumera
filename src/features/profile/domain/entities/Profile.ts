export type Profile = {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  phone?: string;
  address?: string;
  preferences?: {
    notifications: boolean;
    language: 'es' | 'en';
  };
};