import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
type StatCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isEmpty?: boolean;
  className?: string;
};
export const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  isEmpty = false,
  className
}: StatCardProps) => {
  return <div className={cn("bg-card rounded-lg border border-border p-6 shadow-soft transition-smooth hover:shadow-elegant", "relative overflow-hidden", className)}>
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className={cn("text-3xl font-bold mt-2", isEmpty ? "text-muted-foreground" : "text-card-foreground")}>
            {isEmpty ? "—" : value}
          </h3>
          
          {isEmpty && (
            <p className="mt-1 text-xs text-muted-foreground">Nenhum registro encontrado</p>
          )}
          
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
        </div>
        
        <div className={cn("p-3 rounded-xl transition-smooth", isEmpty ? "bg-muted/20" : "bg-primary/10 hover-glow")}>
          <Icon size={24} className={cn(isEmpty ? "text-muted-foreground" : "text-primary")} />
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50 pointer-events-none" />
    </div>;
};