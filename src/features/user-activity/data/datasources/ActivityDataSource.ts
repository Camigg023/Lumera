import { Activity, ActivityType } from '../../domain/entities/Activity';

const mockActivities: Activity[] = [
  {
    id: 'act1',
    userId: 'user123',
    type: 'donation_created',
    description: 'Donación de 50 kg de arroz registrada',
    timestamp: '2026-04-20T14:30:00Z',
    metadata: { product: 'Arroz', quantity: '50 kg' },
  },
  {
    id: 'act2',
    userId: 'user123',
    type: 'status_changed',
    description: 'Estado de donación cambiado a "En proceso"',
    timestamp: '2026-04-20T15:45:00Z',
    metadata: { donationId: 'don123', newStatus: 'En proceso' },
  },
  {
    id: 'act3',
    userId: 'user123',
    type: 'profile_updated',
    description: 'Perfil de usuario actualizado',
    timestamp: '2026-04-19T10:20:00Z',
  },
  {
    id: 'act4',
    userId: 'user123',
    type: 'login',
    description: 'Inicio de sesión exitoso',
    timestamp: '2026-04-19T09:00:00Z',
    metadata: { device: 'Chrome on macOS' },
  },
  {
    id: 'act5',
    userId: 'user123',
    type: 'company_verified',
    description: 'Perfil de empresa verificado por administrador',
    timestamp: '2026-04-18T16:15:00Z',
  },
  {
    id: 'act6',
    userId: 'user123',
    type: 'donation_received',
    description: 'Donación recibida por beneficiario',
    timestamp: '2026-04-17T12:00:00Z',
    metadata: { beneficiary: 'Comedor Solidario' },
  },
];

export class ActivityDataSource {
  private activities: Activity[] = [...mockActivities];

  async getActivitiesByUser(userId: string): Promise<Activity[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.activities.filter(a => a.userId === userId).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newActivity: Activity = {
      ...activity,
      id: `act_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.activities.push(newActivity);
    return newActivity;
  }
}