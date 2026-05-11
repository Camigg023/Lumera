export type Company = {
  id: string; // mismo que uid del usuario
  userId: string; // referencia al usuario propietario
  name: string;
  nit: string;
  legalRepresentative: string;
  phone: string;
  email: string;
  address: string;
  sector?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
};