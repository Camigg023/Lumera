import type { FoodPackage, Category, PickupInfo } from "../../domain/entities";

const mockCategories: Category[] = [
  {
    id: "vegetables",
    name: "Fresh Vegetables",
    description: "Rich in essential vitamins and fiber to support digestive health and overall immunity.",
    icon: "eco",
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    totalQuantity: "12.5 kg",
    items: [
      { id: "v1", name: "Organic Carrots", quantity: "2.0 kg", badge: "Farm Sourced", badgeColor: "green" },
      { id: "v2", name: "Spinach", quantity: "500 g", badge: "Farm Sourced", badgeColor: "green" },
      { id: "v3", name: "Vine Tomatoes", quantity: "1.5 kg", badge: "Farm Sourced", badgeColor: "green" },
    ],
    nutritionTip: {
      tip: "Steam vegetables instead of boiling to preserve water-soluble vitamins.",
    },
  },
  {
    id: "proteins",
    name: "Essential Proteins",
    description: "Lean protein sources designed for muscle maintenance and long-term satiety.",
    icon: "set_meal",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    totalQuantity: "6.2 kg",
    items: [
      { id: "p1", name: "Free-range Chicken", quantity: "2.0 kg" },
      { id: "p2", name: "Mixed Legumes", quantity: "2.2 kg" },
    ],
  },
  {
    id: "grains",
    name: "Whole Grains",
    description: "Complex carbohydrates for sustained energy throughout your active 15-day period.",
    icon: "bakery_dining",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    totalQuantity: "8.0 kg",
    items: [
      { id: "g1", name: "Brown Rice", quantity: "3.0 kg" },
    ],
  },
  {
    id: "dairy",
    name: "Dairy & Alternatives",
    description: "Calcium and Vitamin D rich items tailored for bone health support for all ages.",
    icon: "water_drop",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    totalQuantity: "4.5 L",
    items: [
      { id: "d1", name: "Fresh Whole Milk", quantity: "2.0 L" },
    ],
  },
  {
    id: "fruits",
    name: "Seasonal Fruits",
    description: "Natural antioxidant sources to provide healthy sweetness and necessary micronutrients.",
    icon: "nutrition",
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    totalQuantity: "4.0 kg",
    items: [
      { id: "f1", name: "Gala Apples", quantity: "1.5 kg" },
    ],
  },
];

const mockPickup: PickupInfo = {
  hubName: "Central Community Center",
  distance: "0.8km from your location",
  availableFrom: "Tomorrow, 08:00 AM",
};

const mockPackage: FoodPackage = {
  id: "pkg-2024-001",
  allocation: {
    status: "active",
    balanceStatus: "balanced",
    durationDays: 15,
    householdSize: 4,
    verifiedStatus: "verified",
    householdDescription:
      "Based on your household profile of 4 members, we've prepared a comprehensive nutritional package for the next cycle.",
  },
  categories: mockCategories,
  pickupInfo: mockPickup,
};

export class MiniMarketDatasource {
  async fetchPackage(): Promise<FoodPackage> {
    await new Promise((r) => setTimeout(r, 500));
    return mockPackage;
  }

  async fetchCategories(): Promise<Category[]> {
    await new Promise((r) => setTimeout(r, 300));
    return mockCategories;
  }

  async fetchPickupInfo(): Promise<PickupInfo> {
    await new Promise((r) => setTimeout(r, 200));
    return mockPickup;
  }
}
