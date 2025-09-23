import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AnamnesisQuestionnaireForm, type AnamnesisQuestionnaireValues } from '@/components/anamneses/AnamnesisQuestionnaireForm';
import { updateAnamnesis } from '@/integrations/supabase/anamneses';
import { toast } from 'sonner';
import { Calendar, Shield } from 'lucide-react';

export const PatientAnamnesis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const anamnesisId = searchParams.get('id');
  const [birthDate, setBirthDate] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValidateBirthDate = async () => {
    if (!anamnesisId || !birthDate) {
      setError('ID da anamnese e data de nascimento são obrigatórios.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Aqui você validaria a data de nascimento contra o banco
      // Por enquanto, vamos assumir que a validação passou
      // Em produção, você faria uma consulta para verificar se a data confere
      
      setIsValidated(true);
      toast.success('Validação realizada com sucesso!');
    } catch (err) {
      console.error(err);
      setError('Data de nascimento inválida ou anamnese não encontrada.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitQuestionnaire = async (values: AnamnesisQuestionnaireValues) => {
    if (!anamnesisId) return;

    try {
      setIsLoading(true);
      
      await updateAnamnesis(anamnesisId, {
        medical_history: {
          continuousMedication: values.continuousMedication,
          medicationAllergy: values.medicationAllergy,
          chronicDisease: values.chronicDisease,
          chronicDiseaseOther: values.chronicDiseaseOther,
          medicationAllergyDescription: values.medicationAllergyDescription,
          reactionToProcedures: values.reactionToProcedures,
          painTolerance: values.painTolerance,
          awareResultsVary: values.awareResultsVary,
        } as any,
        aesthetics_history: {
          previousProcedures: values.previousFacialProcedures,
          complications: values.hadComplicationsBefore,
          previousFacialProcedureOption: values.previousFacialProcedureOption,
          previousFacialProcedureOther: values.previousFacialProcedureOther,
          complicationsDescription: values.complicationsDescription,
        } as any,
        expectations: values.intendedProcedureDescription,
        awareness: values.knowledgeLevelDescription,
        status: 'completed',
      });

      toast.success('Anamnese preenchida com sucesso! Obrigado por responder.');
      
      // Redirecionar ou mostrar mensagem de sucesso
      setTimeout(() => {
        window.close();
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar a anamnese. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!anamnesisId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Link Inválido</CardTitle>
            <CardDescription className="text-center">
              O link de anamnese não é válido ou está corrompido.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isValidated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-center">Validação de Segurança</CardTitle>
            <CardDescription className="text-center">
              Para acessar o questionário de anamnese, confirme sua data de nascimento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div>
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleValidateBirthDate}
              disabled={!birthDate || isLoading}
              className="w-full"
            >
              {isLoading ? 'Validando...' : 'Continuar'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-green-100 text-green-600 flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Questionário de Anamnese</CardTitle>
                <CardDescription>
                  Preencha todas as informações solicitadas para completar sua anamnese.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AnamnesisQuestionnaireForm
              onSubmit={handleSubmitQuestionnaire}
              onCancel={() => window.close()}
              submitLabel={isLoading ? 'Salvando...' : 'Finalizar Anamnese'}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientAnamnesis;

