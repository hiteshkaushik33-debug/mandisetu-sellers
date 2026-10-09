import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  ShieldCheck,
  CreditCard,
  Globe,
  Wallet,
  MessageSquare,
  LifeBuoy,
} from "lucide-react";
export const sellerNavigation = [
  ["dashboard", "Overview", LayoutDashboard],
  ["products", "My products", Package],
  ["leads", "Lead marketplace", Globe],
  ["leads/purchased", "Unlocked leads", FileText],
  ["enquiries", "Enquiries", MessageSquare],
  ["claims", "Claim responses", LifeBuoy],
  ["subscription", "Subscription", CreditCard],
  ["kyc", "Business verification", ShieldCheck],
  ["payments", "Payments", Wallet],
  ["profile", "Business profile", Users],
] as const;
