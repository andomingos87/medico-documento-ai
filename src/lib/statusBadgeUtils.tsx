
import React from 'react';
import { Badge } from '@/components/ui/badge';

/**
 * Creates a status badge with appropriate styling based on document status
 */
export const createStatusBadge = (status: 'pending' | 'signed'): JSX.Element => {
  if (status === 'pending') {
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        Pendente
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
      Assinado
    </Badge>
  );
};
