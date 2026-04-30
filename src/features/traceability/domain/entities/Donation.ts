export type DonationStatus = 'pending' | 'ready_for_pickup' | 'delivered';

export interface DonationTimelineStep {
  status: DonationStatus;
  label: string;
  date: string;
  isCompleted: boolean;
  icon: string;
}

export interface DonationDetail {
  id: string;
  donorName: string;
  beneficiaryName: string;
  date: string;
  status: DonationStatus;
  pickupLocation?: string;
  items: string[];
  timeline: DonationTimelineStep[];
}
