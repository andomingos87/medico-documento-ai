export type ProcedureCategory = 'Geral' | 'Cirúrgico' | 'Estético' | 'Diagnóstico' | 'Terapêutico';

export interface ProcedureItem {
  id: string;
  name: string;
  category: ProcedureCategory;
  description?: string;
  risks?: string;
  contraindications?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProcedureFilters {
  search: string;
  category: ProcedureCategory | 'Todos';
}
