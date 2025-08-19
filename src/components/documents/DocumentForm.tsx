import React, { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { listProcedures } from '@/integrations/supabase/procedures';
import { listPatients } from '@/integrations/supabase/patients';
import type { ComprehensionLevel, DeliveryChannel, DocumentStatus, NewDocumentPayload } from '@/integrations/supabase/documents';

export type DocumentFormValues = {
  title: string;
  document_type: string;
  status: DocumentStatus;
  procedure_id?: string | null;
  patient_id?: string | null;
  comprehension_level?: ComprehensionLevel | null;
  delivery_channel?: DeliveryChannel | null;
  expires_at?: string | null;
};

const comprehensionOptions: ComprehensionLevel[] = ['leigo', 'tecnico', 'avancado'];
const channelOptions: DeliveryChannel[] = ['email', 'whatsapp'];
const statusOptions: DocumentStatus[] = ['rascunho', 'pendente', 'assinado'];

interface Props {
  initialValues?: Partial<DocumentFormValues>;
  submitting?: boolean;
  onSubmit: (values: DocumentFormValues) => void;
  formId?: string;
}

export const DocumentForm: React.FC<Props> = ({ initialValues, submitting, onSubmit, formId }) => {
  const [values, setValues] = useState<DocumentFormValues>({
    title: initialValues?.title ?? '',
    document_type: initialValues?.document_type ?? 'consentimento',
    status: initialValues?.status ?? 'rascunho',
    procedure_id: initialValues?.procedure_id ?? null,
    patient_id: initialValues?.patient_id ?? null,
    comprehension_level: initialValues?.comprehension_level ?? null,
    delivery_channel: initialValues?.delivery_channel ?? null,
    expires_at: initialValues?.expires_at ?? null,
  });

  const [procedures, setProcedures] = useState<{ id: string; name: string }[]>([]);
  const [patients, setPatients] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    listProcedures().then(rs => setProcedures(rs.map(r => ({ id: r.id, name: r.name })))).catch(() => {});
    listPatients().then(rs => setPatients(rs as any)).catch(() => {});
  }, []);

  const canSubmit = useMemo(() => values.title.trim().length > 0, [values.title]);

  return (
    <form
      id={formId ?? 'document-form'}
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit(values);
      }}
    >
      <div className="space-y-2">
        <Label>Título</Label>
        <Input
          value={values.title}
          onChange={(e) => setValues(v => ({ ...v, title: e.target.value }))}
          placeholder="Ex.: Termo de consentimento para Botox"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo de documento</Label>
          <Select value={values.document_type} onValueChange={(v) => setValues(val => ({ ...val, document_type: v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consentimento">Consentimento</SelectItem>
              <SelectItem value="informativo">Informativo</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={values.status} onValueChange={(v) => setValues(val => ({ ...val, status: v as DocumentStatus }))}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Procedimento</Label>
          <Select value={values.procedure_id ?? 'none'} onValueChange={(v) => setValues(val => ({ ...val, procedure_id: v === 'none' ? null : v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Não informado</SelectItem>
              {procedures.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Paciente</Label>
          <Select value={values.patient_id ?? 'none'} onValueChange={(v) => setValues(val => ({ ...val, patient_id: v === 'none' ? null : v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Não informado</SelectItem>
              {patients.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Nível de compreensão</Label>
          <Select value={values.comprehension_level ?? 'none'} onValueChange={(v) => setValues(val => ({ ...val, comprehension_level: v === 'none' ? null : (v as ComprehensionLevel) }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Não informado</SelectItem>
              {comprehensionOptions.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Canal de entrega</Label>
          <Select value={values.delivery_channel ?? 'none'} onValueChange={(v) => setValues(val => ({ ...val, delivery_channel: v === 'none' ? null : (v as DeliveryChannel) }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Não informado</SelectItem>
              {channelOptions.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Data de expiração</Label>
          <Input
            type="date"
            value={values.expires_at ?? ''}
            onChange={(e) => setValues(v => ({ ...v, expires_at: e.target.value || null }))}
          />
        </div>
      </div>

      {/* Ações no footer do Dialog */}
    </form>
  );
};
