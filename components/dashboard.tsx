"use client";
import { appHref } from "@/lib/app-links";
import Link from "next/link";
import {
  ShieldCheck,
  Plus,
  FileText,
  ArrowRight,
  CheckCircle2,
  ArrowUpRight,
  Users,
  Package,
  Coins,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useMarketplace } from "@/lib/store";
import { type Role } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/marketplace";
import { PageHeading } from "@/components/page-heading";
import { SellerLeadList } from "./leads-list";
export function SellerDashboard() {
  const role = "seller" as Role;
  const { state } = useMarketplace();
  const seller = state.sellers[0];
  const plan = state.plans.find((p) => p.id === seller.plan)!;
  const listingCount = state.products.filter(
    (p) => p.sellerId === seller.id && p.status === "Active",
  ).length;
  const pendingKyc = state.sellers.filter(
    (s) => s.kyc === "Under Review",
  ).length;
  const stats = [
    {
      label: "Active products",
      value: listingCount,
      detail: `${plan.listings - listingCount} listing spaces remaining`,
      icon: Package,
      tone: "blue",
    },
    {
      label: "Lead credits",
      value: seller.credits,
      detail: "1 credit = 1 buyer connection",
      icon: Coins,
      tone: "amber",
    },
    {
      label: "Unlocked leads",
      value: state.leads.filter((l) => l.purchases.includes(seller.id)).length,
      detail: "Your business connections",
      icon: FileText,
      tone: "green",
    },
    {
      label: "Available leads",
      value: state.leads.filter(
        (l) =>
          l.category === seller.category &&
          ["Active", "Partially Sold"].includes(l.status),
      ).length,
      detail: "Matched to your category",
      icon: Users,
      tone: "violet",
    },
  ];
  return (
    <>
      <PageHeading
        title={`Good morning, ${seller.name.split(" ")[0]} 👋`}
        description={
          "Your business at a glance. Let’s build your next connection."
        }
        action={
          <Button asChild>
            <Link href={"/seller/products/create"}>
              {<Plus size={17} />} {"Add a product"}
            </Link>
          </Button>
        }
      />
      <div className="ms-stat-grid">
        {stats.map((s) => (
          <div className="ms-stat" key={s.label}>
            <div className="ms-stat-label">
              {s.label}
              <span className={"ms-stat-icon " + s.tone}>
                <s.icon size={19} />
              </span>
            </div>
            <strong>{s.value}</strong>
            <small>{s.detail}</small>
          </div>
        ))}
      </div>
      <div className="ms-dashboard-grid">
        <div>
          <section className="ms-card">
            <div className="ms-card-heading">
              <div>
                <h2>{"New leads for your business"}</h2>
                <p>
                  {"Relevant opportunities. Limited to 5 suppliers per lead."}
                </p>
              </div>
              <Link href={"/seller/leads"}>
                View all <ArrowRight size={15} />
              </Link>
            </div>
            {<SellerLeadList limit={2} />}
          </section>
          <section className="ms-card ms-activity-card">
            <div className="ms-card-heading">
              <h2>Recent activity</h2>
              <Badge>Preview</Badge>
            </div>
            {state.activity.slice(0, 4).map((a, i) => (
              <div className="ms-activity" key={i}>
                <span>
                  <CheckCircle2 size={17} />
                </span>
                <div>
                  <p>{a}</p>
                  <small>Marketplace update</small>
                </div>
              </div>
            ))}
          </section>
        </div>
        <div className="ms-dashboard-aside">
          {
            <section className="ms-plan-card">
              <span className="ms-plan-eyebrow">
                <Sparkles size={15} /> YOUR BUSINESS PLAN
              </span>
              <div className="ms-plan-title">
                <h2>{plan.name}</h2>
                <Badge tone="amber">Monthly</Badge>
              </div>
              <p>More visibility. More possibilities.</p>
              <div className="ms-plan-credit">
                <strong>{seller.credits}</strong>
                <span>lead credits remaining</span>
              </div>
              <div className="ms-plan-usage">
                <span>Product listings</span>
                <strong>
                  {listingCount} / {plan.listings}
                </strong>
              </div>
              <div className="ms-progress">
                <span
                  style={{ width: `${(listingCount / plan.listings) * 100}%` }}
                />
              </div>
              <Button asChild>
                <Link href={appHref("seller", "/seller/subscription")}>
                  Manage subscription <ArrowRight size={15} />
                </Link>
              </Button>
            </section>
          }
          <section className="ms-card">
            <h2>{"Business verification"}</h2>
            {
              <>
                <div className="ms-verification">
                  <ShieldCheck size={28} />
                  <div>
                    <strong>
                      {seller.kyc === "Approved"
                        ? "Verified Supplier"
                        : seller.kyc}
                    </strong>
                    <small>Reviewed manually by the team</small>
                  </div>
                </div>
                <Link href={appHref("seller", "/seller/kyc")}>
                  View verification details →
                </Link>
              </>
            }
          </section>
          <div className="ms-help-card">
            <div className="ms-help-icon">
              <TrendingUp />
            </div>
            <h3>Grow together with MandiSetu</h3>
            <p>Direct connections. Relevant opportunities. Better business.</p>
            <Link href={appHref("buyer", "/suppliers")}>
              Explore the marketplace →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
function BarIcon() {
  return <ArrowUpRight size={17} />;
}
