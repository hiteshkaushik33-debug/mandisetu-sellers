"use client";
import { appHref } from "@/lib/app-links";
import Link from "next/link";
import { ShieldCheck, Plus, FileText } from "lucide-react";
import { useMarketplace } from "@/lib/store";
import { type Role } from "@/lib/data";
import { money } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/marketplace";
import { PageHeading } from "@/components/page-heading";
import { Empty } from "@/components/empty";
import { ProfileForm } from "@/components/profile-form";
import { ProductForm } from "@/components/product-form";
import { SellerDashboard } from "./dashboard";
import { SellerClaims } from "./claims";
import { SellerPlans } from "./plans";
import { SellerLeadList } from "./leads-list";
export function SellerPanel({ path }: { path: string[] }) {
  const role = "seller" as Role;
  const { state, update, notify } = useMarketplace();
  const section = path[0] || "dashboard";
  const seller = state.sellers[0];
  if (section === "dashboard") return <SellerDashboard />;
  if (section === "profile")
    return (
      <>
        <PageHeading
          title="Business profile"
          description="Keep your business details up to date."
        />
        <ProfileForm seller={true} />
      </>
    );
  if (section === "leads")
    return (
      <>
        <PageHeading
          title={
            path[1] === "purchased" ? "Unlocked leads" : "Lead marketplace"
          }
          description={`Matched to ${seller.category}. Each lead is available to a maximum of 5 suppliers.`}
        />
        {
          <div className="ms-inline-banner">
            <strong>{seller.credits} credits available</strong>
            <span>
              One credit unlocks one lead. Buyer contact stays locked until
              unlock.
            </span>
          </div>
        }
        <SellerLeadList purchased={path[1] === "purchased"} />
      </>
    );
  if (section === "products") {
    if (path[1] === "create" || path[2] === "edit")
      return (
        <>
          <PageHeading
            title={path[2] === "edit" ? "Edit product" : "Add a product"}
            description="Build your catalogue for business buyers."
          />
          <ProductForm id={path[2] === "edit" ? path[1] : undefined} />
        </>
      );
    const list = state.products.filter((p) => p.sellerId === seller.id);
    return (
      <>
        <PageHeading
          title={"My products"}
          description="Manage catalogue visibility and product information."
          action={
            <Button asChild>
              <Link href={appHref("seller", "/seller/products/create")}>
                <Plus size={16} /> Add product
              </Link>
            </Button>
          }
        />
        <div className="ms-card ms-table-wrap">
          <table className="ms-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link
                      href={"/products/" + p.id}
                      className="ms-table-product"
                    >
                      <img src={p.image} alt="" />
                      <strong>{p.name}</strong>
                    </Link>
                  </td>
                  <td>{p.category}</td>
                  <td>{money(p.price)}</td>
                  <td>
                    <Badge tone={p.status === "Active" ? "green" : ""}>
                      {p.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="ms-table-actions">
                      {
                        <Link href={"/seller/products/" + p.id + "/edit"}>
                          Edit
                        </Link>
                      }
                      <button
                        onClick={() =>
                          update((s) => ({
                            ...s,
                            products: s.products.map((x) =>
                              x.id === p.id
                                ? {
                                    ...x,
                                    status:
                                      x.status === "Active"
                                        ? "Inactive"
                                        : "Active",
                                  }
                                : x,
                            ),
                          }))
                        }
                      >
                        {p.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
  if (section === "kyc")
    return (
      <>
        <PageHeading
          title={"Business verification"}
          description="KYC is manually reviewed. Documents are private and never part of the public catalogue."
        />
        {
          <div className="ms-card">
            <div className="ms-verification">
              <ShieldCheck size={38} />
              <div>
                <h2>
                  {seller.kyc === "Approved"
                    ? "Your business is verified"
                    : seller.kyc}
                </h2>
                <p>Manual review by the Roxodeal team</p>
              </div>
            </div>
            <div className="ms-document-grid">
              {[
                "PAN card",
                "GST certificate",
                "Business registration",
                "Address proof",
              ].map((d) => (
                <div className="ms-document" key={d}>
                  <FileText />
                  <strong>{d}</strong>
                  <Badge tone="green">Sample record</Badge>
                </div>
              ))}
            </div>
            <p>
              Private upload and document review require the configured API and
              filesystem service. This preview does not collect identity
              documents.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                update((s) => ({
                  ...s,
                  sellers: s.sellers.map((x, i) =>
                    i === 0 ? { ...x, kyc: "Under Review" } : x,
                  ),
                }));
                notify("KYC review requested in preview.");
              }}
            >
              Request a new review
            </Button>
          </div>
        }
      </>
    );
  if (section === "subscription" || section === "subscriptions")
    return (
      <>
        <PageHeading
          title={"Grow your business"}
          description="Listing limits and lead credits that fit your business. Monthly plans."
        />
        <SellerPlans />
      </>
    );
  if (section === "claims") return <SellerClaims />;
  if (section === "payments" || section === "enquiries")
    return (
      <>
        <PageHeading
          title={
            section === "payments" ? "Payment history" : "Business enquiries"
          }
          description={
            section === "payments"
              ? "Verified transactions and invoices will appear here."
              : "Direct enquiries from buyers will appear here."
          }
        />
        <div className="ms-card">
          <Empty
            title={
              section === "payments"
                ? "No live payments connected"
                : "No enquiries yet"
            }
            description={
              section === "payments"
                ? "Preview credit unlocks do not create payment transactions. Configure Razorpay to enable live payments."
                : "Keep your catalogue complete so buyers can discover your business."
            }
          />
        </div>
      </>
    );
  return <Empty title="Page not found" />;
}
