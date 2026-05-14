import type { DeliveryPoint, EligibilityCycle } from "../../domain/entities";

const mockPoints: DeliveryPoint[] = [
  {
    id: "central-hub",
    name: "Central Community Hub",
    status: "active",
    statusLabel: "Currently Active",
    location: {
      address: "422 Madison Ave",
      distanceMiles: 0.8,
      distanceLabel: "0.8 miles away",
    },
    schedule: {
      label: "Today, 2:00 PM — 6:00 PM",
      nextWindow: "Today",
    },
    capacity: null,
    icon: "hub",
    iconBgClass: "bg-indigo-50",
    iconColorClass: "text-primary-container",
    isPrimary: true,
  },
  {
    id: "northside-pantry",
    name: "Northside Pantry",
    status: "high_demand",
    statusLabel: "High Demand",
    location: {
      address: "1201 N Broadway",
      distanceMiles: 2.4,
      distanceLabel: "2.4 miles away",
    },
    schedule: null,
    capacity: {
      totalSlots: 21,
      remainingSlots: 12,
      avatarCount: 9,
    },
    icon: "store",
    iconBgClass: "bg-purple-50",
    iconColorClass: "text-secondary",
    isPrimary: false,
  },
];

const mockCycle: EligibilityCycle = {
  daysRemaining: 4,
  currentDay: 11,
  totalDays: 15,
  progressPercent: 73.3,
  nextDate: "Oct 27",
  nextDateFull: "Friday, Oct 27th",
};

export class DeliveryPointDatasource {
  async fetchPoints(_query?: string): Promise<DeliveryPoint[]> {
    await new Promise((r) => setTimeout(r, 450));
    return mockPoints;
  }

  async selectPoint(_id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
  }

  async fetchPoint(id: string): Promise<DeliveryPoint> {
    await new Promise((r) => setTimeout(r, 200));
    const found = mockPoints.find((p) => p.id === id);
    if (!found) throw new Error(`Point ${id} not found`);
    return found;
  }

  async fetchCycle(): Promise<EligibilityCycle> {
    await new Promise((r) => setTimeout(r, 300));
    return mockCycle;
  }
}
