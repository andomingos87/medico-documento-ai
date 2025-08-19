import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProcedure as apiCreate, deleteProcedureById, listProcedures, updateProcedureById } from '@/integrations/supabase/procedures';
import { ProcedureItem, ProcedureCategory } from '@/components/procedures/types';

export const useProcedures = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProcedureCategory | 'Todos'>('Todos');
  const [selected, setSelected] = useState<ProcedureItem | null>(null);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const qc = useQueryClient();

  const { data: itemsData = [], isLoading } = useQuery({
    queryKey: ['procedures', { search, category }],
    queryFn: () => listProcedures({ search, category }),
  });

  const items: ProcedureItem[] = itemsData.map(d => ({
    id: d.id,
    name: d.name,
    category: d.category as ProcedureCategory,
    description: d.description,
    risks: d.risks,
    contraindications: d.contraindications,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  }));

  const filtered = useMemo(() => items, [items]);

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; category: ProcedureCategory; description?: string; risks?: string; contraindications?: string }) => apiCreate(payload),
    onSuccess: () => {
      toast.success('Procedimento criado');
      qc.invalidateQueries({ queryKey: ['procedures'] });
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao criar procedimento'),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; name: string; category: ProcedureCategory; description?: string; risks?: string; contraindications?: string }) => 
      updateProcedureById(vars.id, { name: vars.name, category: vars.category, description: vars.description, risks: vars.risks, contraindications: vars.contraindications }),
    onSuccess: () => {
      toast.success('Procedimento atualizado');
      qc.invalidateQueries({ queryKey: ['procedures'] });
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao atualizar procedimento'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProcedureById(id),
    onSuccess: () => {
      toast.success('Procedimento excluído');
      qc.invalidateQueries({ queryKey: ['procedures'] });
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao excluir procedimento'),
  });

  const createProcedure = (data: { name: string; category: ProcedureCategory; description?: string; risks?: string; contraindications?: string }) => createMutation.mutate(data);
  const updateProcedure = (id: string, data: { name: string; category: ProcedureCategory; description?: string; risks?: string; contraindications?: string }) => updateMutation.mutate({ id, ...data });
  const deleteProcedure = (id: string) => deleteMutation.mutate(id);

  return {
    items,
    filtered,
    search,
    setSearch,
    category,
    setCategory,
    selected,
    setSelected,
    isNewOpen,
    setIsNewOpen,
    isEditOpen,
    setIsEditOpen,
    isViewOpen,
    setIsViewOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    createProcedure,
    updateProcedure,
    deleteProcedure,
    isLoading,
  };
};
