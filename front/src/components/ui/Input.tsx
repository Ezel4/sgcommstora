import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "min-h-11 w-full rounded-xl border border-line-strong bg-elevated px-4 py-2.5 text-sm text-ink shadow-[var(--elevation-1)] " +
  "placeholder:text-ink-4 transition-[background-color,border-color,box-shadow] duration-200 " +
  "hover:border-ink/20 focus-visible:border-accent-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 " +
  "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-3 disabled:opacity-70";

interface FieldWrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  id: string;
  hintId?: string;
  errorId?: string;
  children: React.ReactNode;
}

function FieldWrapper({
  label,
  hint,
  error,
  id,
  hintId,
  errorId,
  children,
}: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-[0.8125rem] font-medium tracking-tight text-ink-2"
        >
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-xs leading-relaxed text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-xs leading-relaxed text-ink-3">
            {hint}
          </p>
        )
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
  (
    {
      label,
      hint,
      error,
      id,
      className,
      "aria-describedby": externalDescription,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    const describedBy = [externalDescription, errorId ?? hintId]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <FieldWrapper
        label={label}
        hint={hint}
        error={error}
        id={fieldId}
        hintId={hintId}
        errorId={errorId}
      >
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          aria-errormessage={errorId}
          className={cn(
            fieldBase,
            error && "border-danger/50 focus-visible:border-danger focus-visible:ring-danger/20",
            className,
          )}
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
  (
    {
      label,
      hint,
      error,
      id,
      className,
      rows = 4,
      "aria-describedby": externalDescription,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    const describedBy = [externalDescription, errorId ?? hintId]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <FieldWrapper
        label={label}
        hint={hint}
        error={error}
        id={fieldId}
        hintId={hintId}
        errorId={errorId}
      >
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          aria-errormessage={errorId}
          className={cn(
            fieldBase,
            "resize-y leading-relaxed",
            error && "border-danger/50 focus-visible:border-danger focus-visible:ring-danger/20",
            className,
          )}
          {...props}
        />
      </FieldWrapper>
    );
  },
);
Textarea.displayName = "Textarea";
