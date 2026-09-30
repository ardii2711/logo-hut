import { ReactNode } from "react";

interface PanelCardProps {
  stepNumber: number;
  title: string;
  description: string;
  stepLabel: string;
  children: ReactNode;
}

export default function PanelCard({
  stepNumber,
  title,
  description,
  stepLabel,
  children,
}: PanelCardProps) {
  return (
    <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
      <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-outline-variant/30">
        <div className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface text-label-lg">
            {stepNumber}
          </div>
          <div>
            <h2 className="text-title-md text-on-surface font-bold">{title}</h2>
            <p className="text-body-sm text-on-surface-variant">{description}</p>
          </div>
        </div>
        <span className="text-label-mono bg-surface-container-low text-on-surface-variant px-space-sm py-1 rounded">
          {stepLabel}
        </span>
      </div>
      {children}
    </div>
  );
}
