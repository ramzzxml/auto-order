import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400",
  failed: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400",
  expired: "bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-300"
};

const LABELS: Record<OrderStatus, string> = {
  pending: "Waiting for payment",
  success: "Payment successful",
  failed: "Payment failed",
  expired: "Expired"
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        STYLES[status]
      )}
    >
      {LABELS[status]}
    </span>
  );
}
