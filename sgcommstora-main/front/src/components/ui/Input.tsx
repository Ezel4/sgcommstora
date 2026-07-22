import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-stroke bg-cream/60 px-4 py-2.5 text-sm font-light text-forest " +
  "placeholder:text-forest/35 transition-colors duration-200 " +
  "focus:border-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/15 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

interface FieldWrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, hint, error, id, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-[0.8125rem] font-bold tracking-tight text-forest/80"
        >
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-light text-danger">{error}</p>
      ) : (
        hint && <p className="text-xs font-light text-forest/50">{hint}</p>
      )}
    </div>
  );
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <FieldWrapper label={label} hint={hint} error={error} id={fieldId}>
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={Boolean(error)}
          className={cn(fieldBase, error && "border-danger/50", className)}
          {...props}
        />
      </FieldWrapper>
    );
  },
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    return (
      <FieldWrapper label={label} hint={hint} error={error} id={fieldId}>
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={Boolean(error)}
          className={cn(
            fieldBase,
            "resize-none leading-relaxed",
            error && "border-danger/50",
            className,
          )}
          {...props}
        />
      </FieldWrapper>
    );
  },
);
Textarea.displayName = "Textarea";
