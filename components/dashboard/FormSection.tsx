import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const FormSection = ({ title, description, children }: FormSectionProps) => {
  return (
    <GlassCard spotlight={false} className="space-y-5 p-5 sm:p-6">
      <div>
        <h2 className="text-base font-bold tracking-tight text-fg-high">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-xs text-fg-low">{description}</p>
        ) : null}
      </div>
      {children}
    </GlassCard>
  );
};

export default FormSection;
