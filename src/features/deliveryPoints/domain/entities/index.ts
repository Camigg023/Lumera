// PointStatus — availability state of a delivery point
export type PointStatus = "active" | "high_demand" | "full" | "upcoming" | "closed";

// Location — geo + display info
export interface Location {
  address: string;
  distanceMiles: number;
  distanceLabel: string;  // e.g. "0.8 miles away"
}

// Schedule — pickup window
export interface Schedule {
  label: string;         // e.g. "Today, 2:00 PM — 6:00 PM"
  nextWindow: string;    // short form e.g. "Today"
}

// Capacity — slot availability
export interface Capacity {
  totalSlots: number;
  remainingSlots: number;
  avatarCount: number;  // filled slots shown as avatars
}

// DeliveryPoint — aggregate root
export interface DeliveryPoint {
  id: string;
  name: string;
  status: PointStatus;
  statusLabel: string;         // human-readable badge text
  location: Location;
  schedule: Schedule | null;   // null when no window info
  capacity: Capacity | null;   // null when not slot-based
  icon: string;                // Material Symbol name
  iconBgClass: string;         // e.g. "bg-indigo-50"
  iconColorClass: string;      // e.g. "text-primary-container"
  isPrimary: boolean;          // highlights primary border style
}

// EligibilityCycle — sidebar state
export interface EligibilityCycle {
  daysRemaining: number;
  currentDay: number;
  totalDays: number;
  progressPercent: number;
  nextDate: string;       // e.g. "Oct 27"
  nextDateFull: string;   // e.g. "Friday, Oct 27th"
}
