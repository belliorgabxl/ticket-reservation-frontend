import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export default function Field({
  label,
  error,
  id,
  className = "",
  ...props
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
        {...props}
      />
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  );
}
