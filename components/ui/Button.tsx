import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md";

interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base =
  "inline-flex items-center justify-center gap-2.5 rounded-pill font-bold tracking-wide transition-transform duration-(--duration-micro) ease-out-expo active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent hover:shadow-glow-white",
  secondary:
    "border border-glass-border bg-linear-to-br from-glass-from to-glass-to text-fg-high hover:border-glass-border-hover",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-7 py-3.5 text-sm",
};

const buttonClasses = (
  { variant = "primary", size = "md" }: ButtonStyleProps,
  className?: string,
) => {
  return cn(base, variants[variant], sizes[size], className);
};

interface ButtonProps
  extends ComponentPropsWithoutRef<"button">, ButtonStyleProps {}

export const Button = ({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size }, className)}
      {...props}
    />
  );
};

interface ButtonLinkProps
  extends Omit<ComponentPropsWithoutRef<"a">, "href">, ButtonStyleProps {
  href: string;
  children: ReactNode;
}

// Internal paths use next/link; http(s) links open in a new tab safely
export const ButtonLink = ({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: ButtonLinkProps) => {
  const classes = buttonClasses({ variant, size }, className);

  // Downloads stay plain anchors so the browser handles the file
  if (href.startsWith("/") && props.download === undefined) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={classes}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
    </a>
  );
};
