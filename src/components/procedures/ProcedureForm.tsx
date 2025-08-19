import React from 'react';
import { ProcedureCategory } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface ProcedureFormValues {
  name: string;
  category: ProcedureCategory;
  description: string;
  risks: string;
  contraindications: string;
}

interface ProcedureFormProps {
  defaultValues?: ProcedureFormValues;
  onSubmit: (values: ProcedureFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const CATEGORIES: ProcedureCategory[] = ['Geral', 'Cirúrgico', 'Estético', 'Diagnóstico', 'Terapêutico'];

export const ProcedureForm: React.FC<ProcedureFormProps> = ({ defaultValues, onSubmit, onCancel, submitLabel = 'Salvar' }) => {
  const [values, setValues] = React.useState<ProcedureFormValues>(
    defaultValues ?? { name: '', category: 'Geral', description: '', risks: '', contraindications: '' }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Procedimento</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => setValues(v => ({ ...v, name: e.target.value }))}
          placeholder="Ex.: Limpeza dental"
        />
      </div>

      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select value={values.category} onValueChange={(val) => setValues(v => ({ ...v, category: val as ProcedureCategory }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => setValues(v => ({ ...v, description: e.target.value }))}
          placeholder="Descreva o procedimento, objetivos e como é realizado."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="risks">Riscos</Label>
        <Textarea
          id="risks"
          value={values.risks}
          onChange={(e) => setValues(v => ({ ...v, risks: e.target.value }))}
          placeholder="Liste os possíveis riscos e efeitos colaterais."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contraindications">Contraindicações</Label>
        <Textarea
          id="contraindications"
          value={values.contraindications}
          onChange={(e) => setValues(v => ({ ...v, contraindications: e.target.value }))}
          placeholder="Liste as contraindicações ao procedimento."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
};
