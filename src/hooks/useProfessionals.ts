import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProfessional, deleteProfessional, listProfessionals, updateProfessional } from '@/integrations/supabase/professionals';

export type ProfessionalRole = 'Médico' | 'Dentista' | 'Biomédico' | 'enfermeiro' | 'Esteticista' | 'Farmaceutico' | 'Outros';

export type Professional = {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  role: ProfessionalRole;
  createdAt: string;
  updatedAt: string;
};

export type NewProfessionalValues = {
  name: string;
  phone?: string | null;
  email: string;
  role: ProfessionalRole;
};

export const PROFESSIONAL_ROLES: ProfessionalRole[] = [
  'Médico',
  'Dentista',
  'Biomédico',
  'enfermeiro',
  'Esteticista',
  'Farmaceutico',
  'Outros',
];

export const useProfessionals = () => {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'todos' | ProfessionalRole>('todos');
  const [selected, setSelected] = useState<Professional | null>(null);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const qc = useQueryClient();

  const { data: rows = [] } = useQuery({
    queryKey: ['professionals', { search, role }],
    queryFn: () => listProfessionals({ search, role }),
  });

  const items: Professional[] = useMemo(() => rows.map(r => ({
    id: r.id,
    name: r.name,
    phone: r.phone ?? null,
    email: r.email,
    role: r.role as ProfessionalRole,
    createdAt: (r as any).created_at,
    updatedAt: (r as any).updated_at,
  })), [rows]);

  const filtered = useMemo(() => items, [items]);

  const createMutation = useMutation({
    mutationFn: (v: NewProfessionalValues) => createProfessional({
      name: v.name,
      phone: v.phone ?? null,
      email: v.email,
      role: v.role,
    }),
    onSuccess: () => {
      toast.success('Profissional criado.');
      qc.invalidateQueries({ queryKey: ['professionals'] });
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao criar profissional'),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; data: NewProfessionalValues }) => updateProfessional(vars.id, {
      name: vars.data.name,
      phone: vars.data.phone ?? null,
      email: vars.data.email,
      role: vars.data.role,
    }),
    onSuccess: () => {
      toast.success('Profissional atualizado.');
      qc.invalidateQueries({ queryKey: ['professionals'] });
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao atualizar profissional'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProfessional(id),
    onSuccess: () => {
      toast.success('Profissional removido.');
      qc.invalidateQueries({ queryKey: ['professionals'] });
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao remover profissional'),
  });

  return {
    // state
    items,
    filtered,
    search,
    setSearch,
    role,
    setRole,
    selected,
    setSelected,
    isNewOpen,
    setIsNewOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    // actions
    createItem: (v: NewProfessionalValues) => createMutation.mutate(v),
    createItemAsync: (v: NewProfessionalValues) => createMutation.mutateAsync(v),
    updateItem: (id: string, v: NewProfessionalValues) => updateMutation.mutate({ id, data: v }),
    deleteItem: (id: string) => deleteMutation.mutate(id),
  };
};
