import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Stethoscope } from 'lucide-react';

export type PatientAnamnesisFormValues = {
  // Dados do paciente (somente leitura)
  patientName: string;
  phone: string;
  email: string;
  birthdate: string;
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
  patientData: {
    name: string;
    phone: string;
    email: string;
    birth_date: string;
  };
  procedureName: string;
  defaultValues?: Partial<PatientAnamnesisFormValues>;
  onSubmit: (values: PatientAnamnesisFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export const PatientAnamnesisForm: React.FC<Props> = ({ 
  patientData, 
  procedureName, 
  defaultValues, 
  onSubmit, 
  onCancel, 
  submitLabel = 'Finalizar Anamnese',
  isLoading = false
}) => {
  const [values, setValues] = useState<PatientAnamnesisFormValues>({
    // Dados do paciente (somente leitura)
    patientName: patientData.name,
    phone: patientData.phone,
    email: patientData.email,
    birthdate: patientData.birth_date,
    procedureName: procedureName,

    // Valores padrão ou do formulário
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

  const canSubmit = (() => {
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
  })();

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit(values); }}
    >
      {/* Informações do Paciente e Procedimento - Somente Leitura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Suas Informações
          </CardTitle>
          <CardDescription>
            Confirme se seus dados estão corretos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome Completo</Label>
              <Input value={values.patientName} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Procedimento</Label>
              <Input value={values.procedureName} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input value={values.phone} disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={values.email} disabled className="bg-gray-50" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Questionário de Saúde */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Questionário de Saúde</h3>
        </div>

        <div>
          <Label>Você possui alguma doença crônica?</Label>
          <div className="mt-2">
            <Select
              value={values.chronicDisease}
              onValueChange={(val) => setValues(v => ({ ...v, chronicDisease: val as PatientAnamnesisFormValues['chronicDisease'] }))}
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
              <Input 
                value={values.chronicDiseaseOther ?? ''} 
                onChange={(e) => setValues(v => ({ ...v, chronicDiseaseOther: e.target.value }))} 
                placeholder="Descreva sua condição"
              />
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
            <Input 
              value={values.medicationAllergyDescription ?? ''} 
              onChange={(e) => setValues(v => ({ ...v, medicationAllergyDescription: e.target.value }))} 
              placeholder="Descreva suas alergias"
            />
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
                  onValueChange={(val) => setValues(v => ({ ...v, previousFacialProcedureOption: val as NonNullable<PatientAnamnesisFormValues['previousFacialProcedureOption']> }))}
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
                <Input 
                  value={values.previousFacialProcedureOther ?? ''} 
                  onChange={(e) => setValues(v => ({ ...v, previousFacialProcedureOther: e.target.value }))} 
                  placeholder="Descreva o procedimento"
                />
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
            <Input 
              value={values.complicationsDescription ?? ''} 
              onChange={(e) => setValues(v => ({ ...v, complicationsDescription: e.target.value }))} 
              placeholder="Descreva as complicações"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Expectativas e Conhecimento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Qual procedimento você pretende realizar nesta clínica?</Label>
          <Textarea 
            rows={4} 
            value={values.intendedProcedureDescription} 
            onChange={(e) => setValues(v => ({ ...v, intendedProcedureDescription: e.target.value }))} 
            placeholder="Descreva o procedimento que pretende realizar"
          />
        </div>
        <div>
          <Label>Qual seu nível de conhecimento sobre este procedimento?</Label>
          <Textarea 
            rows={4} 
            value={values.knowledgeLevelDescription} 
            onChange={(e) => setValues(v => ({ ...v, knowledgeLevelDescription: e.target.value }))} 
            placeholder="Descreva seu conhecimento sobre o procedimento"
          />
        </div>
      </div>

      {/* Reações e Tolerância */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Como você reage diante de procedimentos médicos/estéticos?</Label>
          <div className="mt-2">
            <Select
              value={values.reactionToProcedures}
              onValueChange={(val) => setValues(v => ({ ...v, reactionToProcedures: val as PatientAnamnesisFormValues['reactionToProcedures'] }))}
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
              onValueChange={(val) => setValues(v => ({ ...v, painTolerance: val as PatientAnamnesisFormValues['painTolerance'] }))}
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
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!canSubmit || isLoading}>
          {isLoading ? 'Salvando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default PatientAnamnesisForm;

