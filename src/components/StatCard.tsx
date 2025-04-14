
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
      "bg-white rounded-lg border border-neutral-200 p-5 shadow-card",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1 text-neutral-900">{value}</h3>
          
          {trend && (
            <div className="mt-1 flex items-center">
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "+" : "-"}{trend.value}%
              </span>
              <span className="text-xs text-neutral-500 ml-1">este mês</span>
            </div>
          )}
          
          {description && (
            <p className="mt-1 text-xs text-neutral-500">{description}</p>
          )}
        </div>
        
        <div className="p-2 rounded-full bg-medico-50">
          <Icon size={18} className="text-medico-600" />
        </div>
      </div>
    </div>
  );
};
