import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Stethoscope } from 'lucide-react';
import { AnamnesisForm } from './AnamnesisForm';
import { Dialog as UIDialog } from '@/components/ui/dialog';
import { AnamnesisQuestionnaireForm, type AnamnesisQuestionnaireValues } from './AnamnesisQuestionnaireForm';
import { useState } from 'react';
import { createAnamnesis, updateAnamnesis } from '@/integrations/supabase/anamneses';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { NewAnamnesisValues } from '@/hooks/useAnamneses';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (values: NewAnamnesisValues) => void;
}

export const NewAnamnesisDialog: React.FC<Props> = ({ open, onOpenChange, onSubmit }) => {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [prefill, setPrefill] = useState<Partial<AnamnesisQuestionnaireValues> | undefined>(undefined);
  const qc = useQueryClient();
  const [sending, setSending] = useState(false);

  const handleSendLink = async (payload: { patientId: string; patientName: string; procedureId: string; procedureName: string; whatsapp: string }) => {
    try {
      setSending(true);
      const digits = (payload.whatsapp || '').replace(/\D/g, '');
      const whatsappE164 = digits.startsWith('55') ? digits : `55${digits}`;

      const resp = await fetch('https://smart-termos-n8n.t9frad.easypanel.host/webhook/send-anamnese', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, whatsapp: whatsappE164 }),
      });

      if (!resp.ok) {
        toast.error('Não foi possível enviar o link.');
        return;
      }

      toast.success('Link enviado com sucesso.');

      try {
        const created = await createAnamnesis({
          patient_id: payload.patientId,
          patient_name: payload.patientName,
          procedure_id: payload.procedureId,
          procedure_name: payload.procedureName,
          status: 'draft',
        });
        await updateAnamnesis(created.id, { status: 'link_sent' });
        await qc.invalidateQueries({ queryKey: ['anamneses'] });
      } catch (dbErr) {
        console.error(dbErr);
        toast.warning('Link enviado, mas não foi possível registrar no sistema.');
      }

      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast.error('Não foi possível enviar o link.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setShowQuestionnaire(false); } onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Nova Anamnese</DialogTitle>
              <DialogDescription>Faça agora ou envie um link ao paciente.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />

        {showQuestionnaire ? (
          <AnamnesisQuestionnaireForm
            defaultValues={prefill}
            onSubmit={async (qv) => {
              try {
                setSending(true);
                await createAnamnesis({
                  patient_id: qv.patientId,
                  patient_name: qv.patientName,
                  procedure_id: qv.procedureId,
                  procedure_name: qv.procedureName,
                  status: 'completed',
                  medical_history: {
                    continuousMedication: qv.continuousMedication,
                    medicationAllergy: qv.medicationAllergy,
                    chronicDisease: qv.chronicDisease,
                    chronicDiseaseOther: qv.chronicDiseaseOther,
                    medicationAllergyDescription: qv.medicationAllergyDescription,
                    reactionToProcedures: qv.reactionToProcedures,
                    painTolerance: qv.painTolerance,
                    awareResultsVary: qv.awareResultsVary,
                  } as any,
                  aesthetics_history: {
                    previousProcedures: qv.previousFacialProcedures,
                    complications: qv.hadComplicationsBefore,
                    previousFacialProcedureOption: qv.previousFacialProcedureOption,
                    previousFacialProcedureOther: qv.previousFacialProcedureOther,
                    complicationsDescription: qv.complicationsDescription,
                  } as any,
                  expectations: qv.intendedProcedureDescription,
                  awareness: qv.knowledgeLevelDescription,
                });
                await qc.invalidateQueries({ queryKey: ['anamneses'] });
                toast.success('Anamnese salva.');
                setShowQuestionnaire(false);
                onOpenChange(false);
              } catch (e) {
                console.error(e);
                toast.error('Não foi possível salvar a anamnese.');
              } finally {
                setSending(false);
              }
            }}
            onCancel={() => setShowQuestionnaire(false)}
            submitLabel={sending ? 'Salvando...' : 'Salvar'}
          />
        ) : (
          <AnamnesisForm
            onSubmit={(v) => {
              setPrefill({
                patientId: v.patientId,
                patientName: v.patientName,
                procedureId: v.procedureId,
                procedureName: v.procedureName,
                // valores de contato serão hidratados pelo questionnaire usando o paciente selecionado
              });
              setShowQuestionnaire(true);
            }}
            onCancel={() => onOpenChange(false)}
            onSendLink={sending ? undefined : handleSendLink}
            submitLabel="Fazer agora"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
