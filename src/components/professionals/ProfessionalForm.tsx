import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NewProfessionalValues, ProfessionalRole } from '@/hooks/useProfessionals';
import { PROFESSIONAL_ROLES } from '@/hooks/useProfessionals';

interface Props {
  defaultValues?: Partial<NewProfessionalValues>;
  onSubmit: (values: NewProfessionalValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export const ProfessionalForm: React.FC<Props> = ({ defaultValues, onSubmit, onCancel, submitLabel = 'Salvar' }) => {
  const [values, setValues] = useState<NewProfessionalValues>({
    name: defaultValues?.name ?? '',
    phone: defaultValues?.phone ?? '',
    email: defaultValues?.email ?? '',
    role: (defaultValues?.role as ProfessionalRole) ?? 'Médico',
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const onlyDigits = (s: string) => s.replace(/\D/g, '');
  const formatBRPhone = (raw: string) => {
    const d = onlyDigits(raw).slice(0, 11);
    if (d.length <= 10) {
      // (##) ####-####
      const p1 = d.slice(0, 2);
      const p2 = d.slice(2, 6);
      const p3 = d.slice(6, 10);
      return [
        p1 ? `(${p1}` : '',
        p1 && p1.length === 2 ? ') ' : '',
        p2,
        p3 ? `-${p3}` : '',
      ].join('');
    }
    // 11 digits -> (##) #####-####
    const p1 = d.slice(0, 2);
    const p2 = d.slice(2, 7);
    const p3 = d.slice(7, 11);
    return [
      p1 ? `(${p1}` : '',
      p1 && p1.length === 2 ? ') ' : '',
      p2,
      p3 ? `-${p3}` : '',
    ].join('');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const digits = values.phone ? values.phone.replace(/\D/g, '') : '';
        if (digits && digits.length !== 10 && digits.length !== 11) {
          setPhoneError('Informe um telefone válido (10 ou 11 dígitos).');
          return;
        }
        setPhoneError(null);
        onSubmit(values);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" value={values.name} onChange={(e) => setValues(v => ({ ...v, name: e.target.value }))} placeholder="Nome completo" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={values.email} onChange={(e) => setValues(v => ({ ...v, email: e.target.value }))} placeholder="email@exemplo.com" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={values.phone ?? ''}
            onChange={(e) => {
              const formatted = formatBRPhone(e.target.value);
              setValues(v => ({ ...v, phone: formatted }));
              if (phoneError) setPhoneError(null);
            }}
            placeholder="(11) 90000-0000"
            inputMode="numeric"
          />
          {phoneError && (
            <p className="mt-1 text-xs text-red-600">{phoneError}</p>
          )}
        </div>
        <div>
          <Label>Função</Label>
          <Select value={values.role} onValueChange={(val) => setValues(v => ({ ...v, role: val as ProfessionalRole }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent>
              {PROFESSIONAL_ROLES.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
};
