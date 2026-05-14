// Courier entity
export interface Courier {
  id: string;
  name: string;
  logoColor: string;
}

// PackageInfo entity
export interface PackageInfo {
  contents: string;
  weightKg: number;
}

// DeliveryStatus enum
export type DeliveryStatus = "pending" | "picked_up" | "in_transit" | "arrived" | "delivered";

// DeliveryStep entity
export interface DeliveryStep {
  id: string;
  label: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  time: string;
  icon: string;
  hasMap?: boolean;
}

// EligibilityCycle entity
export interface EligibilityCycle {
  totalDays: number;
  completedDays: number;
  remainingDays: number;
  nextWindowDate: string;
}

// Delivery entity
export interface Delivery {
  id: string;
  trackingNumber: string;
  status: DeliveryStatus;
  progressPercent: number;
  estimatedArrival: string;
  courier: Courier;
  packageInfo: PackageInfo;
  steps: DeliveryStep[];
  eligibilityCycle: EligibilityCycle;
}
