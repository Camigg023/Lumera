export interface RegisterData {
  role: "donador" | "empresa" | "beneficiario";
  name: string;
  email: string;
  password?: string; // Optional because we use it for Auth but maybe not for Firestore directly
  telefono: string;
  direccion: string;
  ciudad: string;
  nit?: string;
  capacidad?: string;
  cedula?: string;
}
