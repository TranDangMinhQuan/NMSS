// Account Types
export interface Account {
  account_id: string;
  username: string;
  email: string;
  phone: string;
  role: 'guest' | 'member' | 'staff' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  created_at: string;
  updated_at: string;
}

// Membership Types
export interface MembershipType {
  membership_type_id: string;
  name: string;
  description: string;
  duration_months: number;
  price: number;
}

// Card Types: defines a named type of card and which service categories it can access
export interface CardType {
  card_type_id: string;
  name: string;
  description?: string;
  // allowed category ids (service categories this card type can use)
  allowed_category_ids: string[];
}

// Relation between Package and Service (many-to-many with constraints)
export interface PackageService {
  package_service_id: string;
  package_id: string;
  service_id: string;
  // duration of one use in minutes (or 0 if not applicable)
  per_use_minutes: number;
  // min/max total price constraints when combining with this service
  min_total_amount?: number;
  max_total_amount?: number;
  // allowed days and time frame at relation level (overrides package if present)
  allowed_days?: string; // "1/0/0/0/1/0/0"
  allowed_time_frame?: string; // "08:00-18:00"
}

export interface MembershipCard {
  card_id: string;
  account_id: string;
  // Optional link to a membership type (legacy) or the new card type
  membership_type_id?: string;
  // card type defines which service categories the card can use
  card_type_id?: string;
  card_number: string;
  issued_date: string;
  expiry_date: string;
  status: 'active' | 'expired' | 'canceled';
  membership_type?: MembershipType;
  card_type?: CardType;
}

// Center & Service Types
export interface Center {
  center_id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
}

export interface ServiceCategory {
  category_id: string;
  center_id: string;
  name: string;
  description: string;
  center?: Center;
}

export interface Service {
  service_id: string;
  category_id: string;
  name: string;
  description: string;
  price_per_unit: number;
  // 'month' added because some demo/mock services represent monthly packages
  unit_type: 'hour' | 'session' | 'game' | 'month';
  status: 'active' | 'inactive';
  category?: ServiceCategory;
}

// Package Types
export interface Package {
  package_id: string;
  name: string;
  description: string;
  // Duration meaning: default unit (e.g., number of uses or months) depending on package
  duration: number;
  // Total amount constraints for the package (min/max total price customer should pay for package)
  min_amount: number;
  max_amount: number;
  // Allowed days encoded as "Mon/Tue/Wed/Thu/Fri/Sat/Sun" using 1/0 e.g. "1/0/0/0/1/0/0"
  allowed_days: string; // "1/0/0/0/1/0/0"
  // Allowed overall time frame for using the package (e.g. "08:00-18:00")
  allowed_time_frame: string; // "08:00-18:00"
  // Per-use constraints (minutes)
  per_use_min_minutes?: number; // e.g. 30 => under 30 not allowed
  per_use_max_minutes?: number; // e.g. 30 => maximum allowed per use
  // Price for the package
  price: number;
}

export interface CardPackage {
  card_package_id: string;
  card_id: string;
  package_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'canceled';
  package?: Package;
  card?: MembershipCard;
}

// Booking & Order Types
export interface Booking {
  booking_id: string;
  account_id: string;
  service_id: string;
  date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'canceled';
  service?: Service;
}

export interface ServiceOrder {
  order_id: string;
  card_package_id: string;
  service_id: string;
  usage_date: string;
  duration: number;
  amount: number;
  service?: Service;
  card_package?: CardPackage;
  // Optional link to the package->service relation that was used for this order
  package_service_id?: string;
  package_service?: PackageService;
}

// Payment Types
export interface Payment {
  payment_id: string;
  booking_id: string;
  amount: number;
  method: 'cash' | 'credit_card' | 'bank_transfer';
  status: 'pending' | 'complete' | 'canceled';
  payment_date: string;
  updated_at: string;
  booking?: Booking;
}

// Check-in Types
export interface CheckIn {
  checkin_id: string;
  account_id: string;
  service_id: string;
  checkin_time: string;
  checkout_time?: string;
  service?: Service;
}

// Reward Points
export interface RewardPoints {
  account_id: string;
  points: number;
  last_updated: string;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}

// Dashboard Stats
export interface DashboardStats {
  totalMembers: number;
  activeMemberships: number;
  totalRevenue: number;
  pendingBookings: number;
  todayCheckins: number;
}
