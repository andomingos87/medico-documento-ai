import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { listProcedures } from '@/integrations/supabase/procedures';
import { listPatients } from '@/integrations/supabase/patients';
import type { ComprehensionLevel, DeliveryChannel } from '@/integrations/supabase/documents';

export type DocumentStatusFilter = 'Todos' | 'rascunho' | 'pendente' | 'assinado';
export type ComprehensionFilter = 'Todos' | ComprehensionLevel;
export type ChannelFilter = 'Todos' | DeliveryChannel;

interface Props {
  search: string;
  onSearch: (v: string) => void;
  status: DocumentStatusFilter;
  onStatus: (v: DocumentStatusFilter) => void;
  total: number;
  // novos filtros
  procedureId?: string | 'Todos';
  onProcedureId?: (v: string | 'Todos') => void;
  patientId?: string | 'Todos';
  onPatientId?: (v: string | 'Todos') => void;
  comprehension?: ComprehensionFilter;
  onComprehension?: (v: ComprehensionFilter) => void;
  channel?: ChannelFilter;
  onChannel?: (v: ChannelFilter) => void;
  expiresUntil?: string | null;
  onExpiresUntil?: (v: string | null) => void;
}

const statusOptions: DocumentStatusFilter[] = ['Todos', 'rascunho', 'pendente', 'assinado'];
const comprehensionOptions: ComprehensionFilter[] = ['Todos', 'leigo', 'tecnico', 'avancado'];
const channelOptions: ChannelFilter[] = ['Todos', 'email', 'whatsapp'];

export const DocumentsFilterBar: React.FC<Props> = ({
  search,
  onSearch,
  status,
  onStatus,
  total,
  procedureId = 'Todos',
  onProcedureId,
  patientId = 'Todos',
  onPatientId,
  comprehension = 'Todos',
  onComprehension,
  channel = 'Todos',
  onChannel,
  expiresUntil,
  onExpiresUntil,
}) => {
  const [procedures, setProcedures] = useState<{ id: string; name: string }[]>([]);
  const [patients, setPatients] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // carregar poucas opções ordenadas para combos
    listProcedures().then((rows) => setProcedures(rows.map(r => ({ id: r.id, name: r.name })))).catch(() => {});
    listPatients().then((rows) => setPatients(rows as any)).catch(() => {});
  }, []);

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <Input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar por paciente, procedimento ou título..."
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={status} onValueChange={(v) => onStatus(v as DocumentStatusFilter)}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => (
                <SelectItem key={s} value={s}>{s === 'Todos' ? 'Todos' : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Procedimento */}
          <Select value={procedureId} onValueChange={(v) => onProcedureId?.(v as any)}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="Selecione o procedimento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              {procedures.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="text-sm text-neutral-600">{total} {total === 1 ? 'termo' : 'termos'}</div>
    </div>
  );
};
