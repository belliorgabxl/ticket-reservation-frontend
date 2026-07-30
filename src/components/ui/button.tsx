import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-foreground/5",
  ghost: "text-foreground hover:bg-foreground/5",
  danger: "bg-danger text-white hover:opacity-90",
};

// Exported so non-<button> elements (e.g. <Link>, which can't be nested
// inside a <button>) can reuse the exact same visual style.
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    sizeClasses[size],
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props} />
  );
}
