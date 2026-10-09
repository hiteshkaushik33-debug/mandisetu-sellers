import { appHref } from "@/lib/app-links";
import Link from "next/link";
export function Brand() {
  return (
    <Link href="https://mandisetu-sellers.vercel.app/seller/dashboard" className="brand">
      <span className="mark">MS</span>
      <span>
        Mandi<span className="setu">Setu</span>
      </span>
    </Link>
  );
}
