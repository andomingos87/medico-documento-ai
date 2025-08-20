import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Clock } from 'lucide-react';
import { PatientCombobox } from '@/components/patients/PatientCombobox';
import { ProfessionalCombobox } from '@/components/professionals/ProfessionalCombobox';
import { ProcedureCombobox } from '@/components/procedures/ProcedureCombobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { NewAppointment } from '@/integrations/supabase/appointments';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (values: NewAppointment) => Promise<void> | void;
}

export const NewAppointmentDialog: React.FC<Props> = ({ open, onOpenChange, onSubmit }) => {
  const [patientId, setPatientId] = useState<string>('');
  const [professionalId, setProfessionalId] = useState<string>('');
  const [procedureId, setProcedureId] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [duration, setDuration] = useState<number>(60);
  const [status, setStatus] = useState<'agendado' | 'confirmado' | 'cancelado' | 'concluido'>('agendado');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !scheduledAt) return;
    try {
      setSubmitting(true);
      await onSubmit({
        patient_id: patientId,
        professional_id: professionalId || null,
        procedure_id: procedureId || null,
        scheduled_at: new Date(scheduledAt).toISOString(),
        duration_minutes: duration,
        status,
        notes: notes || null,
      });
      onOpenChange(false);
      // reset
      setPatientId('');
      setProfessionalId('');
      setProcedureId('');
      setScheduledAt('');
      setDuration(60);
      setStatus('agendado');
      setNotes('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Novo Agendamento</DialogTitle>
              <DialogDescription>Selecione paciente, profissional, procedimento e defina data/hora.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Paciente</Label>
              <PatientCombobox value={patientId} onValueChange={(id, _name) => setPatientId(id)} />
            </div>
            <div className="space-y-2">
              <Label>Profissional</Label>
              <ProfessionalCombobox value={professionalId} onValueChange={(id, _name) => setProfessionalId(id)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Procedimento</Label>
              <ProcedureCombobox value={procedureId} onValueChange={(id, _name) => setProcedureId(id)} />
            </div>
            <div className="space-y-2">
              <Label>Data e hora</Label>
              <div className="flex items-center gap-2">
                <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Duração (min)</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input type="number" min={5} step={5} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 0)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agendado">Agendado</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Observações</Label>
              <textarea
                className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Anotações adicionais..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!patientId || !scheduledAt || submitting}>
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
