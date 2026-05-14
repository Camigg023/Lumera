import type { Delivery, DeliveryStep, EligibilityCycle } from "../../domain/entities";

const mockSteps: DeliveryStep[] = [
  {
    id: "step-1",
    label: "Order Picked Up",
    description: "Consolidated at the Central Redistribution Hub.",
    status: "completed",
    time: "08:45 AM",
    icon: "check",
  },
  {
    id: "step-2",
    label: "In Transit",
    description:
      "Vehicle is 4.2km away from your location. Optimizing route for carbon efficiency.",
    status: "current",
    time: "Current",
    icon: "local_shipping",
    hasMap: true,
  },
  {
    id: "step-3",
    label: "Arriving at Community Center",
    description: "Secondary sorting and local distribution prep.",
    status: "upcoming",
    time: "~ 04:30 PM",
    icon: "home_pin",
  },
  {
    id: "step-4",
    label: "Delivered & Verified",
    description: "Photo verification and impact logging will be available.",
    status: "upcoming",
    time: "Pending",
    icon: "inventory_2",
  },
];

const mockEligibility: EligibilityCycle = {
  totalDays: 15,
  completedDays: 11,
  remainingDays: 4,
  nextWindowDate: "Oct 24",
};

const mockDelivery: Delivery = {
  id: "del-001",
  trackingNumber: "LUM-89240-X",
  status: "in_transit",
  progressPercent: 75,
  estimatedArrival: "Today, 4:30 PM",
  courier: {
    id: "courier-1",
    name: "GreenWay Logistics",
    logoColor: "#3525cd",
  },
  packageInfo: {
    contents: "12.5kg Mixed Produce",
    weightKg: 12.5,
  },
  steps: mockSteps,
  eligibilityCycle: mockEligibility,
};

export class DeliveryRemoteDatasource {
  async getDelivery(_trackingNumber: string): Promise<Delivery> {
    await new Promise((r) => setTimeout(r, 600));
    return mockDelivery;
  }

  async getTimeline(_trackingNumber: string): Promise<DeliveryStep[]> {
    await new Promise((r) => setTimeout(r, 400));
    return mockSteps;
  }

  async getEligibility(): Promise<EligibilityCycle> {
    await new Promise((r) => setTimeout(r, 300));
    return mockEligibility;
  }
}
