import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PatientAnamnesisForm, type PatientAnamnesisFormValues } from '@/components/anamneses/PatientAnamnesisForm';
import { updateAnamnesis, getAnamnesisById, type AnamnesisWithPatient } from '@/integrations/supabase/anamneses';
import { toast } from 'sonner';
import { Calendar, Shield, Loader2 } from 'lucide-react';

export const PatientAnamnesis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const anamnesisId = searchParams.get('id');
  const [birthDate, setBirthDate] = useState('');
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [anamnesisData, setAnamnesisData] = useState<AnamnesisWithPatient | null>(null);
  const [patientData, setPatientData] = useState<AnamnesisWithPatient['patient'] | null>(null);

  // Carregar dados da anamnese e paciente
  useEffect(() => {
    const loadAnamnesisData = async () => {
      if (!anamnesisId) return;
      
      try {
        setIsLoadingData(true);
        const data = await getAnamnesisById(anamnesisId);
        
        if (!data) {
          setError('Anamnese não encontrada.');
          return;
        }

        setAnamnesisData(data);
        setPatientData(data.patient);
        
        // Se já tem dados do paciente, preencher automaticamente
        if (data.patient?.birth_date) {
          setBirthDate(data.patient.birth_date);
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados da anamnese.');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAnamnesisData();
  }, [anamnesisId]);

  const handleValidateBirthDate = async () => {
    if (!anamnesisId || !birthDate) {
      setError('ID da anamnese e data de nascimento são obrigatórios.');
      return;
    }

    if (!patientData) {
      setError('Dados do paciente não carregados.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Validar data de nascimento contra os dados reais do paciente
      const patientBirthDate = patientData.birth_date;
      if (birthDate !== patientBirthDate) {
        setError('Data de nascimento não confere com nossos registros.');
        return;
      }
      
      setIsValidated(true);
      toast.success('Validação realizada com sucesso!');
    } catch (err) {
      console.error(err);
      setError('Data de nascimento inválida ou anamnese não encontrada.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitQuestionnaire = async (values: PatientAnamnesisFormValues) => {
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

  // Loading state
  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <CardTitle className="text-center">Carregando...</CardTitle>
            <CardDescription className="text-center">
              Carregando dados da anamnese.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

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

  if (error && !isValidated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Erro</CardTitle>
            <CardDescription className="text-center">
              {error}
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
            {patientData && anamnesisData && (
              <PatientAnamnesisForm
                patientData={{
                  name: patientData.name,
                  phone: patientData.phone,
                  email: patientData.email,
                  birth_date: patientData.birth_date,
                }}
                procedureName={anamnesisData.procedure_name}
                onSubmit={handleSubmitQuestionnaire}
                onCancel={() => window.close()}
                submitLabel={isLoading ? 'Salvando...' : 'Finalizar Anamnese'}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientAnamnesis;

