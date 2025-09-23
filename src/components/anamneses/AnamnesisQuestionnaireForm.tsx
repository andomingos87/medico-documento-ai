import React, { useEffect, useMemo, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PatientCombobox } from '@/components/patients/PatientCombobox';
import { ProcedureCombobox } from '@/components/procedures/ProcedureCombobox';
import { usePatients } from '@/hooks/usePatients';

export type AnamnesisQuestionnaireValues = {
  // Dados do paciente (vindos da base)
  patientId: string;
  patientName: string;
  phone?: string;
  email?: string;
  birthdate?: string; // ISO yyyy-mm-dd

  // Procedimento pretendido (da base de procedimentos)
  procedureId: string;
  procedureName: string;

  // Saúde
  chronicDisease: 'nao' | 'hipertensao' | 'diabetes' | 'cardiopatia' | 'outra';
  chronicDiseaseOther?: string;

  continuousMedication: boolean;
  medicationAllergy: boolean;
  medicationAllergyDescription?: string;

  previousFacialProcedures: boolean;
  previousFacialProcedureOption?: 'toxina_botulinica' | 'preenchimento' | 'bioestimulador' | 'peeling' | 'microagulhamento' | 'outro';
  previousFacialProcedureOther?: string;

  hadComplicationsBefore: boolean;
  complicationsDescription?: string;

  intendedProcedureDescription: string;
  knowledgeLevelDescription: string;

  reactionToProcedures: 'muito_tranquilo' | 'um_pouco_ansioso' | 'muito_ansioso';
  painTolerance: 'alta' | 'media' | 'baixa';
  awareResultsVary: boolean;
};

interface Props {
  defaultValues?: Partial<AnamnesisQuestionnaireValues>;
  onSubmit: (values: AnamnesisQuestionnaireValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export const AnamnesisQuestionnaireForm: React.FC<Props> = ({ defaultValues, onSubmit, onCancel, submitLabel = 'Salvar' }) => {
  const { getPatientById, patients } = usePatients();

  const [values, setValues] = useState<AnamnesisQuestionnaireValues>({
    patientId: defaultValues?.patientId ?? '',
    patientName: defaultValues?.patientName ?? '',
    phone: defaultValues?.phone ?? '',
    email: defaultValues?.email ?? '',
    birthdate: defaultValues?.birthdate ?? '',

    procedureId: defaultValues?.procedureId ?? '',
    procedureName: defaultValues?.procedureName ?? '',

    chronicDisease: defaultValues?.chronicDisease ?? 'nao',
    chronicDiseaseOther: defaultValues?.chronicDiseaseOther ?? '',

    continuousMedication: defaultValues?.continuousMedication ?? false,
    medicationAllergy: defaultValues?.medicationAllergy ?? false,
    medicationAllergyDescription: defaultValues?.medicationAllergyDescription ?? '',

    previousFacialProcedures: defaultValues?.previousFacialProcedures ?? false,
    previousFacialProcedureOption: defaultValues?.previousFacialProcedureOption ?? undefined,
    previousFacialProcedureOther: defaultValues?.previousFacialProcedureOther ?? '',

    hadComplicationsBefore: defaultValues?.hadComplicationsBefore ?? false,
    complicationsDescription: defaultValues?.complicationsDescription ?? '',

    intendedProcedureDescription: defaultValues?.intendedProcedureDescription ?? '',
    knowledgeLevelDescription: defaultValues?.knowledgeLevelDescription ?? '',

    reactionToProcedures: defaultValues?.reactionToProcedures ?? 'muito_tranquilo',
    painTolerance: defaultValues?.painTolerance ?? 'media',
    awareResultsVary: defaultValues?.awareResultsVary ?? false,
  });

  const canSubmit = useMemo(() => {
    if (!values.patientId || !values.procedureId) return false;
    if (values.chronicDisease === 'outra' && !values.chronicDiseaseOther?.trim()) return false;
    if (values.medicationAllergy && !values.medicationAllergyDescription?.trim()) return false;
    if (values.previousFacialProcedures) {
      if (!values.previousFacialProcedureOption) return false;
      if (values.previousFacialProcedureOption === 'outro' && !values.previousFacialProcedureOther?.trim()) return false;
    }
    if (values.hadComplicationsBefore && !values.complicationsDescription?.trim()) return false;
    if (!values.intendedProcedureDescription.trim()) return false;
    if (!values.knowledgeLevelDescription.trim()) return false;
    return true;
  }, [values]);

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit(values); }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Paciente</Label>
          <PatientCombobox
            value={values.patientId}
            onValueChange={(id, name) => {
              const p = getPatientById(id);
              setValues(v => ({
                ...v,
                patientId: id,
                patientName: name,
                phone: p?.phone ?? v.phone ?? '',
                email: p?.email ?? v.email ?? '',
                birthdate: p?.birth_date ?? v.birthdate ?? '',
              }));
            }}
            placeholder="Buscar paciente..."
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

      {/* Prefill fallback when patient already selected via defaultValues */}
      {/* Hidratação automática quando abrir com paciente pré-selecionado */}
      {/* Atualiza assim que a lista de pacientes carregar */}
      <PrefillPatientDetails
        patientId={values.patientId}
        onHydrate={(p) => {
          setValues(v => ({
            ...v,
            phone: v.phone || p?.phone || '',
            email: v.email || p?.email || '',
            birthdate: v.birthdate || p?.birth_date || '',
          }));
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Telefone</Label>
          <Input value={values.phone ?? ''} onChange={(e) => setValues(v => ({ ...v, phone: e.target.value }))} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={values.email ?? ''} onChange={(e) => setValues(v => ({ ...v, email: e.target.value }))} />
        </div>
        <div>
          <Label>Data de nascimento</Label>
          <Input type="date" value={values.birthdate ?? ''} onChange={(e) => setValues(v => ({ ...v, birthdate: e.target.value }))} />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <Label>Você possui alguma doença crônica?</Label>
          <div className="mt-2">
            <Select
              value={values.chronicDisease}
              onValueChange={(val) => setValues(v => ({ ...v, chronicDisease: val as AnamnesisQuestionnaireValues['chronicDisease'] }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nao">Não</SelectItem>
                <SelectItem value="hipertensao">Hipertensão</SelectItem>
                <SelectItem value="diabetes">Diabetes</SelectItem>
                <SelectItem value="cardiopatia">Cardiopatia</SelectItem>
                <SelectItem value="outra">Outra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {values.chronicDisease === 'outra' && (
            <div className="mt-3">
              <Label>Qual?</Label>
              <Input value={values.chronicDiseaseOther ?? ''} onChange={(e) => setValues(v => ({ ...v, chronicDiseaseOther: e.target.value }))} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between gap-4 border rounded-md p-3">
            <div>
              <Label>Faz uso contínuo de medicamentos?</Label>
            </div>
            <Switch
              checked={values.continuousMedication}
              onCheckedChange={(checked) => setValues(v => ({ ...v, continuousMedication: checked }))}
            />
          </div>

          <div className="flex items-center justify-between gap-4 border rounded-md p-3">
            <div>
              <Label>Possui alergia a medicamento/substância?</Label>
            </div>
            <Switch
              checked={values.medicationAllergy}
              onCheckedChange={(checked) => setValues(v => ({ ...v, medicationAllergy: checked, medicationAllergyDescription: checked ? v.medicationAllergyDescription : '' }))}
            />
          </div>
        </div>
        {values.medicationAllergy && (
          <div>
            <Label>Qual(is)?</Label>
            <Input value={values.medicationAllergyDescription ?? ''} onChange={(e) => setValues(v => ({ ...v, medicationAllergyDescription: e.target.value }))} />
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border rounded-md p-3">
          <div>
            <Label>Já realizou procedimentos estéticos no rosto?</Label>
          </div>
          <Switch
            checked={values.previousFacialProcedures}
            onCheckedChange={(checked) => setValues(v => ({ ...v, previousFacialProcedures: checked, previousFacialProcedureOption: checked ? v.previousFacialProcedureOption : undefined, previousFacialProcedureOther: checked ? v.previousFacialProcedureOther : '' }))}
          />
        </div>

        {values.previousFacialProcedures && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Qual procedimento?</Label>
              <div className="mt-2">
                <Select
                  value={values.previousFacialProcedureOption ?? ''}
                  onValueChange={(val) => setValues(v => ({ ...v, previousFacialProcedureOption: val as NonNullable<AnamnesisQuestionnaireValues['previousFacialProcedureOption']> }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toxina_botulinica">Toxina Botulínica</SelectItem>
                    <SelectItem value="preenchimento">Preenchimento</SelectItem>
                    <SelectItem value="bioestimulador">Bioestimulador</SelectItem>
                    <SelectItem value="peeling">Peeling</SelectItem>
                    <SelectItem value="microagulhamento">Microagulhamento</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {values.previousFacialProcedureOption === 'outro' && (
              <div>
                <Label>Outro (descreva)</Label>
                <Input value={values.previousFacialProcedureOther ?? ''} onChange={(e) => setValues(v => ({ ...v, previousFacialProcedureOther: e.target.value }))} />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border rounded-md p-3">
          <div>
            <Label>Teve alguma complicação em procedimentos anteriores?</Label>
          </div>
          <Switch
            checked={values.hadComplicationsBefore}
            onCheckedChange={(checked) => setValues(v => ({ ...v, hadComplicationsBefore: checked, complicationsDescription: checked ? v.complicationsDescription : '' }))}
          />
        </div>
        {values.hadComplicationsBefore && (
          <div>
            <Label>Qual(is)?</Label>
            <Input value={values.complicationsDescription ?? ''} onChange={(e) => setValues(v => ({ ...v, complicationsDescription: e.target.value }))} />
          </div>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Qual procedimento você pretende realizar nesta clínica?</Label>
          <Textarea rows={4} value={values.intendedProcedureDescription} onChange={(e) => setValues(v => ({ ...v, intendedProcedureDescription: e.target.value }))} />
        </div>
        <div>
          <Label>Qual seu nível de conhecimento sobre este procedimento?</Label>
          <Textarea rows={4} value={values.knowledgeLevelDescription} onChange={(e) => setValues(v => ({ ...v, knowledgeLevelDescription: e.target.value }))} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Como você reage diante de procedimentos médicos/estéticos?</Label>
          <div className="mt-2">
            <Select
              value={values.reactionToProcedures}
              onValueChange={(val) => setValues(v => ({ ...v, reactionToProcedures: val as AnamnesisQuestionnaireValues['reactionToProcedures'] }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="muito_tranquilo">Muito tranquilo(a)</SelectItem>
                <SelectItem value="um_pouco_ansioso">Um pouco ansioso(a)</SelectItem>
                <SelectItem value="muito_ansioso">Muito ansioso(a)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Qual sua tolerância à dor?</Label>
          <div className="mt-2">
            <Select
              value={values.painTolerance}
              onValueChange={(val) => setValues(v => ({ ...v, painTolerance: val as AnamnesisQuestionnaireValues['painTolerance'] }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label>Você está ciente de que os resultados variam de pessoa para pessoa?</Label>
          </div>
          <Switch
            checked={values.awareResultsVary}
            onCheckedChange={(checked) => setValues(v => ({ ...v, awareResultsVary: checked }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={!canSubmit}>{submitLabel}</Button>
      </div>
    </form>
  );
};

export default AnamnesisQuestionnaireForm;

// Prefill via effect so que abre já hidratado, mesmo sem re-selecionar
const PrefillPatientDetails: React.FC<{ patientId: string; onHydrate: (p: { phone?: string; email?: string; birth_date?: string } | undefined) => void }> = ({ patientId, onHydrate }) => {
  const { getPatientById, patients } = usePatients();
  useEffect(() => {
    if (!patientId) return;
    const p = getPatientById(patientId);
    onHydrate(p);
  }, [patientId, patients]);
  return null;
};


