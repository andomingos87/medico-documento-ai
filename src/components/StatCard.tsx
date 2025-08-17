
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
  className?: string;
};

export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend,
  className 
}: StatCardProps) => {
  return (
    <div className={cn(
      "bg-card rounded-lg border border-border p-6 shadow-soft transition-smooth hover:shadow-elegant",
      "relative overflow-hidden",
      className
    )}>
      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-card-foreground">{value}</h3>
          
          {trend && (
            <div className="mt-2 flex items-center">
              <span className={cn(
                "text-sm font-semibold px-2 py-1 rounded-full",
                trend.isPositive 
                  ? "text-success-foreground bg-success/10" 
                  : "text-destructive-foreground bg-destructive/10"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-2">este mês</span>
            </div>
          )}
          
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        
        <div className="p-3 rounded-xl bg-primary/10 hover-glow transition-smooth">
          <Icon size={24} className="text-primary" />
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50 pointer-events-none" />
    </div>
  );
};
