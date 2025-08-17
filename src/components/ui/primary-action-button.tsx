import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PrimaryActionButtonProps extends Omit<ButtonProps, 'variant'> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export const PrimaryActionButton = React.forwardRef<HTMLButtonElement, PrimaryActionButtonProps>(
  ({ className, children, isLoading = false, loadingText, icon, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="default"
        className={cn(
          "shadow-glow hover:scale-105 active:scale-95 transition-all duration-200",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText || 'Carregando...'}
          </>
        ) : (
          <>
            {icon && icon}
            {children}
          </>
        )}
      </Button>
    );
  }
);

PrimaryActionButton.displayName = "PrimaryActionButton";