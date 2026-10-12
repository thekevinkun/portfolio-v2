import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { fieldBase } from "./field-styles";

const Input = ({ className, ...props }: ComponentProps<"input">) => {
  return <input className={cn(fieldBase, className)} {...props} />;
};

export default Input;
