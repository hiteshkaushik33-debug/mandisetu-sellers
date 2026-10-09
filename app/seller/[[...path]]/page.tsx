import { Suspense } from "react";
import { SellerPanel } from "@/components/panel";
export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  return (
    <Suspense fallback={<div className="ms-loading">Loading MandiSetu…</div>}>
      <SellerPanel path={path} />
    </Suspense>
  );
}
