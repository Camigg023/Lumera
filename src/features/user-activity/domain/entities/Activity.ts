export type ActivityType =
  | 'donation_created'
  | 'donation_received'
  | 'profile_updated'
  | 'company_verified'
  | 'status_changed'
  | 'login'
  | 'logout';

export type Activity = {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  timestamp: string; // ISO string
  metadata?: Record<string, any>;
};