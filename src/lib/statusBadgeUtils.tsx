
import React from 'react';
import { Badge } from '@/components/ui/badge';

/**
 * Creates a status badge with appropriate styling based on document status
 */
export const createStatusBadge = (status: 'pending' | 'signed'): JSX.Element => {
  if (status === 'pending') {
    return (
      <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/20 font-medium">
        Pendente
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-success/10 text-success-foreground border-success/20 font-medium">
      Assinado
    </Badge>
  );
};
