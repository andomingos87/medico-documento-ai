import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SecondaryActionButtonProps extends Omit<ButtonProps, 'variant'> {}

export const SecondaryActionButton = React.forwardRef<HTMLButtonElement, SecondaryActionButtonProps>(
  ({ className, children, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          // keep consistent subtle elevation/interaction without changing colors
          'hover:scale-105 active:scale-95 transition-all duration-200',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

SecondaryActionButton.displayName = 'SecondaryActionButton';
