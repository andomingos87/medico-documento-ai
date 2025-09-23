import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Stethoscope } from 'lucide-react';
import type { Anamnesis } from '@/hooks/useAnamneses';
import { Button } from '@/components/ui/button';
import { AnamnesisQuestionnaireForm, type AnamnesisQuestionnaireValues } from './AnamnesisQuestionnaireForm';
import { updateAnamnesis } from '@/integrations/supabase/anamneses';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  item: Anamnesis | null;
}

export const ViewAnamnesisDialog: React.FC<Props> = ({ open, onOpenChange, item }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  // Garantir que ao reabrir a modal, comece em modo visualização
  useEffect(() => {
    if (!open) {
      setEditing(false);
    }
  }, [open]);

  const handleSubmit = async (qv: AnamnesisQuestionnaireValues) => {
    if (!item) return;
    try {
      setSaving(true);
      await updateAnamnesis(item.id, {
        medical_history: {
          continuousMedication: qv.continuousMedication,
          medicationAllergy: qv.medicationAllergy,
          chronicDisease: qv.chronicDisease,
          chronicDiseaseOther: qv.chronicDiseaseOther,
          medicationAllergyDescription: qv.medicationAllergyDescription,
          reactionToProcedures: qv.reactionToProcedures,
          painTolerance: qv.painTolerance,
          awareResultsVary: qv.awareResultsVary,
        },
        aesthetics_history: {
          previousProcedures: qv.previousFacialProcedures,
          complications: qv.hadComplicationsBefore,
          previousFacialProcedureOption: qv.previousFacialProcedureOption,
          previousFacialProcedureOther: qv.previousFacialProcedureOther,
          complicationsDescription: qv.complicationsDescription,
        },
        expectations: qv.intendedProcedureDescription,
        awareness: qv.knowledgeLevelDescription,
        status: 'completed',
      });
      await qc.invalidateQueries({ queryKey: ['anamneses'] });
      toast.success('Anamnese salva.');
      setEditing(false);
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast.error('Não foi possível salvar a anamnese.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Detalhes da Anamnese</DialogTitle>
              <DialogDescription>Visualize as informações preenchidas.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <Separator className="my-2" />
        {item && editing ? (
          <AnamnesisQuestionnaireForm
            defaultValues={{
              patientId: item.patientId,
              patientName: item.patientName,
              procedureId: item.procedureId,
              procedureName: item.procedureName,
              continuousMedication: item.medicalHistory?.continuousMedication ?? false,
              medicationAllergy: item.medicalHistory?.medicationAllergy ?? false,
              previousFacialProcedures: item.aestheticsHistory?.previousProcedures ?? false,
              hadComplicationsBefore: item.aestheticsHistory?.complications ?? false,
              intendedProcedureDescription: item.expectations ?? '',
              knowledgeLevelDescription: item.awareness ?? '',
              chronicDisease: (item as any)?.medicalHistory?.chronicDisease ?? 'nao',
              chronicDiseaseOther: (item as any)?.medicalHistory?.chronicDiseaseOther ?? '',
              medicationAllergyDescription: (item as any)?.medicalHistory?.medicationAllergyDescription ?? '',
              previousFacialProcedureOption: (item as any)?.aestheticsHistory?.previousFacialProcedureOption,
              previousFacialProcedureOther: (item as any)?.aestheticsHistory?.previousFacialProcedureOther ?? '',
              complicationsDescription: (item as any)?.aestheticsHistory?.complicationsDescription ?? '',
              reactionToProcedures: (item as any)?.medicalHistory?.reactionToProcedures ?? 'muito_tranquilo',
              painTolerance: (item as any)?.medicalHistory?.painTolerance ?? 'media',
              awareResultsVary: (item as any)?.medicalHistory?.awareResultsVary ?? false,
            } as Partial<AnamnesisQuestionnaireValues>}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(false)}
            submitLabel={saving ? 'Salvando...' : 'Salvar'}
          />
        ) : item && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-500">Paciente</p>
                <p className="font-medium">{item.patientName}</p>
              </div>
              <div>
                <p className="text-neutral-500">Procedimento</p>
                <p className="font-medium">{item.procedureName}</p>
              </div>
              <div>
                <p className="text-neutral-500">Data</p>
                <p className="font-medium">{new Date(item.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-neutral-500">Status</p>
                <p className="font-medium">{item.status === 'draft' ? 'Rascunho' : item.status === 'link_sent' ? 'Link enviado' : 'Concluída'}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Histórico Médico</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Uso contínuo de medicamentos: <b>{item.medicalHistory?.continuousMedication ? 'Sim' : 'Não'}</b></li>
                <li>Alergia a medicamentos: <b>{item.medicalHistory?.medicationAllergy ? 'Sim' : 'Não'}</b></li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Saúde</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Doença crônica:
                  <b className="ml-1">{
                    (() => {
                      const cd = (item as any)?.medicalHistory?.chronicDisease as string | undefined;
                      const other = (item as any)?.medicalHistory?.chronicDiseaseOther as string | undefined;
                      if (!cd) return '-';
                      const map: Record<string, string> = {
                        nao: 'Não',
                        hipertensao: 'Hipertensão',
                        diabetes: 'Diabetes',
                        cardiopatia: 'Cardiopatia',
                        outra: other?.trim() ? `Outra: ${other}` : 'Outra',
                      };
                      return map[cd] ?? '-';
                    })()
                  }</b>
                </li>
                <li>
                  Alergia (descrição):
                  <b className="ml-1">{(item as any)?.medicalHistory?.medicationAllergyDescription?.trim() || '-'}</b>
                </li>
              </ul>
            </div>
            <Separator />
            <div>
              <p className="font-medium mb-2">Procedimentos Estéticos</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Anteriores: <b>{item.aestheticsHistory?.previousProcedures ? 'Sim' : 'Não'}</b></li>
                <li>Complicações: <b>{item.aestheticsHistory?.complications ? 'Sim' : 'Não'}</b></li>
                <li>
                  Procedimento anterior:
                  <b className="ml-1">{
                    (() => {
                      const opt = (item as any)?.aestheticsHistory?.previousFacialProcedureOption as string | undefined;
                      const other = (item as any)?.aestheticsHistory?.previousFacialProcedureOther as string | undefined;
                      if (!opt) return '-';
                      const map: Record<string, string> = {
                        toxina_botulinica: 'Toxina Botulínica',
                        preenchimento: 'Preenchimento',
                        bioestimulador: 'Bioestimulador',
                        peeling: 'Peeling',
                        microagulhamento: 'Microagulhamento',
                        outro: other?.trim() ? `Outro: ${other}` : 'Outro',
                      };
                      return map[opt] ?? '-';
                    })()
                  }</b>
                </li>
                <li>
                  Complicações (descrição):
                  <b className="ml-1">{(item as any)?.aestheticsHistory?.complicationsDescription?.trim() || '-'}</b>
                </li>
              </ul>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-500">Expectativas e características</p>
                <p className="whitespace-pre-wrap">{item.expectations?.trim() ? item.expectations : '-'}</p>
              </div>
              <div>
                <p className="text-neutral-500">Consciência sobre resultados</p>
                <p className="whitespace-pre-wrap">{item.awareness?.trim() ? item.awareness : '-'}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-neutral-500">Reação a procedimentos</p>
                <p className="font-medium">{
                  (() => {
                    const v = (item as any)?.medicalHistory?.reactionToProcedures as string | undefined;
                    const map: Record<string, string> = {
                      muito_tranquilo: 'Muito tranquilo(a)',
                      um_pouco_ansioso: 'Um pouco ansioso(a)',
                      muito_ansioso: 'Muito ansioso(a)'
                    };
                    return (v && map[v]) || '-';
                  })()
                }</p>
              </div>
              <div>
                <p className="text-neutral-500">Tolerância à dor</p>
                <p className="font-medium">{
                  (() => {
                    const v = (item as any)?.medicalHistory?.painTolerance as string | undefined;
                    const map: Record<string, string> = { alta: 'Alta', media: 'Média', baixa: 'Baixa' };
                    return (v && map[v]) || '-';
                  })()
                }</p>
              </div>
              <div>
                <p className="text-neutral-500">Ciente de variação de resultados</p>
                <p className="font-medium">{(item as any)?.medicalHistory?.awareResultsVary ? 'Sim' : ((item as any)?.medicalHistory?.awareResultsVary === false ? 'Não' : '-')}</p>
              </div>
            </div>
          </div>
        )}
        {!editing && item && (
          <div className="flex justify-end pt-2">
            <Button variant="default" onClick={() => setEditing(true)}>Realizar anamnese</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
