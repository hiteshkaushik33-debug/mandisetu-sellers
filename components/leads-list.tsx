"use client";
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { useMarketplace } from "@/lib/store";
import { money } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/marketplace";
export function SellerLeadList({
  purchased = false,
  limit,
}: {
  purchased?: boolean;
  limit?: number;
}) {
  const { state, unlock, update, notify } = useMarketplace();
  const seller = state.sellers[0];
  const leads = state.leads
    .filter(
      (l) =>
        l.category === seller.category &&
        (purchased
          ? l.purchases.includes(seller.id)
          : ["Active", "Partially Sold", "Fully Sold"].includes(l.status)),
    )
    .slice(0, limit);
  return (
    <div className="ms-lead-list">
      {leads.map((l) => {
        const unlocked = l.purchases.includes(seller.id);
        return (
          <article className="ms-lead-card" key={l.id}>
            <div className="ms-lead-top">
              <Badge
                tone={
                  l.status === "Fully Sold"
                    ? ""
                    : l.status === "Pending"
                      ? "amber"
                      : "green"
                }
              >
                {l.status}
              </Badge>
              <small>{l.id}</small>
            </div>
            <h3>{l.title}</h3>
            <p>
              {l.city} · {l.category}
            </p>
            <div className="ms-lead-facts">
              <div>
                <small>Quantity</small>
                <strong>
                  {l.quantity.toLocaleString("en-IN")} {l.unit}
                </strong>
              </div>
              <div>
                <small>Buyer budget</small>
                <strong>{money(l.budget)}</strong>
              </div>
              <div>
                <small>Required by</small>
                <strong>
                  {new Date(l.date + "T00:00:00").toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </div>
            </div>
            <p className="ms-lead-description">{l.description}</p>
            <div className="ms-slots">
              <span>{l.purchases.length} of 5 supplier slots filled</span>
              <strong>{5 - l.purchases.length} remaining</strong>
            </div>
            <div className="ms-progress">
              <span style={{ width: (l.purchases.length / 5) * 100 + "%" }} />
            </div>
            {unlocked ? (
              <div className="ms-unlocked">
                <CheckCircle2 size={16} />
                <strong>{l.buyerName}</strong>
                <a href={"mailto:" + l.email}>{l.email}</a>
                <a href={"tel:" + l.phone}>{l.phone}</a>
              </div>
            ) : (
              <div className="ms-lead-action">
                <span>
                  <strong>
                    {l.price === 0 ? "Free lead" : money(l.price)}
                  </strong>
                  {l.price > 0 && "or 1 lead credit"}
                </span>
                <Button
                  size="sm"
                  disabled={l.purchases.length >= 5}
                  onClick={() => unlock(l.id)}
                >
                  {l.purchases.length >= 5
                    ? "Fully sold"
                    : "Unlock buyer contact"}
                  <ArrowRight size={14} />
                </Button>
              </div>
            )}
          </article>
        );
      })}
      {!leads.length && (
        <div className="ms-empty">
          <FileText />
          <h3>No leads yet</h3>
          <p>
            {purchased
              ? "Unlocked leads will appear here."
              : "Relevant requirements will appear after admin review."}
          </p>
        </div>
      )}
    </div>
  );
}
