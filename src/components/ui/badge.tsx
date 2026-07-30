import type { ReactNode } from "react";

export type BadgeTone = "success" | "warning" | "danger" | "neutral" | "accent";

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-muted/10 text-muted",
  accent: "bg-accent/10 text-accent",
};

export default function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

// Central status → tone mapping so every page (seats, reservations, orders)
// colors the same status word the same way instead of each re-deciding it.
const STATUS_TONES: Record<string, BadgeTone> = {
  AVAILABLE: "success",
  HELD: "warning",
  HOLDING: "warning",
  BOOKED: "danger",
  CONFIRMED: "success",
  SUCCEEDED: "success",
  ISSUED: "success",
  PENDING: "warning",
  FAILED: "danger",
  CANCELLED: "danger",
  EXPIRED: "danger",
};

export function statusTone(status: string): BadgeTone {
  return STATUS_TONES[status] ?? "neutral";
}
