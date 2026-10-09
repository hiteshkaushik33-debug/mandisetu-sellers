"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useMarketplace } from "@/lib/store";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
const productSchema = z.object({
  name: z.string().min(3),
  category: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  moq: z.coerce.number().int().positive(),
  unit: z.string().min(1),
  image: z.url("Enter a valid image URL"),
  description: z.string().min(10),
});
export function ProductForm({ id }: { id?: string }) {
  const { state, update, notify } = useMarketplace();
  const router = useRouter();
  const existing = state.products.find((p) => p.id === id);
  const seller = state.sellers[0];
  const plan = state.plans.find((p) => p.id === seller.plan)!;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<
    z.input<typeof productSchema>,
    unknown,
    z.output<typeof productSchema>
  >({
    resolver: zodResolver(productSchema),
    defaultValues: existing || {
      category: seller.category,
      unit: "piece",
      image: "",
      name: "",
      description: "",
    },
  });
  return (
    <form
      className="ms-form ms-card"
      onSubmit={handleSubmit((v) => {
        if (
          !existing &&
          state.products.filter(
            (p) => p.sellerId === seller.id && p.status === "Active",
          ).length >= plan.listings
        )
          return notify("Your plan listing limit is reached.");
        const p = {
          ...v,
          id: id || "product-" + Date.now(),
          sellerId: seller.id,
          status: existing?.status || "Active",
        };
        update((s) => ({
          ...s,
          products: existing
            ? s.products.map((x) => (x.id === id ? p : x))
            : [...s.products, p],
        }));
        notify(existing ? "Product updated." : "Product added in preview.");
        router.push("/seller/products");
      })}
    >
      <div className="ms-form-grid">
        {(["name", "price", "moq", "unit", "image"] as const).map((k) => (
          <label className="ms-field" key={k}>
            {
              {
                name: "Product name",
                price: "Price per unit (₹)",
                moq: "Minimum order quantity",
                unit: "Unit",
                image: "Product image URL",
              }[k]
            }
            <input
              type={k === "price" || k === "moq" ? "number" : "text"}
              {...register(k)}
            />
            {errors[k] && (
              <small className="ms-error">{errors[k]?.message}</small>
            )}
          </label>
        ))}
        <label className="ms-field">
          Category
          <select {...register("category")}>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="ms-field">
        Description
        <textarea rows={4} {...register("description")} />
        {errors.description && (
          <small className="ms-error">{errors.description.message}</small>
        )}
      </label>
      <Button type="submit">
        {existing ? "Save changes" : "Publish product"}
      </Button>
    </form>
  );
}
