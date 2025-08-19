import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAnamnesis, deleteAnamnesis, listAnamneses, updateAnamnesis } from '@/integrations/supabase/anamneses';

export type AnamnesisStatus = 'draft' | 'link_sent' | 'completed';

export type Anamnesis = {
  id: string;
  patientId: string;
  patientName: string;
  procedureId: string;
  procedureName: string;
  createdAt: string; // ISO
  status: AnamnesisStatus;
  // Basic fields captured in the form
  medicalHistory: {
    continuousMedication: boolean;
    medicationAllergy: boolean;
  };
  aestheticsHistory: {
    previousProcedures: boolean;
    complications: boolean;
  };
  expectations: string;
  awareness: string;
};

export type NewAnamnesisValues = {
  patientId: string;
  patientName: string;
  procedureId: string;
  procedureName: string;
  continuousMedication: boolean;
  medicationAllergy: boolean;
  previousProcedures: boolean;
  complications: boolean;
  expectations: string;
  awareness: string;
};

export const useAnamneses = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Anamnesis | null>(null);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const qc = useQueryClient();

  const { data: rows = [] } = useQuery({
    queryKey: ['anamneses', { search }],
    queryFn: () => listAnamneses({ search }),
  });

  const items: Anamnesis[] = useMemo(() => rows.map(r => ({
    id: r.id,
    patientId: r.patient_id,
    patientName: r.patient_name,
    procedureId: r.procedure_id,
    procedureName: r.procedure_name,
    createdAt: r.created_at,
    status: r.status,
    medicalHistory: r.medical_history as Anamnesis['medicalHistory'],
    aestheticsHistory: r.aesthetics_history as Anamnesis['aestheticsHistory'],
    expectations: r.expectations,
    awareness: r.awareness,
  })), [rows]);

  const filtered = useMemo(() => items, [items]);

  const createMutation = useMutation({
    mutationFn: (v: NewAnamnesisValues) => createAnamnesis({
      patient_id: v.patientId,
      patient_name: v.patientName,
      procedure_id: v.procedureId,
      procedure_name: v.procedureName,
      status: 'draft',
      medical_history: { continuousMedication: v.continuousMedication, medicationAllergy: v.medicationAllergy },
      aesthetics_history: { previousProcedures: v.previousProcedures, complications: v.complications },
      expectations: v.expectations,
      awareness: v.awareness,
    }),
    onSuccess: () => {
      toast.success('Anamnese criada.');
      qc.invalidateQueries({ queryKey: ['anamneses'] });
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao criar anamnese'),
  });

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; data: NewAnamnesisValues }) => updateAnamnesis(vars.id, {
      patient_id: vars.data.patientId,
      patient_name: vars.data.patientName,
      procedure_id: vars.data.procedureId,
      procedure_name: vars.data.procedureName,
      medical_history: { continuousMedication: vars.data.continuousMedication, medicationAllergy: vars.data.medicationAllergy },
      aesthetics_history: { previousProcedures: vars.data.previousProcedures, complications: vars.data.complications },
      expectations: vars.data.expectations,
      awareness: vars.data.awareness,
    }),
    onSuccess: () => {
      toast.success('Anamnese atualizada.');
      qc.invalidateQueries({ queryKey: ['anamneses'] });
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao atualizar anamnese'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAnamnesis(id),
    onSuccess: () => {
      toast.success('Anamnese removida.');
      qc.invalidateQueries({ queryKey: ['anamneses'] });
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao remover anamnese'),
  });

  const sendLinkMutation = useMutation({
    mutationFn: (id: string) => updateAnamnesis(id, { status: 'link_sent' }),
    onSuccess: () => {
      toast.success('Link de anamnese enviado ao paciente.');
      qc.invalidateQueries({ queryKey: ['anamneses'] });
    },
    onError: (e: any) => toast.error(e.message || 'Erro ao enviar link'),
  });

  return {
    // state
    items,
    filtered,
    search,
    setSearch,
    selected,
    setSelected,
    isNewOpen,
    setIsNewOpen,
    isEditOpen,
    setIsEditOpen,
    isDeleteOpen,
    setIsDeleteOpen,
    // actions
    createItem: (v: NewAnamnesisValues) => createMutation.mutate(v),
    updateItem: (id: string, v: NewAnamnesisValues) => updateMutation.mutate({ id, data: v }),
    deleteItem: (id: string) => deleteMutation.mutate(id),
    sendLink: (id: string) => sendLinkMutation.mutate(id),
  };
};
