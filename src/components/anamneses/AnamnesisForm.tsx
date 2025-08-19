import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { NewAnamnesisValues } from '@/hooks/useAnamneses';
import { PatientCombobox } from '@/components/patients/PatientCombobox';
import { ProcedureCombobox } from '@/components/procedures/ProcedureCombobox';

interface Props {
  defaultValues?: Partial<NewAnamnesisValues>;
  onSubmit: (values: NewAnamnesisValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export const AnamnesisForm: React.FC<Props> = ({ defaultValues, onSubmit, onCancel, submitLabel = 'Salvar' }) => {
  const [values, setValues] = useState<NewAnamnesisValues>({
    patientId: defaultValues?.patientId ?? '',
    patientName: defaultValues?.patientName ?? '',
    procedureId: defaultValues?.procedureId ?? '',
    procedureName: defaultValues?.procedureName ?? '',
    continuousMedication: defaultValues?.continuousMedication ?? false,
    medicationAllergy: defaultValues?.medicationAllergy ?? false,
    previousProcedures: defaultValues?.previousProcedures ?? false,
    complications: defaultValues?.complications ?? false,
    expectations: defaultValues?.expectations ?? '',
    awareness: defaultValues?.awareness ?? '',
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(values); }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Paciente</Label>
          <PatientCombobox
            value={values.patientId}
            onValueChange={(id, name) => setValues(v => ({ ...v, patientId: id, patientName: name }))}
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

      <Separator />

      <div className="space-y-2">
        <p className="text-sm font-medium">Histórico Médico</p>
        <div className="flex items-center space-x-2">
          <Checkbox id="continuousMedication" checked={values.continuousMedication}
            onCheckedChange={(c) => setValues(v => ({ ...v, continuousMedication: Boolean(c) }))} />
          <Label htmlFor="continuousMedication">Uso contínuo de medicamentos?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="medicationAllergy" checked={values.medicationAllergy}
            onCheckedChange={(c) => setValues(v => ({ ...v, medicationAllergy: Boolean(c) }))} />
          <Label htmlFor="medicationAllergy">Alergia a medicamentos?</Label>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="text-sm font-medium">Procedimentos Estéticos</p>
        <div className="flex items-center space-x-2">
          <Checkbox id="previousProcedures" checked={values.previousProcedures}
            onCheckedChange={(c) => setValues(v => ({ ...v, previousProcedures: Boolean(c) }))} />
          <Label htmlFor="previousProcedures">Procedimentos estéticos anteriores?</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="complications" checked={values.complications}
            onCheckedChange={(c) => setValues(v => ({ ...v, complications: Boolean(c) }))} />
          <Label htmlFor="complications">Complicações em procedimentos?</Label>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expectations">Expectativas e características</Label>
          <Textarea id="expectations" rows={4} placeholder="Descreva expectativas/ características"
            value={values.expectations}
            onChange={(e) => setValues(v => ({ ...v, expectations: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="awareness">Consciência sobre resultados</Label>
          <Textarea id="awareness" rows={4} placeholder="Registro de ciência sobre resultados"
            value={values.awareness}
            onChange={(e) => setValues(v => ({ ...v, awareness: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
};
