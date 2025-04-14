
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Dados fictícios de especialidades e tipos de documentos
const SPECIALTIES = [
  "Clínica Geral",
  "Cardiologia",
  "Dermatologia",
  "Ortopedia",
  "Pediatria",
  "Psiquiatria",
  "Neurologia",
  "Oftalmologia",
  "Ginecologia",
  "Urologia",
];

const DOCUMENT_TYPES = [
  "Atestado Médico",
  "Laudo Médico",
  "Receita",
  "Solicitação de Exame",
  "Declaração",
  "Encaminhamento",
  "Relatório Médico",
];

export const CreateDocument = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    specialty: '',
    documentType: '',
    customInstructions: '',
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenerateDocument = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.patientName || !formData.specialty || !formData.documentType) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsGenerating(true);

    // Simulando a geração do documento com IA
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedContent(
        generateMockDocument(
          formData.patientName,
          formData.specialty,
          formData.documentType,
          formData.customInstructions
        )
      );
      toast.success('Documento gerado com sucesso!');
    }, 2500);
  };

  const handleSaveDocument = () => {
    if (!generatedContent) {
      toast.error('Gere o conteúdo do documento primeiro.');
      return;
    }

    setIsSaving(true);

    // Simulando o salvamento
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Documento salvo com sucesso!');
      navigate('/documentos');
    }, 1500);
  };

  // Função para gerar documento fictício com base nos inputs
  const generateMockDocument = (
    patientName: string,
    specialty: string,
    documentType: string,
    customInstructions: string
  ) => {
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    let content = '';
    
    switch (documentType) {
      case 'Atestado Médico':
        content = `ATESTADO MÉDICO\n\nAtesto para os devidos fins que o(a) paciente ${patientName} compareceu à consulta médica na especialidade de ${specialty} na data de ${currentDate} e necessita de afastamento de suas atividades por um período de 3 (três) dias a contar desta data.\n\n${customInstructions ? `Observações: ${customInstructions}\n\n` : ''}Código CID: Z00.0\n\n${currentDate}\n\nDr. Ricardo Silva\nCRM 12345 - ${specialty}`;
        break;
      case 'Receita':
        content = `RECEITA MÉDICA\n\nPaciente: ${patientName}\nData: ${currentDate}\n\nUso Interno:\n\n1. Paracetamol 750mg\n   Tomar 1 comprimido de 8 em 8 horas se dor ou febre.\n\n2. Amoxicilina 500mg\n   Tomar 1 comprimido de 8 em 8 horas por 7 dias.\n\n${customInstructions ? `Observações adicionais: ${customInstructions}\n\n` : ''}Dr. Ricardo Silva\nCRM 12345 - ${specialty}`;
        break;
      default:
        content = `${documentType.toUpperCase()}\n\nPaciente: ${patientName}\nData: ${currentDate}\nEspecialidade: ${specialty}\n\n${customInstructions ? `Informações adicionais: ${customInstructions}\n\n` : ''}Este documento foi gerado automaticamente pelo sistema MedicoDoc.\n\nDr. Ricardo Silva\nCRM 12345 - ${specialty}`;
    }
    
    return content;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Criar Documento</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Documento</CardTitle>
            <CardDescription>
              Preencha os dados para gerar o documento automaticamente com IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerateDocument} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nome do Paciente</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  placeholder="Nome completo do paciente"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidade</Label>
                <Select
                  value={formData.specialty}
                  onValueChange={(value) => handleSelectChange('specialty', value)}
                >
                  <SelectTrigger id="specialty">
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de Documento</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) => handleSelectChange('documentType', value)}
                >
                  <SelectTrigger id="documentType">
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customInstructions">Instruções Adicionais (opcional)</Label>
                <Textarea
                  id="customInstructions"
                  name="customInstructions"
                  placeholder="Adicione detalhes específicos ou instruções para personalizar o documento..."
                  value={formData.customInstructions}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full mt-2 bg-medico-600 hover:bg-medico-700"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar com IA
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização</CardTitle>
            <CardDescription>
              Conteúdo gerado pela IA com base nas informações fornecidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4 h-[360px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
              {generatedContent || "O conteúdo do documento será exibido aqui após a geração."}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              variant="outline"
              className="mr-2"
              disabled={!generatedContent || isSaving}
              onClick={() => setGeneratedContent('')}
            >
              Limpar
            </Button>
            <Button
              className="bg-medico-600 hover:bg-medico-700"
              disabled={!generatedContent || isSaving}
              onClick={handleSaveDocument}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Documento"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
