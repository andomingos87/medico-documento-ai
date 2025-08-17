
import React from 'react';
import { Badge } from '@/components/ui/badge';

/**
 * Creates a status badge with appropriate styling based on document status
 */
export const createStatusBadge = (status: 'pending' | 'signed'): JSX.Element => {
  if (status === 'pending') {
    return (
      <Badge variant="warning">
        Pendente
      </Badge>
    );
  }
  
  return (
    <Badge variant="success">
      Assinado
    </Badge>
  );
};

/**
 * Creates a priority badge with appropriate styling
 */
export const createPriorityBadge = (priority: 'high' | 'medium' | 'low'): JSX.Element => {
  const variantMap = {
    high: 'priority-high' as const,
    medium: 'priority-medium' as const,
    low: 'priority-low' as const,
  };
  
  const labelMap = {
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
  };

  return (
    <Badge variant={variantMap[priority]}>
      {labelMap[priority]}
    </Badge>
  );
};
