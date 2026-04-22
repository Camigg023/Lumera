import { Company } from '../../domain/entities/Company';

// Datos mock de empresas
const mockCompanies: Company[] = [
  {
    id: 'comp1',
    userId: 'user1',
    name: 'Alimentos S.A.',
    nit: '900123456-7',
    legalRepresentative: 'Carlos López',
    phone: '+57 300 1112233',
    email: 'contacto@alimentossa.com',
    address: 'Carrera 80 # 25-15, Medellín',
    sector: 'Alimentos y bebidas',
    website: 'https://alimentossa.com',
    logoUrl: null,
    description: 'Empresa dedicada a la producción de alimentos no perecederos.',
    verificationStatus: 'verified',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-15T14:30:00Z',
  },
  {
    id: 'comp2',
    userId: 'user4',
    name: 'Distribuciones Medellín',
    nit: '800987654-3',
    legalRepresentative: 'María Gómez',
    phone: '+57 303 1234567',
    email: 'info@distrimedellin.com',
    address: 'Transversal 30 # 45-67, Medellín',
    sector: 'Logística',
    website: 'https://distrimedellin.com',
    logoUrl: null,
    description: 'Cadena de distribución de alimentos a nivel regional.',
    verificationStatus: 'pending',
    createdAt: '2026-04-05T10:20:00Z',
    updatedAt: '2026-04-05T10:20:00Z',
  },
];

export class CompanyDataSource {
  private companies: Company[] = [...mockCompanies];

  async getCompany(userId: string): Promise<Company> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const company = this.companies.find(c => c.userId === userId);
    if (!company) {
      // Si no existe, creamos una empresa mock para este usuario (simulación)
      const newCompany: Company = {
        id: `comp_${userId}`,
        userId,
        name: 'Mi Empresa',
        nit: '',
        legalRepresentative: '',
        phone: '',
        email: '',
        address: '',
        verificationStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.companies.push(newCompany);
      return { ...newCompany };
    }
    return { ...company };
  }

  async updateCompany(userId: string, updates: Partial<Company>): Promise<Company> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.companies.findIndex(c => c.userId === userId);
    if (index === -1) {
      throw new Error(`Company for user ${userId} not found`);
    }
    this.companies[index] = {
      ...this.companies[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.companies[index] };
  }

  async verifyCompany(userId: string, status: 'verified' | 'rejected'): Promise<Company> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.companies.findIndex(c => c.userId === userId);
    if (index === -1) {
      throw new Error(`Company for user ${userId} not found`);
    }
    this.companies[index] = {
      ...this.companies[index],
      verificationStatus: status,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.companies[index] };
  }

  async listCompanies(): Promise<Company[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...this.companies];
  }
}