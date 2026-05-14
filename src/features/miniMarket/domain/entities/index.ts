// FoodItem — individual product inside a category
export interface FoodItem {
  id: string;
  name: string;
  quantity: string;      // e.g. "2.0 kg", "500 g"
  badge?: string;        // optional label e.g. "Farm Sourced"
  badgeColor?: "green" | "blue" | "orange";
}

// NutritionInfo — tip attached to a category
export interface NutritionInfo {
  tip: string;
}

// Category — grouped set of food items
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;           // Material Symbol name
  iconBg: string;         // Tailwind bg class e.g. "bg-green-50"
  iconColor: string;      // Tailwind text class e.g. "text-green-600"
  totalQuantity: string;  // e.g. "12.5 kg"
  items: FoodItem[];
  nutritionTip?: NutritionInfo;
}

// AllocationSummary — hero stats
export interface AllocationSummary {
  status: "active" | "pending" | "completed";
  balanceStatus: "balanced" | "unbalanced";
  durationDays: number;
  householdSize: number;
  verifiedStatus: "verified" | "unverified";
  householdDescription: string;
}

// PickupInfo — pickup location details
export interface PickupInfo {
  hubName: string;
  distance: string;
  availableFrom: string;
}

// FoodPackage — top-level aggregate
export interface FoodPackage {
  id: string;
  allocation: AllocationSummary;
  categories: Category[];
  pickupInfo: PickupInfo;
}
