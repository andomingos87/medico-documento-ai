import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { NewAnamnesisValues } from '@/hooks/useAnamneses';
import { PatientCombobox } from '@/components/patients/PatientCombobox';
import { ProcedureCombobox } from '@/components/procedures/ProcedureCombobox';
import { usePatients } from '@/hooks/usePatients';

interface Props {
  defaultValues?: Partial<NewAnamnesisValues>;
  onSubmit: (values: NewAnamnesisValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export const AnamnesisForm: React.FC<Props> = ({ defaultValues, onSubmit, onCancel, submitLabel = 'Enviar link' }) => {
  const { getPatientById } = usePatients();

  // Estado mínimo necessário para criação do link
  const [values, setValues] = useState<NewAnamnesisValues>({
    patientId: defaultValues?.patientId ?? '',
    patientName: defaultValues?.patientName ?? '',
    procedureId: defaultValues?.procedureId ?? '',
    procedureName: defaultValues?.procedureName ?? '',
    // Os campos abaixo não são usados nesta etapa, mas mantidos para compatibilidade de tipo
    continuousMedication: false,
    medicationAllergy: false,
    previousProcedures: false,
    complications: false,
    expectations: '',
    awareness: '',
  });

  // WhatsApp preenchido a partir do paciente, porém editável
  const [whatsapp, setWhatsapp] = useState<string>('');

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Paciente</Label>
          <PatientCombobox
            value={values.patientId}
            onValueChange={(id, name) => {
              setValues(v => ({ ...v, patientId: id, patientName: name }));
              const p = getPatientById(id);
              setWhatsapp(p?.phone ?? '');
            }}
            placeholder="Buscar paciente ou adicionar novo..."
          />
        </div>
        <div>
          <Label>Procedimento</Label>
          <ProcedureCombobox
            value={values.procedureId}
            onValueChange={(id, name) => setValues(v => ({ ...v, procedureId: id, procedureName: name }))}
            placeholder="Buscar procedimento..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1 col-span-1">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            placeholder="(00) 00000-0000"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="button">{submitLabel}</Button>
      </div>
    </form>
  );
};

