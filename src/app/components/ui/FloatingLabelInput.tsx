import * as React from "react";

type BaseProps = {
  /** Sentence case label, e.g. "Email or phone" */
  label: string;
  /** Optional helper text (non-error). */
  helperText?: string;
  /** Error message; when present, field renders in error state. */
  errorText?: string;
  /** Left-side adornment (e.g. country picker). */
  leftAdornment?: React.ReactNode;
  /** If leftAdornment is used, reserve this width (px) for label/input. */
  leftAdornmentWidth?: number;
  /** Right-side adornment (icon/button). */
  rightAdornment?: React.ReactNode;
  /** If rightAdornment is used, reserve this width (px) so text doesn't collide. */
  rightAdornmentWidth?: number;
  /** Container className for layout. */
  className?: string;
  /** Input container className for per-screen styling overrides. */
  fieldClassName?: string;
  /** Inline styles for the field container (useful for CSS variables). */
  fieldStyle?: React.CSSProperties;
  /** Input element className for per-screen styling overrides. */
  inputClassName?: string;
  /** Label element className for per-screen styling overrides. */
  labelClassName?: string;
};

type InputProps = BaseProps &
  Omit<React.ComponentPropsWithoutRef<"input">, "children"> & {
    multiline?: false;
  };

type TextareaProps = BaseProps &
  Omit<React.ComponentPropsWithoutRef<"textarea">, "children"> & {
    multiline: true;
  };

export type FloatingLabelInputProps = InputProps | TextareaProps;

function useStableId(explicitId?: string) {
  const reactId = React.useId();
  return explicitId ?? `zf-float-${reactId.replace(/:/g, "")}`;
}

export const FloatingLabelInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FloatingLabelInputProps
>(function FloatingLabelInput(props, ref) {
  const {
    label,
    helperText,
    errorText,
    leftAdornment,
    leftAdornmentWidth,
    rightAdornment,
    rightAdornmentWidth,
    className,
    fieldClassName,
    fieldStyle,
    inputClassName,
    labelClassName,
    disabled,
    id,
    ...rest
  } = props as FloatingLabelInputProps & { id?: string };

  const stableId = useStableId(id);
  const describedById = `${stableId}-desc`;
  const hasError = Boolean(errorText);

  const isMultiline = "multiline" in props && props.multiline;

  const fieldDataAttrs = {
    "data-zf-disabled": disabled ? "true" : undefined,
    "data-zf-error": hasError ? "true" : undefined,
    "data-zf-has-left": leftAdornment ? "true" : undefined,
    "data-zf-has-right": rightAdornment ? "true" : undefined,
    "data-zf-multiline": isMultiline ? "true" : undefined,
  } as const;

  const mergedFieldStyle: React.CSSProperties | undefined = {
    ...(fieldStyle ?? {}),
    ...(leftAdornment && leftAdornmentWidth ? { ["--zf-left-width" as any]: `${leftAdornmentWidth}px` } : {}),
    ...(rightAdornment && rightAdornmentWidth ? { ["--zf-right-width" as any]: `${rightAdornmentWidth}px` } : {}),
  };

  const sharedInputProps = {
    id: stableId,
    disabled,
    "aria-invalid": hasError || undefined,
    "aria-describedby": helperText || errorText ? describedById : undefined,
    // The label itself acts as the placeholder; keep placeholder-shown available for CSS state.
    placeholder: " ",
    className: ["zf-float__control", inputClassName].filter(Boolean).join(" "),
  } as const;

  return (
    <div className={["zf-float", className].filter(Boolean).join(" ")}>
      <div
        className={["zf-float__field", fieldClassName].filter(Boolean).join(" ")}
        style={mergedFieldStyle}
        {...fieldDataAttrs}
      >
        {leftAdornment ? <div className="zf-float__left">{leftAdornment}</div> : null}
        {"multiline" in props && props.multiline ? (
          <textarea
            {...(rest as Omit<TextareaProps, keyof BaseProps | "multiline">)}
            {...sharedInputProps}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        ) : (
          <input
            {...(rest as Omit<InputProps, keyof BaseProps | "multiline">)}
            {...sharedInputProps}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        )}
        <label
          htmlFor={stableId}
          className={["zf-float__label", labelClassName].filter(Boolean).join(" ")}
        >
          {label}
        </label>
        {rightAdornment ? <div className="zf-float__right">{rightAdornment}</div> : null}
      </div>
      {(helperText || errorText) && (
        <div
          id={describedById}
          className={["zf-float__help", hasError ? "zf-float__help--error" : ""].filter(Boolean).join(" ")}
          aria-live={hasError ? "polite" : undefined}
        >
          {errorText ?? helperText}
        </div>
      )}
    </div>
  );
});

